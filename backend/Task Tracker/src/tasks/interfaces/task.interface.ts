import { Types } from "mongoose";

export interface ITask {
    title: string;
    description: string;
    status: "todo" | "inProgress" | "completed";
    priority: "low" | "normal" | "high";
    dueDate: Date;
    userId: Types.ObjectId;
    sharedWith: string[];

}

export interface IPartialTaskWithId extends Partial<ITask> {
    _id: string;
}