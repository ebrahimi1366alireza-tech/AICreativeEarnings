import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/google-session";
import { getSupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const signedIn = Boolean(readSession(request.cookies.get("creativeops_google_session")?.value)) ||
    Boolean(await getSupabaseUser(request.cookies.get("creativeops_supabase_access")?.value));
  if (!signedIn) return NextResponse.redirect(new URL("/?gmail=login-required", request.url));
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri || !process.env.GOOGLE_CLIENT_SECRET || !process.env.SESSION_SECRET) {
    return NextResponse.redirect(new URL("/?gmail=not-configured", request.url));
  }
  const state = randomBytes(24).toString("hex");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile https://www.googleapis.com/auth/gmail.readonly");
  url.searchParams.set("state", state);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent select_account");
  url.searchParams.set("include_granted_scopes", "true");
  const response = NextResponse.redirect(url);
  response.cookies.set("google_oauth_state_gmail", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
  return response;
}
