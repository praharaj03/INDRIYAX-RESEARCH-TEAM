import type { News } from "@/types/news";
import { apiFetch, getToken } from "@/lib/api";

function isAdminContext(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/admin");
}

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

export async function getNews(): Promise<News[]> {
  try {
    if (isAdminContext()) {
      const data = await adminFetch("/api/admin/news");
      return data.data ?? [];
    }
    const data = await apiFetch("/api/v1/posts");
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<News | null> {
  try {
    const data = await apiFetch(`/api/v1/posts/${slug}`);
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function createPost(payload: {
  title: string;
  content: string;
  tags?: string[];
  coverImage?: string;
  excerpt?: string;
  published?: boolean;
  isPremium?: boolean;
}) {
  if (isAdminContext()) {
    const data = await adminFetch("/api/admin/news", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  }
  const token = getToken();
  const data = await apiFetch("/api/v1/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function updatePost(
  id: string,
  payload: Partial<{
    title: string;
    content: string;
    tags: string[];
    coverImage: string;
    excerpt: string;
    published: boolean;
    isPremium: boolean;
  }>
) {
  if (isAdminContext()) {
    const data = await adminFetch(`/api/admin/news/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return data.data;
  }
  const token = getToken();
  const data = await apiFetch(`/api/v1/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function deletePost(id: string) {
  if (isAdminContext()) {
    return adminFetch(`/api/admin/news/${id}`, { method: "DELETE" });
  }
  const token = getToken();
  return apiFetch(`/api/v1/posts/${id}`, { method: "DELETE" }, token ?? undefined);
}
