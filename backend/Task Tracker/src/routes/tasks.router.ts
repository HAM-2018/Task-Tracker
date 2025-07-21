import { Router, Request, Response, NextFunction } from "express";
import { TasksController } from "../tasks/tasks.controller";
import { injectable, inject } from "inversify";
import { ITask, IPartialTaskWithId } from "../tasks/interfaces/task.interface";
import { createTaskValidator } from "../tasks/validators/createTasks.validator";
import { validationResult } from "express-validator";
import { getTaskValidator } from "../tasks/validators/getTasks.validator";
import { StatusCodes } from "http-status-codes";
import { updateTaskValidator } from "../tasks/validators/updateTask.validator";
import { resourceLimits } from "worker_threads";
import { authenticate } from "../middleware/authentication.middleware";
import { AuthenticatedRequest } from "../interfaces/authenticate.user.interface";
import { Auth } from "mongodb";


@injectable()
export class TaskRouter {
    public router: Router
    
    constructor(@inject(TasksController) private tasksController: TasksController) {
        this.router = Router();
        console.log("TaskRouter initialized");
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    next();
  },
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    next();
  },
  getTaskValidator,

  async (req: AuthenticatedRequest<any>, res: Response) => {

    const result = validationResult(req);

    if (result.isEmpty()) {
      console.log(" Validation passed");
      await this.tasksController.handleGetTasks(req, res);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json(result.array());
    }
  }
);
        this.router.post(
            "/create",
            authenticate,
            createTaskValidator,
            async (req: Request<{},{}, ITask>, res: Response)=>{
                const result = validationResult(req);

                if (result.isEmpty()) {
                 const newTask = await this.tasksController.handlePostTasks(req, res);
                 res.status(StatusCodes.CREATED).json(newTask);

                } else {
                    res.status(StatusCodes.BAD_REQUEST).json(result.array());
                }                
        }
    );

        this.router.patch(
  "/update",
  authenticate,
  updateTaskValidator,
  async (req: AuthenticatedRequest<IPartialTaskWithId>, res: Response): Promise<void> => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        meta: { status: 400, message: "Validation error" },
        error: result.array(),
      });
      return;
    }
    try {
      const updatedTask = await this.tasksController.handlePatchTasks(req);

      res.status(200).json({
        meta: { status: 200, message: "Task updated successfully" },
        data: updatedTask,
      });
      return; 
    } catch (error: any) {
      res.status(500).json({
        meta: { status: 500, message: "Update failed" },
        error: error.message || "Something went wrong",
      });
      return;
    }
  }
);

        this.router.delete("/:id", authenticate, async (req: Request, res: Response) => {
            try {
                const deleted = await this.tasksController.handleDeleteTask(req, res);
                res.status(StatusCodes.OK).json(deleted);
                } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to delete task",
            error: err,
            });
        }
    });

    this.router.post(
  "/:id/share",
  authenticate,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sharedUserIds = req.body.sharedWith;

      if (!Array.isArray(sharedUserIds) || sharedUserIds.length === 0) {
        res.status(400).json({ message: "No users to share with." });
        return;
      }

      const result = await this.tasksController.handleShareTask(req, res);
      res.status(StatusCodes.OK).json(result);
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to share task",
        error: err.message || err,
      });
    }
  }
);
}
}

