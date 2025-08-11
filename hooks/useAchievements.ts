import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAcv } from "@/supabase/queries";
import { addAchievement, NewAchievement } from "@/supabase/mutations";
import { toast } from "sonner";

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
