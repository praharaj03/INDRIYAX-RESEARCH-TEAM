const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "" : "http://localhost:5000");

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data: any = {};

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
      message: data.message || "Unauthorized",
      unauthorized: true,
    };
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "API error");
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