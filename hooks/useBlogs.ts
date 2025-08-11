import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBlogs } from "@/supabase/queries";
import { addBlog, NewBlog } from "@/supabase/mutations";
import { toast } from "sonner";

export function useBlogs() {
  return useQuery({
    queryKey: ["fetch-blogs"],
    queryFn: fetchBlogs,
  });
}

export function useAddBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blog: NewBlog) => addBlog(blog),
    onSuccess: () => {
      toast.success("Blog added successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-blogs"] });
    },
    onError: () => {
      toast.error("Failed to add blog");
    },
  });
}
