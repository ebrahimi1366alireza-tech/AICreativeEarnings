import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";
import { getCreativeUsage, getDailyCreativeLimit, releaseCreativeCredits, reserveCreativeCredits } from "@/lib/creative-usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 16_000;
const MAX_PROMPT = 8_000;
const CREDIT_COST = { text: 1, image: 5 } as const;

async function readBody(request: NextRequest) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > MAX_BODY) throw new Error("BODY_TOO_LARGE");
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY) throw new Error("BODY_TOO_LARGE");
  return JSON.parse(raw);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "درخواست معتبر نیست." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "نوع درخواست معتبر نیست." }, { status: 415 });
  }

  const access = request.cookies.get("creativeops_supabase_access")?.value;
  const user = await getSupabaseUser(access);
  if (!user) return NextResponse.json({ error: "برای تولید محتوا ابتدا وارد حساب کاربری شو." }, { status: 401, headers: { "Cache-Control": "no-store" } });

  let body: unknown;
  try { body = await readBody(request); }
  catch (error) {
    const tooLarge = error instanceof Error && error.message === "BODY_TOO_LARGE";
    return NextResponse.json({ error: tooLarge ? "درخواست بیش از حد بزرگ است." : "اطلاعات ارسالی معتبر نیست." }, { status: tooLarge ? 413 : 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "اطلاعات ارسالی معتبر نیست." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const mode = input.mode;
  const prompt = typeof input.prompt === "string" ? input.prompt.trim() : "";
  if ((mode !== "text" && mode !== "image") || !prompt || prompt.length > MAX_PROMPT) {
    return NextResponse.json({ error: "نوع خروجی یا متن تولید معتبر نیست." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "موتور تولید هنوز پیکربندی نشده است. مدیر باید OPENAI_API_KEY را در تنظیمات امن سرور اضافه کند." }, { status: 503, headers: { "Cache-Control": "no-store" } });

  const units = CREDIT_COST[mode];
  let reservation;
  try {
    reservation = await reserveCreativeCredits(user.id, units);
  } catch {
    return NextResponse.json({ error: "سامانهٔ سهمیه در دسترس نیست. برای جلوگیری از مصرف کنترل‌نشده، تولید موقتاً متوقف شد." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  if (!reservation.allowed) {
    return NextResponse.json({
      error: "سهمیهٔ روزانهٔ تولیدت تمام شده است.",
      usage: { used: reservation.used, remaining: reservation.remaining, limit: reservation.limit }
    }, { status: 429, headers: { "Cache-Control": "no-store" } });
  }

  try {
    if (mode === "text") {
      const model = process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          max_tokens: 1200,
          messages: [
            { role: "system", content: "You are a commercial creative producer. Create useful, original assets intended for sale to a real client or digital-content buyer. Do not invent product facts, client approval, market demand, licensing rights, or guaranteed income. Clearly flag assumptions. Return Persian explanations when the brief is Persian; produce the requested deliverable language." },
            { role: "user", content: prompt }
          ]
        }),
        signal: AbortSignal.timeout(60_000),
        cache: "no-store"
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        await releaseCreativeCredits(user.id, units).catch(() => null);
        return NextResponse.json({ error: response.status === 429 ? "محدودیت یا اعتبار موتور هوش مصنوعی اجازه تولید نمی‌دهد." : "تولید متن توسط سرویس هوش مصنوعی ناموفق بود." }, { status: response.status === 429 ? 429 : 502, headers: { "Cache-Control": "no-store" } });
      }
      const text = result.choices?.[0]?.message?.content;
      if (typeof text !== "string" || !text.trim()) {
        await releaseCreativeCredits(user.id, units).catch(() => null);
        return NextResponse.json({ error: "سرویس خروجی متنی معتبری برنگرداند." }, { status: 502 });
      }
      return NextResponse.json({
        ok: true, mode, model, output: text.trim(),
        usage: { used: reservation.used, remaining: reservation.remaining, limit: reservation.limit, unitCost: units }
      }, { headers: { "Cache-Control": "no-store" } });
    }

    const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, size: "1024x1024", quality: "medium", output_format: "png" }),
      signal: AbortSignal.timeout(120_000),
      cache: "no-store"
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      await releaseCreativeCredits(user.id, units).catch(() => null);
      return NextResponse.json({ error: response.status === 429 ? "محدودیت یا اعتبار تولید تصویر اجازه ادامه نمی‌دهد." : "تولید تصویر توسط سرویس هوش مصنوعی ناموفق بود." }, { status: response.status === 429 ? 429 : 502, headers: { "Cache-Control": "no-store" } });
    }
    const encoded = result.data?.[0]?.b64_json;
    if (typeof encoded !== "string" || encoded.length > 18_000_000) {
      await releaseCreativeCredits(user.id, units).catch(() => null);
      return NextResponse.json({ error: "تصویر خروجی معتبر یا در محدودهٔ اندازه نبود." }, { status: 502 });
    }
    return NextResponse.json({
      ok: true, mode, model, imageDataUrl: `data:image/png;base64,${encoded}`,
      usage: { used: reservation.used, remaining: reservation.remaining, limit: reservation.limit, unitCost: units }
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    // A timeout/network failure is ambiguous: the provider may have completed and billed the request.
    // Keep the reserved credits rather than refunding and allowing unbounded retries.
    return NextResponse.json({ error: "ارتباط با موتور تولید قطع شد یا زمان پاسخ به پایان رسید. برای جلوگیری از مصرف تکراری، اعتبار این درخواست فعلاً رزرو باقی می‌ماند." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "درخواست معتبر نیست." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const access = request.cookies.get("creativeops_supabase_access")?.value;
  const user = await getSupabaseUser(access);
  if (!user) return NextResponse.json({ error: "برای مشاهدهٔ سهمیه ابتدا وارد حساب کاربری شو." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const usage = await getCreativeUsage(user.id);
    return NextResponse.json({ ok: true, usage }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "اطلاعات سهمیه در دسترس نیست." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
