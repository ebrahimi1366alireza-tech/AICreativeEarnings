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

function headers(access: string) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error("Supabase is not configured");
  return { apikey: key, Authorization: `Bearer ${access}`, "Content-Type": "application/json" };
}

export async function POST(request: NextRequest) {
  const user = await authenticatedUser(request);
  if (!user) return NextResponse.json({ error: "برای فعال‌سازی، ابتدا وارد حساب کاربری شو." }, { status: 401 });
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return NextResponse.json({ error: "تنظیمات Supabase کامل نیست." }, { status: 503 });
  let body: { tokenHash?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "درخواست معتبر نیست." }, { status: 400 }); }
  if (!body.tokenHash || !/^[0-9a-f]{64}$/.test(body.tokenHash)) {
    return NextResponse.json({ error: "کلید جفت‌سازی معتبر نیست." }, { status: 400 });
  }
  const response = await fetch(`${base}/rest/v1/verification_devices?on_conflict=owner_id`, {
    method: "POST",
    headers: { ...headers(user.access), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ owner_id: user.id, token_hash: body.tokenHash, updated_at: new Date().toISOString(), revoked_at: null }),
    cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "ثبت دستگاه انجام نشد. ابتدا migration مربوط به verification handoff را در Supabase اجرا کن." }, { status: 502 });
  return NextResponse.json({ paired: true });
}

export async function DELETE(request: NextRequest) {
  const user = await authenticatedUser(request);
  if (!user) return NextResponse.json({ error: "ابتدا وارد حساب کاربری شو." }, { status: 401 });
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return NextResponse.json({ error: "تنظیمات Supabase کامل نیست." }, { status: 503 });
  const response = await fetch(`${base}/rest/v1/verification_devices?owner_id=eq.${encodeURIComponent(user.id)}`, {
    method: "DELETE", headers: headers(user.access), cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "لغو اتصال دستگاه انجام نشد." }, { status: 502 });
  return NextResponse.json({ paired: false });
}
