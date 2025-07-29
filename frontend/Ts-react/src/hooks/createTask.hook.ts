import type { IResponse } from "@/types/response.interface";
import type { ITask } from "@/types/tasks.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./fetchWith.auth";

const createTask = async (task: ITask) => {

    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/tasks/create`, {
        method: "POST",
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("Network response failed")
    }
    return await response.json()
}

export function useCreateTask () {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTask,
        onSuccess: (response: IResponse<ITask>) => {
            queryClient.invalidateQueries({ queryKey: ["fetchTasks"]});
            console.log(response);
        },
        onError: (error) =>{
            console.log(error);
        },
    });
}