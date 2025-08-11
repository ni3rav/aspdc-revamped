import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";

export function useProjects() {
  return useQuery({
    queryKey: ["fetch-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}
