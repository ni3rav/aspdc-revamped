import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects } from "@/supabase/queries";
import { addProject, type NewProject } from "@/supabase/mutations";
import { toast } from "sonner";

export function useProjects() {
  return useQuery({
    queryKey: ["fetch-projects"],
    queryFn: fetchProjects,
  });
}

export function useAddProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: NewProject) => addProject(project),
    onSuccess: () => {
      toast.success("project added successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-projects"] });
    },
    onError: (error: Error) => {
      toast.error("failed to add project");
      console.error("Error adding project:", error.message);
    },
  });
}
