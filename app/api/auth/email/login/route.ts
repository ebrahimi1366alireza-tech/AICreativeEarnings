import { NextResponse } from "next/server";
import { setSupabaseSessionCookies, supabaseAuthRequest, type SupabaseSession } from "@/lib/supabase-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!/^\S+@\S+\.\S+$/.test(email) || !password) return NextResponse.json({ error: "ایمیل و رمز عبور را کامل وارد کن." }, { status: 400 });
    const result = await supabaseAuthRequest("token?grant_type=password", { email, password });
    if (!result.ok) return NextResponse.json({ error: result.data?.msg || result.data?.message || "ورود ناموفق بود؛ ایمیل و رمز را بررسی کن." }, { status: result.status });
    const response = NextResponse.json({ ok: true, message: "با موفقیت وارد شدی." });
    setSupabaseSessionCookies(response, result.data as SupabaseSession);
    return response;
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس ورود برقرار نشد." }, { status: 500 });
  }
}
