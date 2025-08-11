import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEvents } from "@/supabase/queries";
import { addEvent, NewEvent } from "@/supabase/mutations";
import { toast } from "sonner";

export function useEvents() {
  return useQuery({
    queryKey: ["fetch-events"],
    queryFn: fetchEvents,
  });
}

export function useAddEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: NewEvent) => addEvent(event),
    onSuccess: () => {
      toast.success("Event added successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-events"] });
    },
    onError: () => {
      toast.error("Failed to add event");
    },
  });
}
