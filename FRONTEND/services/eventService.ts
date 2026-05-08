import type { Event } from "@/types/event";
import { events } from "@/lib/data/index";

// TODO (Backend Dev): Replace with real DB calls
// import { connectDB } from "@/config/db";
// import { EventModel } from "@/lib/models/Event";

export async function getEvents(): Promise<Event[]> {
  return events;
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  return events.find((e) => e.slug === slug);
}
