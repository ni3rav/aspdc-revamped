import { supabase } from "@/lib/supabase-client";
import {
  Achievement,
  Blog,
  LeaderboardEntry,
  Project,
  UpcomingEvent,
} from "@/supabase/types";

export const fetchAcv = async (): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchBlogs = async (): Promise<Blog[]> => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("date", { ascending: false } );

  if (error) throw error;
  return data;
};

export const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

export const fetchUpcomingEvents = async (): Promise<UpcomingEvent[]> => {
  const { data, error } = await supabase
    .from("upcoming_events")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};
