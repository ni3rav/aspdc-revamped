import { supabase } from "@/lib/supabase-client";
import type {
  Achievement,
  Blog,
  Event,
  LeaderboardEntry,
  Project,
  UpcomingEvent,
} from "@/supabase/types";

export type NewProject = Omit<Project, "id" | "created_at">;
export type NewAchievement = Omit<Achievement, "id" | "created_at">;
export type NewBlog = Omit<Blog, "id" | "created_at">;
export type NewEvent = Omit<Event, "id" | "created_at">;
export type NewLeaderboardEntry = Omit<LeaderboardEntry, "id" | "created_at">;
export type NewUpcomingEvent = Omit<UpcomingEvent, "id" | "created_at">;

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
