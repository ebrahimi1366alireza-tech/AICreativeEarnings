import { NextResponse } from "next/server";
import { setSupabaseSessionCookies, supabaseAuthRequest, type SupabaseSession } from "@/lib/supabase-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return NextResponse.json({ error: "ایمیل معتبر و رمز عبور حداقل ۸ کاراکتری وارد کن." }, { status: 400 });
    }
    const result = await supabaseAuthRequest("signup", { email, password });
    if (!result.ok) return NextResponse.json({ error: result.data?.msg || result.data?.message || "ثبت‌نام انجام نشد. اطلاعات را بررسی کن." }, { status: result.status });
    const session = result.data as SupabaseSession;
    const response = NextResponse.json({ ok: true, needsEmailConfirmation: !session.access_token, message: session.access_token ? "حساب ساخته شد و وارد شدی." : "حساب ساخته شد. برای فعال‌سازی، ایمیلت را تأیید کن و سپس وارد شو." });
    setSupabaseSessionCookies(response, session);
    return response;
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس ورود برقرار نشد." }, { status: 500 });
  }
}
