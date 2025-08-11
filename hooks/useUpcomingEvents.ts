import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUpcomingEvents } from "@/supabase/queries";
import { addUpcomingEvent, NewUpcomingEvent } from "@/supabase/mutations";
import { toast } from "sonner";

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ["fetch-upcoming-events"],
    queryFn: fetchUpcomingEvents,
  });
}

export function useAddUpcomingEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: NewUpcomingEvent) => addUpcomingEvent(event),
    onSuccess: () => {
      toast.success("Upcoming event added successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-upcoming-events"] });
    },
    onError: () => {
      toast.error("Failed to add upcoming event");
    },
  });
}
