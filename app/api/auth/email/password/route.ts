import { NextRequest, NextResponse } from "next/server";
import { supabaseAuthRequest } from "@/lib/supabase-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const access = request.cookies.get("creativeops_supabase_access")?.value;
    if (!access) return NextResponse.json({ error: "نشست بازیابی پیدا نشد؛ لینک ایمیل را دوباره باز کن." }, { status: 401 });
    const verified = await supabaseAuthRequest("user", undefined, access);
    if (!verified.ok || !verified.data?.id) return NextResponse.json({ error: "نشست بازیابی منقضی شده است؛ لینک تازه درخواست کن." }, { status: 401 });
    const body = await request.json() as { password?: string };
    const password = String(body.password || "");
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "رمز جدید باید بین ۸ تا ۱۲۸ نویسه باشد." }, { status: 400 });
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!base || !key) return NextResponse.json({ error: "تنظیمات احراز هویت کامل نیست." }, { status: 503 });
    const response = await fetch(`${base}/auth/v1/user`, {
      method: "PATCH",
      headers: { apikey: key, Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      cache: "no-store"
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: result.msg || result.message || "تغییر رمز انجام نشد؛ رمز دیگری انتخاب کن." }, { status: response.status });
    return NextResponse.json({ ok: true, message: "رمز عبور با موفقیت تغییر کرد." });
  } catch {
    return NextResponse.json({ error: "تغییر رمز عبور انجام نشد." }, { status: 500 });
  }
}