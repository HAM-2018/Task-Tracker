import { injectable, inject } from "inversify";
import { UserController } from "../user/user.controller";
import { Request, Response } from "express";
import { ITask, IPartialTaskWithId } from "./interfaces/task.interface";
import { Document } from "mongoose";
import { TaskService } from "./tasks.service";
import { updateTaskProvider } from "./providers/updateTask.provider";
import { matchedData } from "express-validator";
import { ITaskPagination } from "./interfaces/taskPagination.interface";
import { GetTaskProvider } from "./providers/getTasks.provider";
import { AuthenticatedRequest } from "../interfaces/authenticate.user.interface";
import { ObjectId } from "mongodb";




@injectable()
export class TasksController {
    constructor(
        @inject(UserController) private userController: UserController,
        @inject(TaskService) private taskService: TaskService,
        @inject(updateTaskProvider) private updateTaskProvider: updateTaskProvider,
        @inject(GetTaskProvider) private getTasksProvider: GetTaskProvider
    ) {
        console.log("📦 TasksController constructor called");
        console.log("📦 getTasksProvider injected:", !!getTasksProvider); // should be true
    }

    public async handleGetTasks(req: AuthenticatedRequest, res: Response) {
        const validatedData: Partial<ITaskPagination> = matchedData(req);
        const userId = req.user?.userId;

        if(!userId){
          return res.status(401).json({ message: "Unauthorized" });
        }

        try {
          const filterTaskWithUser = {
            ...validatedData,
            userId,
          };
          const tasks: {data: ITask[]; meta: {}} = await this.getTasksProvider
            .findAllTasks(filterTaskWithUser);
            res.status(200).json(tasks);
            console.log("Tasks and meta returned:", tasks.meta); // check if counts are scoped to user
        
          } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: "Failed to fetch tasks"});
        }
        
    }
    
    public async handlePostTasks(req: AuthenticatedRequest<ITask>, res: Response) {
        const validatedData: ITask = matchedData(req);
        const userId = req.user?.userId;
        if(!userId){
          return res.status(401).json({ message: "Unauthorized" });
        }

        try {
          const newTask = await this.taskService.createTask(validatedData, userId);
          res.status(201).json(newTask);
        } catch(error: any) {
          console.error(error);
            res.status(500).json({ message: "Failed to create task"});
        }
        
    }

    public async handleShareTask(req: AuthenticatedRequest, res: Response) {
  const taskId = req.params.id;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sharedUserIds: string[] = req.body.sharedWith;
  const task = await this.taskService.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.userId.toString() !== userId) {
    return res.status(403).json({ message: "Forbidden: you do not own this task." });
  }
  const uniqueUsers = Array.from(new Set([...(task.sharedWith || []), ...sharedUserIds]));

  task.sharedWith = uniqueUsers;
  await task.save();
  return { message: "Task shared successfully", sharedWith: uniqueUsers };
}


    public async handlePatchTasks(
  req: AuthenticatedRequest<IPartialTaskWithId>): Promise<Document> {
  const validatedData: IPartialTaskWithId = {
    ...matchedData(req),
    userId: req.user?.userId ? new ObjectId(req.user.userId) : undefined, // attach userId for ownership 
  };

  try {
    return await this.updateTaskProvider.updateTask(validatedData);
  } catch (error: any) {
    throw new Error(error.message || "Failed to update task");
  }
}


public async handleDeleteTask(req: Request, res: Response) {
  const taskId = req.params.id;
  const deleted = await this.taskService.deleteTaskById(taskId);
  return { message: "Task deleted", data: deleted };
}

}