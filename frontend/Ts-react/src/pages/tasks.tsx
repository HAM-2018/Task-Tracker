import { type FC, type ReactElement} from "react";
import { TasksCounter } from "@/components/tasksCounter/tasksCounter";
import { Task } from "@/components/task/task";
import { TaskSidebar } from "@/components/taskSidebar/taskSidebar";
import { useFetchTasks } from "@/hooks/useFetchTasks.hook";
import type { ITask } from "@/types/tasks.interface";

function todaysDate() {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
  };
  return today.toLocaleDateString("en-GB", options);
}

export const Tasks: FC = (): ReactElement => {
  const { data } = useFetchTasks({});

  const tasks = Array.isArray(data?.data) ? data.data as ITask[] : [];
   console.log(tasks.length);

  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(t => t.status === "todo").length;
  const inProgressTasks = tasks.filter (t => t.status === "inProgress").length;
  const completedTasks = tasks.filter (t => t.status === "completed").length;

 

  return (
     <section key={tasks.length} className="flex flex-row w-full p-4 gap-8">
      <section className="flex basis-2/3 justify-center">
        <div className="flex flex-col w-4/5 p-4">
          <h1 className="text-white font-bold text-2xl mb-8">{todaysDate()}</h1>

          <div className="flex justify-around mb-12">
            <TasksCounter status="todo" count={todoTasks} />
            <TasksCounter status="inProgress" count={inProgressTasks} />
            <TasksCounter status="completed" count={completedTasks} />
          </div>

          {data?.data &&
            Array.isArray(data.data) &&
            data.data.every(
              (item): item is ITask =>
                "_id" in item &&
                "title" in item &&
                "status" in item &&
                "priority" in item &&
                "dueDate" in item
            ) &&
            data.data.map((task) => (
              <Task
                key={task._id}
                _id={task._id}
                title={task.title}
                description={task.description}
                status={task.status}
                priority={task.priority}
                dueDate={task.dueDate}
                sharedWith={task.sharedWith}
              />
            ))}
        </div>
      </section>

      <section className="flex basis-1/3">
        <TaskSidebar />
      </section>
    </section>
  );
};
