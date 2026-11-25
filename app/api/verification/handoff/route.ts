import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAuthRequest } from "@/lib/supabase-auth";

export const runtime = "nodejs";

async function authenticatedUser(request: NextRequest) {
  const access = request.cookies.get("creativeops_supabase_access")?.value;
  if (!access) return null;
  const result = await supabaseAuthRequest("user", undefined, access).catch(() => null);
  if (!result?.ok || !result.data?.id) return null;
  return { id: String(result.data.id), access };
}

function userHeaders(access: string) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error("Supabase is not configured");
  return { apikey: key, Authorization: `Bearer ${access}`, "Content-Type": "application/json" };
}

function safeVerificationUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > 2048) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) return null;
    if (!host || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return null;
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host.includes(":")) return null;
    if (/^(127\.|10\.|192\.168\.|169\.254\.)/.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) return null;
    return url.toString();
  } catch { return null; }
}

export async function POST(request: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !serviceKey) return NextResponse.json({ error: "اتصال امن سرور برای دریافت درخواست‌ها هنوز پیکربندی نشده است." }, { status: 503 });
  const token = request.headers.get("authorization")?.match(/^Bearer\\s+(.+)$/i)?.[1] || "";
  if (token.length < 32 || token.length > 256) return NextResponse.json({ error: "کلید اتصال معتبر نیست." }, { status: 401 });
  let body: { url?: unknown; kind?: unknown; platform?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "درخواست معتبر نیست." }, { status: 400 }); }
  const url = safeVerificationUrl(body.url);
  const kinds = ["email_code", "human_verification", "identity_check", "unknown"];
  const kind = typeof body.kind === "string" && kinds.includes(body.kind) ? body.kind : "unknown";
  const platform = typeof body.platform === "string" ? body.platform.trim().slice(0, 80) : "وب‌سایت";
  if (!url) return NextResponse.json({ error: "فقط نشانی HTTPS عمومی و معتبر پذیرفته می‌شود." }, { status: 400 });
  const tokenHash = createHash("sha256").update(token, "utf8").digest("hex");
  const adminHeaders = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" };
  const deviceQuery = new URLSearchParams({ select: "id,owner_id", token_hash: `eq.${tokenHash}`, revoked_at: "is.null", limit: "1" });
  const deviceResponse = await fetch(`${base}/rest/v1/verification_devices?${deviceQuery}`, {
    headers: adminHeaders, cache: "no-store"
  });
  if (!deviceResponse.ok) return NextResponse.json({ error: "بررسی کلید اتصال انجام نشد." }, { status: 502 });
  const devices = await deviceResponse.json();
  const device = Array.isArray(devices) ? devices[0] : null;
  if (!device?.id || !device?.owner_id) return NextResponse.json({ error: "کلید اتصال نامعتبر یا لغوشده است." }, { status: 401 });
  const insertResponse = await fetch(`${base}/rest/v1/verification_handoffs`, {
    method: "POST",
    headers: { ...adminHeaders, Prefer: "return=representation" },
    body: JSON.stringify({
      owner_id: device.owner_id, device_id: device.id, platform, kind, url,
      status: "pending", expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }),
    cache: "no-store"
  });
  if (!insertResponse.ok) return NextResponse.json({ error: "ثبت درخواست انتقال ناموفق بود." }, { status: 502 });
  const rows = await insertResponse.json();
  return NextResponse.json({ accepted: true, request_id: rows?.[0]?.id, expires_in_seconds: 900 });
}

export async function GET(request: NextRequest) {
  const user = await authenticatedUser(request);
  if (!user) return NextResponse.json({ error: "برای دریافت درخواست‌ها ابتدا وارد حساب شو." }, { status: 401 });
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return NextResponse.json({ error: "تنظیمات Supabase کامل نیست." }, { status: 503 });
  const query = new URLSearchParams({
    select: "id,url,platform,kind,created_at,expires_at",
    owner_id: `eq.${user.id}`, status: "eq.pending",
    expires_at: `gt.${new Date().toISOString()}`, order: "created_at.asc", limit: "1"
  });
  const response = await fetch(`${base}/rest/v1/verification_handoffs?${query}`, {
    headers: userHeaders(user.access), cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "خواندن درخواست تأیید ناموفق بود." }, { status: 502 });
  const rows = await response.json();
  return NextResponse.json({ pending: Array.isArray(rows) ? rows[0] ?? null : null }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: NextRequest) {
  const user = await authenticatedUser(request);
  if (!user) return NextResponse.json({ error: "ابتدا وارد حساب شو." }, { status: 401 });
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return NextResponse.json({ error: "تنظیمات Supabase کامل نیست." }, { status: 503 });
  let body: { id?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "درخواست معتبر نیست." }, { status: 400 }); }
  if (!body.id || !/^[0-9a-f-]{36}$/i.test(body.id)) return NextResponse.json({ error: "شناسه درخواست معتبر نیست." }, { status: 400 });
  const query = new URLSearchParams({ id: `eq.${body.id}`, owner_id: `eq.${user.id}`, status: "eq.pending" });
  const response = await fetch(`${base}/rest/v1/verification_handoffs?${query}`, {
    method: "PATCH",
    headers: { ...userHeaders(user.access), Prefer: "return=minimal" },
    body: JSON.stringify({ status: "completed", completed_at: new Date().toISOString() }),
    cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "ثبت پایان تأیید ناموفق بود." }, { status: 502 });
  return NextResponse.json({ completed: true });
}
