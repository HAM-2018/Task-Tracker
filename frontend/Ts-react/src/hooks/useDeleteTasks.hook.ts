import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./fetchWith.auth";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchWithAuth(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchTasks"] });
    },
  });
};
