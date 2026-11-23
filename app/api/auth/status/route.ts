import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/google-session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const configured = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REDIRECT_URI &&
    process.env.SESSION_SECRET &&
    process.env.SESSION_SECRET.length >= 32
  );
  try {
    const profile = readSession(request.cookies.get("creativeops_google_session")?.value);
    return NextResponse.json({
      connected: Boolean(profile),
      profile: profile ? { email: profile.email, name: profile.name, picture: profile.picture } : null,
      configured
    });
  } catch {
    return NextResponse.json({ connected: false, profile: null, configured });
  }
}
