import { NextRequest, NextResponse } from "next/server";
import { signSession, type GoogleProfile } from "@/lib/google-session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("google_oauth_state")?.value;
  const error = request.nextUrl.searchParams.get("error");
  if (error || !code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/?google=failed", origin));
  }
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: "OAuth server configuration is incomplete." }, { status: 503 });
  }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
      cache: "no-store"
    });
    if (!tokenResponse.ok) throw new Error("Google token exchange failed");
    const tokens = await tokenResponse.json() as { access_token?: string };
    if (!tokens.access_token) throw new Error("Google did not return an access token");
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` }, cache: "no-store"
    });
    if (!profileResponse.ok) throw new Error("Google profile request failed");
    const raw = await profileResponse.json() as { id?: string; email?: string; name?: string; picture?: string; verified_email?: boolean };
    if (!raw.id || !raw.email || raw.verified_email === false) throw new Error("Google account profile is incomplete");
    const profile: GoogleProfile = { sub: raw.id, email: raw.email, name: raw.name, picture: raw.picture };
    const response = NextResponse.redirect(new URL("/?google=connected", origin));
    response.cookies.set("creativeops_google_session", signSession(profile), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60
    });
    response.cookies.delete("google_oauth_state");
    return response;
  } catch {
    return NextResponse.redirect(new URL("/?google=failed", origin));
  }
}
