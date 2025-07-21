import { Schema, Model, model } from "mongoose";
import { ITask } from "./interfaces/task.interface";

const taskSchema: Schema<ITask> = new Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        maxLength: [150, "Title cannot exceed 150 characters"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Task description is required"],
        maxLength: [300, "description cannot exceed 150 characters"],
        trim: true,
    },
    status: {
        type: String,
        required: [true, "task must have a status"],
        enum: ["todo", "inProgress", "completed"],
        default: "todo",
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "normal", "high"],
        default: "normal",
    },
    dueDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
},{
    timestamps: true,
});

export const Task: Model<ITask> = model("Task", taskSchema);
