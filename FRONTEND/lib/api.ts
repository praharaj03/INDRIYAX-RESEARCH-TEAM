/**
 * API client utility
 * 
 * On the client (browser): requests go to the Next.js server at the same origin,
 * which then proxies to the Express backend via /api/v1/[...path]/route.ts
 * 
 * On the server (SSR): requests go directly to the backend URL
 */

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use relative URLs (handled by Next.js proxy)
    return "";
  }
  // Server-side: call backend directly
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  let data: Record<string, unknown> = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  // Handle unauthorized separately
  if (res.status === 401) {
    console.warn("Unauthorized request");
    return {
      success: false,
      message: (data.message as string) || "Unauthorized",
      unauthorized: true,
    };
  }

  if (!res.ok || data.success === false) {
    throw new Error((data.message as string) || "API error");
  }

  return data;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sb_token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("sb_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("sb_token");
}
