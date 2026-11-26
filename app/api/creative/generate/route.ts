import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";
import { buildRunwayRequest, estimateRunwayCost } from "@/lib/runway-provider.cjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TASK_COOKIE = "creativeops_runway_tasks";
const RUNWAY_API = "https://api.dev.runwayml.com";
const COOKIE_MAX_AGE = 60 * 60 * 24;

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function encodeTasks(ownerId: string, tasks: Array<{ id: string; kind: string; createdAt: number }>, secret: string) {
  const value = Buffer.from(JSON.stringify({ ownerId, tasks: tasks.slice(-20) })).toString("base64url");
  return value + "." + sign(value, secret);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("creativeops_supabase_access")?.value;
  const user = await getSupabaseUser(token);
  if (!user) return NextResponse.json({ error: "برای تولید محتوا ابتدا وارد حساب شو." }, { status: 401 });

  const apiKey = process.env.RUNWAYML_API_SECRET;
  const cookieSecret = process.env.SESSION_SECRET;
  if (!apiKey || !cookieSecret) {
    return NextResponse.json({ error: "اتصال Runway Dev هنوز تنظیم نشده است. کلید RUNWAYML_API_SECRET باید فقط در Environment Variables سرور ثبت شود." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || body.confirmed !== true || !["image", "video"].includes(body.kind)) {
    return NextResponse.json({ error: "درخواست معتبر نیست یا هزینه تولید تأیید نشده است." }, { status: 400 });
  }

  let generation;
  let cost;
  try {
    generation = buildRunwayRequest(body.kind, body.prompt);
    cost = estimateRunwayCost(body.kind);
  } catch {
    return NextResponse.json({ error: "متن پرامپت یا نوع خروجی معتبر نیست." }, { status: 400 });
  }

  try {
    const response = await fetch(RUNWAY_API + generation.endpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
        "X-Runway-Version": "2024-11-06",
        "X-Runway-Tags": "app:ai-creative-earnings,kind:" + body.kind
      },
      body: JSON.stringify(generation.body),
      cache: "no-store",
      signal: AbortSignal.timeout(20000)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || typeof result.id !== "string") {
      const message = response.status === 401 ? "کلید Runway Dev معتبر نیست."
        : response.status === 402 ? "اعتبار API کافی نیست."
        : response.status === 429 ? "محدودیت درخواست Runway؛ کمی بعد دوباره تلاش کن."
        : "Runway درخواست تولید را نپذیرفت.";
      return NextResponse.json({ error: message, providerStatus: response.status }, { status: response.status === 429 ? 429 : 502 });
    }

    const existing = request.cookies.get(TASK_COOKIE)?.value || "";
    let tasks: Array<{ id: string; kind: string; createdAt: number }> = [];
    const [encoded, signature] = existing.split(".");
    if (encoded && signature && sign(encoded, cookieSecret) === signature) {
      try {
        const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
        if (parsed?.ownerId === user.id && Array.isArray(parsed.tasks)) tasks = parsed.tasks.filter((item: any) => item && typeof item.id === "string" && ["image", "video"].includes(item.kind));
      } catch { tasks = []; }
    }
    tasks.push({ id: result.id, kind: body.kind, createdAt: Date.now() });
    const output = NextResponse.json({
      accepted: true,
      taskId: result.id,
      kind: body.kind,
      estimatedCost: result.estimatedCost?.credits ?? cost.credits,
      estimatedUsd: cost.usd,
      note: "تولید در پس‌زمینه انجام می‌شود. پس از آماده‌شدن، خروجی را ذخیره کن؛ پیوندهای تحویل Runway موقت هستند."
    }, { headers: { "Cache-Control": "no-store" } });
    output.cookies.set(TASK_COOKIE, encodeTasks(user.id, tasks, cookieSecret), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
      path: "/api/creative", maxAge: COOKIE_MAX_AGE
    });
    return output;
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس تولید محتوا برقرار نشد. دوباره تلاش کن." }, { status: 502 });
  }
}
