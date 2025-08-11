import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects } from "@/supabase/queries";
import { addProject, deleteProject, updateProject } from "@/supabase/mutations";
import { toast } from "sonner";
import { NewProject, Project } from "@/supabase/types";

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

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<Project> }) =>
      updateProject(id, project),
    onSuccess: () => {
      toast.success("project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-projects"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update project");
      console.error("Error updating project:", error.message);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      toast.success("project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-projects"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error.message);
    },
  });
}
