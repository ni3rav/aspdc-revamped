import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";

export function useBlogs() {
  return useQuery({
    queryKey: ["fetch-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
