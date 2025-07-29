import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./fetchWith.auth";

const shareTask = async ({taskId, sharedWith}: {taskId: string; sharedWith: string[]}) => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/tasks/${taskId}/share`,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({sharedWith}),
    });

    if (!response.ok) {
        throw new Error("Failed to share task");
    }
    return await response.json();
};

export function useSharedTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: shareTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["fetchTasks"]});
        },
        onError: (error) => {
            console.error("Error sharing task", error);
        },
    });
}