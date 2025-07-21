import { injectable, inject } from "inversify";
import { TaskService } from "../tasks.service";
import { ITaskPagination } from "../interfaces/taskPagination.interface";
import { ITask } from "../interfaces/task.interface";
import { Types } from "mongoose";

@injectable()
export class GetTaskProvider {
  constructor(@inject(TaskService) private taskService: TaskService) {}

  public async findAllTasks(
    pagination: Partial<ITaskPagination> & { userId: string }
  ): Promise<{ data: ITask[]; meta: Record<string, number> }> {
    console.log("GetTaskProvider.findAllTasks() called");

    const objectUserId = new Types.ObjectId(pagination.userId);
    const userFilter = {
      $or: [ 
       {userId: objectUserId },
       {sharedWith: objectUserId},
      ],
    };

    // fetch all task to include completed 
    const tasks: ITask[] = await this.taskService.findActive({
      limit: pagination.limit ?? 10,
      page: pagination.page ?? 1,
      order: pagination.order ?? "asc",
      userId: pagination.userId,
      statuses: ["todo", "inProgress", "completed"],
    });

    const totalTasks = await this.taskService.countDocuments(userFilter);
    const completedTasks = await this.taskService.countDocuments({
      ...userFilter,
      status: "completed",
    });
    const todoTasks = await this.taskService.countDocuments({
      ...userFilter,
      status: "todo",
    });
    const inProgressTasks = await this.taskService.countDocuments({
      ...userFilter,
      status: "inProgress",
    });

    return {
      data: tasks,
      meta: {
        totalTasks,
        completedTasks,
        todoTasks,
        inProgressTasks,
      },
    };
  }
}
