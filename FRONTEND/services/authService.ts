import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { setToken, clearToken } from "@/lib/api";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  _client = createClient(url, key);
  return _client;
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await getClient().auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw new Error(error.message);
  if (data.session?.access_token) setToken(data.session.access_token);
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await getClient().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (data.session?.access_token) setToken(data.session.access_token);
  return data;
}

export async function signOut() {
  await getClient().auth.signOut();
  clearToken();
}

export async function getSession() {
  const { data } = await getClient().auth.getSession();
  if (data.session?.access_token) setToken(data.session.access_token);
  return data.session;
}

export async function getCurrentUser() {
  const { data } = await getClient().auth.getUser();
  return data.user ?? null;
}
