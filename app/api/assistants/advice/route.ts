import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";
import { buildAssistantMessages, getAssistantProviderConfig, sanitizeAssistantBrief } from "@/lib/assistant-llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACCESS_COOKIE = "creativeops_supabase_access";
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function limited(userId: string) {
  const now = Date.now();
  const current = requestCounts.get(userId);
  if (!current || current.resetAt <= now) {
    requestCounts.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (current.count >= MAX_REQUESTS_PER_WINDOW) return true;
  current.count += 1;
  return false;
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") && request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "درخواست از مبدأ نامعتبر رد شد." }, { status: 403 });
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const user = await getSupabaseUser(accessToken);
  if (!user) return NextResponse.json({ error: "برای استفاده از دستیار ابتدا وارد حساب شو." }, { status: 401 });

  const config = getAssistantProviderConfig();
  if (!config.enabled) {
    return NextResponse.json({
      error: config.reason === "disabled"
        ? "اتصال هوش مصنوعی فعلاً خاموش است."
        : "تنظیمات اتصال هوش مصنوعی کامل یا معتبر نیست."
    }, { status: 503 });
  }

  const raw = await request.text();
  if (raw.length > 12_000) return NextResponse.json({ error: "حجم درخواست بیش از حد مجاز است." }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "ساختار درخواست معتبر نیست." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "ساختار درخواست معتبر نیست." }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  if (input.allowExternalProcessing !== true) {
    return NextResponse.json({ error: "برای ارسال بریف به سرویس مدل، رضایت صریح همین درخواست لازم است." }, { status: 403 });
  }
  const brief = sanitizeAssistantBrief(input.brief && typeof input.brief === "object" && !Array.isArray(input.brief) ? input.brief as Record<string, unknown> : {});
  if (!brief.title || (!brief.message && !brief.specifications)) {
    return NextResponse.json({ error: "عنوان و شرح سفارش لازم است." }, { status: 400 });
  }
  if (limited(user.id)) return NextResponse.json({ error: "محدودیت درخواست: حداکثر پنج بار در دقیقه." }, { status: 429 });

  const endpoint = new URL("chat/completions", config.baseUrl.endsWith("/") ? config.baseUrl : config.baseUrl + "/");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: config.model, messages: buildAssistantMessages(brief), temperature: 0.3, max_tokens: 900 }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000)
    });
    if (!response.ok) {
      return NextResponse.json({ error: response.status === 429 ? "سرویس مدل محدودیت موقت اعمال کرده است." : "سرویس مدل پاسخ موفق نداد." }, { status: response.status === 429 ? 429 : 502 });
    }
    const data = await response.json().catch(() => null);
    const advice = data?.choices?.[0]?.message?.content;
    if (typeof advice !== "string" || !advice.trim()) {
      return NextResponse.json({ error: "پاسخ سرویس مدل معتبر نبود." }, { status: 502 });
    }
    return NextResponse.json({
      ok: true,
      advisoryOnly: true,
      externalProcessing: true,
      providerModel: config.model,
      advice: advice.trim().slice(0, 8_000),
      warning: "این خروجی پیشنهاد هوش مصنوعی است و هیچ گیت حقوق محتوا، کنترل کیفیت، تحویل، احراز هویت، شرایط پرداخت یا ثبت درآمد را تأیید یا دور نمی‌زند."
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس مدل برقرار نشد یا زمان آن تمام شد." }, { status: 502 });
  }
}

function consentStatus() { return 403; }
