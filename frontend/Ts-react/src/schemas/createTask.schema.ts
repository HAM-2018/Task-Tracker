import {z} from "zod";


export const createTaskSchema = z.object({
    title: z.string().max(100, {message: "Title length can not exceed 100 characters"}),
    dueDate: z.date({
        required_error: "Due date is mandatory",
    }),
    description: z.string().max(500),
    status: z.enum(["todo", "inProgress", "completed"], {
        message: "Status is required",
    }),
    priority: z.enum(["low", "normal", "high"], {
        message: "Priority is required",
    }),
});