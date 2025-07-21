import type { ITask } from "./tasks.interface";

 export type IUpdateTask = Partial<ITask> & {_id: string};