import { NextRequest, NextResponse } from "next/server";
import { hasActivityStore, insertActivity, isIngestAuthorized, isSignedIn, listActivity } from "@/lib/activity-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isSignedIn(request)) return NextResponse.json({ error: "برای مشاهده گزارش فعالیت وارد حساب پروژه شو." }, { status: 401 });
  if (!hasActivityStore()) return NextResponse.json({ configured: false, events: [] });
  try {
    const events = await listActivity(60);
    return NextResponse.json({ configured: true, events });
  } catch {
    return NextResponse.json({ error: "خواندن گزارش فعالیت ممکن نشد." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  // Event ingestion is server-to-server only. A dashboard login must not be
  // sufficient to forge assistant/system activity in the shared event log.
  if (!isIngestAuthorized(request)) {
    return NextResponse.json({ error: "ثبت رویداد فقط از مسیر امن سرویس مجاز است." }, { status: 401 });
  }
  if (!hasActivityStore()) return NextResponse.json({ error: "پایگاه داده فعالیت هنوز تنظیم نشده است." }, { status: 503 });
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "نوع محتوای درخواست باید JSON باشد." }, { status: 415 });
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "حجم درخواست بیش از حد مجاز است." }, { status: 413 });
  }
  try {
    const body = await request.json() as Record<string, unknown>;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "ساختار رویداد معتبر نیست." }, { status: 400 });
    }
    const allowedActors = ["assistant", "user", "system"];
    const allowedStatuses = ["running", "completed", "needs_action", "failed"];
    const actor = allowedActors.includes(String(body.actor)) ? String(body.actor) : "assistant";
    const category = String(body.category ?? "general").slice(0, 40);
    const title = String(body.title ?? "").trim().slice(0, 160);
    const detail = body.detail == null ? null : String(body.detail).slice(0, 1200);
    const status = allowedStatuses.includes(String(body.status)) ? String(body.status) : "completed";
    const requiresUserAction = body.requires_user_action === true;
    const actionLabel = body.action_label == null ? null : String(body.action_label).slice(0, 80);
    const actionUrl = body.action_url == null ? null : String(body.action_url).slice(0, 500);
    if (!title) return NextResponse.json({ error: "عنوان فعالیت الزامی است." }, { status: 400 });
    if (actionUrl && !/^https:\/\//i.test(actionUrl)) return NextResponse.json({ error: "لینک اقدام باید HTTPS باشد." }, { status: 400 });
    const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata) ? body.metadata as Record<string, unknown> : {};
    if (JSON.stringify(metadata).length > 8_000) {
      return NextResponse.json({ error: "اطلاعات تکمیلی رویداد بیش از حد مجاز است." }, { status: 413 });
    }
    const event = await insertActivity({
      actor: actor as "assistant" | "user" | "system",
      category,
      title,
      detail,
      status: status as "running" | "completed" | "needs_action" | "failed",
      requires_user_action: requiresUserAction,
      action_label: actionLabel,
      action_url: actionUrl,
      metadata
    });
    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "ثبت فعالیت در پایگاه داده ناموفق بود." }, { status: 503 });
  }
}
