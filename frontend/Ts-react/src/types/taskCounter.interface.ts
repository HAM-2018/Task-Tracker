import type { ITask } from "./tasks.interface";

export type ITaskCounter = Pick<ITask, "status"> & {count: number};