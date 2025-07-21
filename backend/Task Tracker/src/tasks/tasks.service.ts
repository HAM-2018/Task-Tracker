import { injectable } from "inversify";
import { Task } from "./task.schema";
import { FilterQuery, Model } from "mongoose";
import { IPartialTaskWithId, ITask } from "./interfaces/task.interface";
import { ITaskPagination } from "./interfaces/taskPagination.interface";
import { Types } from "mongoose";
import { query } from "express-validator";

@injectable()
export class TaskService {
    private taskModel: Model<ITask> = Task;

    public async createTask (taskData: ITask, userId: string) {
        const taskWtihUser = {
            ...taskData,
            userId: new Types.ObjectId(userId),
        };

        const newTask = await new this.taskModel(taskWtihUser).save();
        return newTask;
    }

    public async findById(_id: string) {
        return await this.taskModel.findById(_id);
    }

    public async findActive(
  pagination: ITaskPagination & { userId: string; statuses?: string[] }
) {
  const statuses = pagination.statuses ?? ["todo", "inProgress"];
  const filter = {
    status: { $in: statuses },
    $or: [
    { userId: new Types.ObjectId(pagination.userId) },
    { sharedWith: new Types.ObjectId(pagination.userId)},
    ],
  };

  // priority order
  const sortStage = {
    $addFields: {
      priorityOrder: {
        $switch: {
          branches: [
            { case: { $eq: ["$priority", "high"] }, then: 1 },
            { case: { $eq: ["$priority", "normal"] }, then: 2 },
            { case: { $eq: ["$priority", "low"] }, then: 3 },
          ],
          default: 4, // in case a tak has an unknown priority
        },
      },
    },
  };

  const result = await this.taskModel.aggregate([
    { $match: filter },
    sortStage,
    {
      $sort: {
        priorityOrder: 1,
        dueDate: 1,
      },
    },
    {
      $skip: (pagination.page - 1) * pagination.limit,
    },
    {
      $limit: pagination.limit,
    },
  ]);

  return result;
}

    
    public async countDocuments(filter: FilterQuery<ITask> = {}) {
        const queryFilter: FilterQuery<ITask> = { ...filter };
        if (queryFilter.userId) {
            queryFilter.userId = new Types.ObjectId(queryFilter.userId);
        }

        return await this.taskModel.countDocuments(queryFilter);
    }
    

    public async deleteTaskById(_id: string) {
  try {
    const deleted = await this.taskModel.findByIdAndDelete(_id); // assuming Mongoose
    return deleted;
  } catch (error) {
    throw new Error(`Failed to delete task with id ${_id}`);
  }
}


}