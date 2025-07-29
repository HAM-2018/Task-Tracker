import type { IResponse } from "@/types/response.interface";
import type { ITask } from "@/types/tasks.interface";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "./fetchWith.auth";

const fetchTask = async (): Promise<IResponse<ITask[]>> => {

    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/tasks/`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Network response failed")
    }
    const json = await response.json();
    console.log("backend response meta:", json.meta);
    return json;
    
}

export function useFetchTasks(params: {}) {
    return useQuery({
        queryKey: ["fetchTasks", params],
        queryFn: fetchTask
    });
}