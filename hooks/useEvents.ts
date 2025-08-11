import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";

export function useEvents() {
  return useQuery({
    queryKey: ["fetch-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
