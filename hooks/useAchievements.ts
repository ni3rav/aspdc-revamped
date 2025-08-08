import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
