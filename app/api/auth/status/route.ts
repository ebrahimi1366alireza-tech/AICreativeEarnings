import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/google-session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const profile = readSession(request.cookies.get("creativeops_google_session")?.value);
    return NextResponse.json({ connected: Boolean(profile), profile: profile ? { email: profile.email, name: profile.name, picture: profile.picture } : null });
  } catch {
    return NextResponse.json({ connected: false, profile: null, configured: false });
  }
}
