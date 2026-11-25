import { NextResponse } from "next/server";
import { setSupabaseSessionCookies, supabaseAuthRequest, type SupabaseSession } from "@/lib/supabase-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) {
      return NextResponse.json({ error: "درخواست معتبر نیست." }, { status: 403 });
    }
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return NextResponse.json({ error: "نوع درخواست معتبر نیست." }, { status: 415, headers: { "Cache-Control": "no-store" } });
    }
    const body = await request.json() as { access_token?: string; refresh_token?: string; expires_in?: number; type?: string };
    const accessToken = String(body.access_token || "");
    const refreshToken = String(body.refresh_token || "");
    if (body.type !== "recovery" || accessToken.length < 40 || accessToken.length > 8192 || refreshToken.length < 20 || refreshToken.length > 8192) {
      return NextResponse.json({ error: "لینک بازیابی معتبر یا کامل نیست." }, { status: 400 });
    }
    const verified = await supabaseAuthRequest("user", undefined, accessToken);
    if (!verified.ok || !verified.data?.id) {
      return NextResponse.json({ error: "نشست بازیابی معتبر نیست یا منقضی شده است." }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true, message: "نشست بازیابی تأیید شد. رمز جدید را وارد کن." }, { headers: { "Cache-Control": "no-store" } });
    setSupabaseSessionCookies(response, {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: Number.isFinite(body.expires_in) ? Math.min(Math.max(Number(body.expires_in), 60), 86400) : 3600,
      user: verified.data
    } as SupabaseSession);
    return response;
  } catch {
    return NextResponse.json({ error: "تأیید نشست بازیابی انجام نشد." }, { status: 500 });
  }
}
