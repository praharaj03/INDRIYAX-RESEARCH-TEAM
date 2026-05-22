import type { Event } from "@/types/event";
import { apiFetch, getToken } from "@/lib/api";

export async function getEvents(): Promise<Event[]> {
  try {
    const data = await apiFetch("/api/v1/events");
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const data = await apiFetch(`/api/v1/events/${slug}`);
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function createEvent(payload: Partial<Event>) {
  const token = getToken();
  const data = await apiFetch("/api/v1/events", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function updateEvent(id: string, payload: Partial<Event>) {
  const token = getToken();
  const data = await apiFetch(`/api/v1/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function deleteEvent(id: string) {
  const token = getToken();
  return apiFetch(`/api/v1/events/${id}`, { method: "DELETE" }, token ?? undefined);
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const token = getToken();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const data = await apiFetch("/api/v1/uploads/image", {
    method: "POST",
    body: fd,
  }, token ?? undefined);
  return data.data.url;
}
