import type { Event } from "@/types/event";
import { apiFetch, getToken } from "@/lib/api";

// Check if we're in admin context (client-side only)
function isAdminContext(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/admin");
}

// Fetch wrapper for Next.js internal admin API routes (no base URL, uses cookies for auth)
async function adminFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(path, { ...options, headers });

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || data.error || "API error");
  }

  return data;
}

export async function getEvents(): Promise<Event[]> {
  try {
    if (isAdminContext()) {
      const data = await adminFetch("/api/admin/events");
      return data.data ?? [];
    }
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
  if (isAdminContext()) {
    const data = await adminFetch("/api/admin/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  }
  const token = getToken();
  const data = await apiFetch("/api/v1/events", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function updateEvent(id: string, payload: Partial<Event>) {
  if (isAdminContext()) {
    const data = await adminFetch(`/api/admin/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return data.data;
  }
  const token = getToken();
  const data = await apiFetch(`/api/v1/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function deleteEvent(id: string) {
  if (isAdminContext()) {
    return adminFetch(`/api/admin/events/${id}`, { method: "DELETE" });
  }
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
