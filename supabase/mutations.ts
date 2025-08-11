import { supabase } from "@/lib/supabase-client";
import type {
  Achievement,
  Blog,
  LeaderboardEntry,
  NewAchievement,
  NewBlog,
  NewEvent,
  NewLeaderboardEntry,
  NewProject,
  NewUpcomingEvent,
  Project,
  UpcomingEvent,
} from "@/supabase/types";

//* insertions
export async function addProject(project: NewProject) {
  const { error } = await supabase.from("projects").insert(project);

  if (error) {
    throw new Error(error.message);
  }
}

export async function addAchievement(achievement: NewAchievement) {
  const { error } = await supabase.from("achievements").insert(achievement);
  if (error) throw new Error(error.message);
}

export async function addBlog(blog: NewBlog) {
  const { error } = await supabase.from("blogs").insert(blog);
  if (error) throw new Error(error.message);
}

export async function addEvent(event: NewEvent) {
  const { error } = await supabase.from("events").insert(event);
  if (error) throw new Error(error.message);
}

export async function addLeaderboardEntry(entry: NewLeaderboardEntry) {
  const { error } = await supabase.from("leaderboard").insert(entry);
  if (error) throw new Error(error.message);
}

export async function addUpcomingEvent(event: NewUpcomingEvent) {
  const { error } = await supabase.from("upcoming_events").insert(event);
  if (error) throw new Error(error.message);
}

//* updation
export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAchievement(
  id: string,
  updates: Partial<Achievement>
) {
  const { error } = await supabase
    .from("achievements")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function updateBlog(id: string, updates: Partial<Blog>) {
  const { error } = await supabase.from("blogs").update(updates).eq("id", id);

  if (error) throw error;
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  const { error } = await supabase.from("events").update(updates).eq("id", id);

  if (error) throw error;
}

export async function updateLeaderBoardEntry(
  id: string,
  updates: Partial<LeaderboardEntry>
) {
  const { error } = await supabase
    .from("leaderboard")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function updatedUpcomingEvent(
  id: string,
  updates: Partial<UpcomingEvent>
) {
  const { error } = await supabase
    .from("upcoming_events")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

//*deletion

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
}

export async function deleteAcv(id: string) {
  const { error } = await supabase.from("achievements").delete().eq("id", id);

  if (error) throw error;
}

export async function deleteBlog(id: string) {
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) throw error;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) throw error;
}

export async function deleteLeaderboardEntry(id: string) {
  const { error } = await supabase.from("leaderboard").delete().eq("id", id);

  if (error) throw error;
}

export async function deleteUpcomingEvent(id: string) {
  const { error } = await supabase
    .from("upcoming_events")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
