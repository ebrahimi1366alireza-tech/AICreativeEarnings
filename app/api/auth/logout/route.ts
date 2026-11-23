import { NextResponse } from "next/server";
import { clearSupabaseSessionCookies } from "@/lib/supabase-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("creativeops_google_session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  clearSupabaseSessionCookies(response);
  return response;
}
