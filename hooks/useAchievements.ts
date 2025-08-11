import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAcv } from "@/supabase/queries";
import {
  addAchievement,
  deleteAcv,
  updateAchievement,
} from "@/supabase/mutations";
import { toast } from "sonner";
import { Achievement, NewAchievement } from "@/supabase/types";

export function useAchievements() {
  return useQuery({
    queryKey: ["fetch-achievements"],
    queryFn: fetchAcv,
  });
}

export function useAddAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (achievement: NewAchievement) => addAchievement(achievement),
    onSuccess: () => {
      toast.success("Achievement added successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-achievements"] });
    },
    onError: () => {
      toast.error("Failed to add achievement");
    },
  });
}

export function useUpdateAcv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, acv }: { id: string; acv: Partial<Achievement> }) =>
      updateAchievement(id, acv),
    onSuccess: () => {
      toast.success("Achievement updated successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-achievements"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update achievement");
      console.error("Error updating :", error.message);
    },
  });
}

export function useDeleteAcv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAcv(id),
    onSuccess: () => {
      toast.success("achievement deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-achievements"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete achievement");
      console.error("Error deleting achievement:", error.message);
    },
  });
}
