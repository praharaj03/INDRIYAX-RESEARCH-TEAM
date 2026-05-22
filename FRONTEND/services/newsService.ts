import type { News } from "@/types/news";
import { apiFetch, getToken } from "@/lib/api";

export async function getNews(): Promise<News[]> {
  try {
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

export async function createPost(payload: { title: string; content: string; tags?: string[]; coverImage?: string }) {
  const token = getToken();
  const data = await apiFetch("/api/v1/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function updatePost(id: string, payload: Partial<{ title: string; content: string; tags: string[] }>) {
  const token = getToken();
  const data = await apiFetch(`/api/v1/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token ?? undefined);
  return data.data;
}

export async function deletePost(id: string) {
  const token = getToken();
  return apiFetch(`/api/v1/posts/${id}`, { method: "DELETE" }, token ?? undefined);
}
