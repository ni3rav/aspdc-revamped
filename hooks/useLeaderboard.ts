import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";

export function useLeaderboard() {
  return useQuery({
    queryKey: ["fetch-leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("rating", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
