import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TASK_COOKIE = "creativeops_runway_tasks";

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export async function GET(request: NextRequest, context: { params: Promise<{ taskId: string }> }) {
  const token = request.cookies.get("creativeops_supabase_access")?.value;
  const user = await getSupabaseUser(token);
  if (!user) return NextResponse.json({ error: "برای مشاهده نتیجه ابتدا وارد حساب شو." }, { status: 401 });

  const apiKey = process.env.RUNWAYML_API_SECRET;
  const cookieSecret = process.env.SESSION_SECRET;
  if (!apiKey || !cookieSecret) return NextResponse.json({ error: "اتصال Runway Dev تنظیم نشده است." }, { status: 503 });

  const { taskId } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(taskId)) {
    return NextResponse.json({ error: "شناسه کار معتبر نیست." }, { status: 400 });
  }

  const cookie = request.cookies.get(TASK_COOKIE)?.value || "";
  const [encoded, signature] = cookie.split(".");
  if (!encoded || !signature) return NextResponse.json({ error: "این کار در نشست فعلی ثبت نشده است." }, { status: 404 });
  const expected = sign(encoded, cookieSecret);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return NextResponse.json({ error: "نشست پیگیری معتبر نیست." }, { status: 403 });
  }

  let tasks: Array<{ id: string; kind: string; createdAt: number }>;
  try { tasks = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")); }
  catch { return NextResponse.json({ error: "اطلاعات پیگیری خراب است." }, { status: 400 }); }
  if (!Array.isArray(tasks) || !tasks.some(item => item?.id === taskId)) {
    return NextResponse.json({ error: "این کار به حساب فعلی تعلق ندارد." }, { status: 404 });
  }

  try {
    const response = await fetch("https://api.dev.runwayml.com/v1/tasks/" + taskId, {
      headers: { Authorization: "Bearer " + apiKey, "X-Runway-Version": "2024-11-06" },
      cache: "no-store",
      signal: AbortSignal.timeout(12000)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: "وضعیت کار از Runway دریافت نشد." }, { status: response.status === 404 ? 404 : 502 });
    const output = Array.isArray(result.output) ? result.output.filter((url: unknown) => typeof url === "string" && url.startsWith("https://")) : [];
    return NextResponse.json({
      taskId: result.id,
      status: result.status,
      progress: result.progress ?? null,
      output,
      failure: result.failure ?? null,
      failureCode: result.failureCode ?? null,
      cost: result.cost ?? result.estimatedCost ?? null,
      outputExpires: output.length ? "پیوندهای خروجی Runway موقت هستند و معمولاً پس از ۲۴ تا ۴۸ ساعت منقضی می‌شوند." : null
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با Runway برای دریافت وضعیت قطع شد." }, { status: 502 });
  }
}
