import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser, setSupabaseSessionCookies, supabaseAuthRequest, type SupabaseSession } from "@/lib/supabase-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const access = request.cookies.get("creativeops_supabase_access")?.value;
  const refresh = request.cookies.get("creativeops_supabase_refresh")?.value;
  let user = await getSupabaseUser(access);
  let session: SupabaseSession | null = null;

  if (!user && refresh) {
    const renewed = await supabaseAuthRequest("token?grant_type=refresh_token", { refresh_token: refresh }).catch(() => null);
    if (renewed?.ok && renewed.data?.access_token) {
      session = renewed.data as SupabaseSession;
      user = await getSupabaseUser(session.access_token);
    }
  }

  const response = NextResponse.json({
    connected: Boolean(user),
    profile: user ? { email: user.email, name: user.name } : null,
    emailAuthConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  }, { headers: { "Cache-Control": "no-store" } });

  if (session) setSupabaseSessionCookies(response, session);
  if (!user && refresh && !session) {
    response.cookies.set("creativeops_supabase_access", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
    response.cookies.set("creativeops_supabase_refresh", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  }
  return response;
}
