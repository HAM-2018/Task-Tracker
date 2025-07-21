import { Application } from "express";
import { container } from "./container";
import { TaskRouter } from "../routes/tasks.router";
import { UserRouter } from "../routes/user.router";


export function addRoutes(app: Application): Application {
    console.log("✅ addRoutes called");

    const taskRouter = container.get<TaskRouter>(TaskRouter);
    const userRouter = container.get<UserRouter>(UserRouter);

    app.use("/tasks", taskRouter.router);
    app.use("/auth", userRouter.router)

    return app;
}