import { NextResponse } from "next/server";
import { supabaseAuthRequest } from "@/lib/supabase-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string };
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) {
      return NextResponse.json({ error: "یک ایمیل معتبر وارد کن." }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const result = await supabaseAuthRequest("recover", {
      email,
      redirect_to: `${origin}/?auth=recovery`
    });

    // Return the same message for known and unknown addresses to avoid account enumeration.
    if (!result.ok) {
      return NextResponse.json({ error: "درخواست بازیابی فعلاً ارسال نشد. کمی بعد دوباره تلاش کن." }, { status: 503 });
    }
    return NextResponse.json({
      ok: true,
      message: "اگر این ایمیل حساب فعالی داشته باشد، لینک بازیابی رمز برایش ارسال می‌شود. ایمیلت را بررسی کن."
    });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس بازیابی برقرار نشد." }, { status: 500 });
  }
}
