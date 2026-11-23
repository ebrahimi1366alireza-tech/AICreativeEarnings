import { NextResponse } from "next/server";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export type SupabaseSession = { access_token?: string; refresh_token?: string; expires_in?: number; user?: { id?: string; email?: string; user_metadata?: { full_name?: string; name?: string } } };

export async function supabaseAuthRequest(path: string, body?: unknown, accessToken?: string) {
  if (!URL || !KEY) throw new Error("Supabase Auth is not configured");
  const response = await fetch(`${URL}/auth/v1/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      apikey: KEY,
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store"
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

export function setSupabaseSessionCookies(response: NextResponse, session: SupabaseSession) {
  const secure = process.env.NODE_ENV === "production";
  if (session.access_token) response.cookies.set("creativeops_supabase_access", session.access_token, {
    httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: Math.max(60, session.expires_in || 3600)
  });
  if (session.refresh_token) response.cookies.set("creativeops_supabase_refresh", session.refresh_token, {
    httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30
  });
}

export function clearSupabaseSessionCookies(response: NextResponse) {
  response.cookies.set("creativeops_supabase_access", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  response.cookies.set("creativeops_supabase_refresh", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getSupabaseUser(accessToken?: string) {
  if (!accessToken) return null;
  const result = await supabaseAuthRequest("user", undefined, accessToken).catch(() => null);
  if (!result?.ok || !result.data?.id || !result.data?.email) return null;
  return { id: String(result.data.id), email: String(result.data.email), name: String(result.data.user_metadata?.full_name || result.data.user_metadata?.name || "") };
}
