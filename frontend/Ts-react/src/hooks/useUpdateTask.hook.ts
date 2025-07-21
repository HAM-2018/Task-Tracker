import type { IUpdateTask } from "@/types/updateTask.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./fetchWith.auth";

const updateTask = async (task: IUpdateTask) => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}tasks/update`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("Network response failed")
    }
    return await response.json()
}

export function useUpdateTask () {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTask,
        onSuccess: (response) => {
            console.log(response);
            queryClient.invalidateQueries({queryKey: ["fetchTasks"]});
            
        },
        onError: (error) =>{
            console.log(error);
        },
    });
}