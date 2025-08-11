import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/supabase/queries";
import { addLeaderboardEntry, NewLeaderboardEntry } from "@/supabase/mutations";
import { toast } from "sonner";

export function useLeaderboard() {
  return useQuery({
    queryKey: ["fetch-leaderboard"],
    queryFn: fetchLeaderboard,
  });
}

export function useAddLeaderboardEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: NewLeaderboardEntry) => addLeaderboardEntry(entry),
    onSuccess: () => {
      toast.success("Leaderboard entry added successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-leaderboard"] });
    },
    onError: () => {
      toast.error("Failed to add leaderboard entry");
    },
  });
}
