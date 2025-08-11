export interface Event {
  id: string;
  name: string;
  date: Date;
  details: string;
  created_at: Date;
}

export type EventsResponse = Event[];
