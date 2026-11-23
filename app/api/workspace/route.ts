import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const ACCESS_COOKIE = "creativeops_supabase_access";

async function authenticated(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const user = await getSupabaseUser(token);
  if (!user) return { error: NextResponse.json({ error: "برای همگام‌سازی ابتدا وارد حساب شو." }, { status: 401 }) };
  if (!URL || !KEY || !token) return { error: NextResponse.json({ error: "تنظیمات ذخیره‌سازی کامل نیست." }, { status: 503 }) };
  return { user, token };
}

export async function GET(request: NextRequest) {
  const auth = await authenticated(request);
  if ("error" in auth) return auth.error;
  const response = await fetch(`${URL}/rest/v1/workspace_state?owner_id=eq.${encodeURIComponent(auth.user.id)}&select=data,updated_at&limit=1`, {
    headers: { apikey: KEY!, Authorization: `Bearer ${auth.token}` },
    cache: "no-store"
  });
  const rows = await response.json().catch(() => []);
  if (!response.ok) return NextResponse.json({ error: "خواندن اطلاعات ابری انجام نشد." }, { status: 502 });
  return NextResponse.json({ data: Array.isArray(rows) && rows[0]?.data ? rows[0].data : null, updatedAt: Array.isArray(rows) ? rows[0]?.updated_at ?? null : null }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  const auth = await authenticated(request);
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body) || !body.data || typeof body.data !== "object" || Array.isArray(body.data)) {
    return NextResponse.json({ error: "ساختار اطلاعات ارسالی معتبر نیست." }, { status: 400 });
  }
  const response = await fetch(`${URL}/rest/v1/workspace_state?on_conflict=owner_id`, {
    method: "POST",
    headers: {
      apikey: KEY!,
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify({ owner_id: auth.user.id, data: body.data, updated_at: new Date().toISOString() }),
    cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "ذخیره‌سازی ابری انجام نشد." }, { status: 502 });
  return NextResponse.json({ saved: true });
}
