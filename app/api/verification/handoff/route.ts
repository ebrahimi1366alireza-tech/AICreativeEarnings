import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAuthRequest } from "@/lib/supabase-auth";

export const runtime = "nodejs";

function publicSupabaseHeaders() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error("Supabase is not configured");
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

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
  if (!base) return NextResponse.json({ error: "تنظیمات Supabase کامل نیست." }, { status: 503 });
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1] || "";
  if (token.length < 32 || token.length > 256) return NextResponse.json({ error: "کلید اتصال معتبر نیست." }, { status: 401 });
  let body: { url?: unknown; kind?: unknown; platform?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "درخواست معتبر نیست." }, { status: 400 }); }
  const url = safeVerificationUrl(body.url);
  const kinds = ["email_code", "human_verification", "identity_check", "unknown"];
  const kind = typeof body.kind === "string" && kinds.includes(body.kind) ? body.kind : "unknown";
  const platform = typeof body.platform === "string" ? body.platform.trim().slice(0, 80) : "وب‌سایت";
  if (!url) return NextResponse.json({ error: "فقط نشانی HTTPS عمومی و معتبر پذیرفته می‌شود." }, { status: 400 });
  const tokenHash = createHash("sha256").update(token, "utf8").digest("hex");
  const response = await fetch(`${base}/rest/v1/rpc/submit_verification_handoff`, {
    method: "POST", headers: publicSupabaseHeaders(),
    body: JSON.stringify({ p_token_hash: tokenHash, p_url: url, p_kind: kind, p_platform: platform }),
    cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "درخواست انتقال پذیرفته نشد. اتصال دستگاه یا migration را بررسی کن." }, { status: 401 });
  return NextResponse.json(await response.json());
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
