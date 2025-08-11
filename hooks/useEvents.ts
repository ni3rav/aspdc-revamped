import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEvents } from "@/supabase/queries";
import { addEvent, deleteEvent, updateEvent } from "@/supabase/mutations";
import { toast } from "sonner";
import { NewEvent } from "@/supabase/types";

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

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: Partial<Event> }) =>
      updateEvent(id, event),
    onSuccess: () => {
      toast.success("event updated successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-events"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update blog");
      console.error("Error updating blog:", error.message);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      toast.success("event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-events"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete blog");
      console.error("Error deleting blog:", error.message);
    },
  });
}
