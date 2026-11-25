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

function supabaseHeaders(access: string) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error("Supabase is not configured");
  return { apikey: key, Authorization: `Bearer ${access}`, "Content-Type": "application/json" };
}

export async function GET(request: NextRequest) {
  const user = await authenticatedUser(request);
  if (!user) return NextResponse.json({ error: "برای همگام‌سازی ابتدا وارد حساب شو." }, { status: 401 });
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return NextResponse.json({ error: "تنظیمات پایگاه داده کامل نیست." }, { status: 503 });
  const response = await fetch(`${base}/rest/v1/workspace_state?select=data,updated_at&owner_id=eq.${encodeURIComponent(user.id)}`, {
    headers: supabaseHeaders(user.access), cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "خواندن اطلاعات ابری ناموفق بود." }, { status: 502 });
  const rows = await response.json();
  return NextResponse.json({ data: rows?.[0]?.data ?? null, updatedAt: rows?.[0]?.updated_at ?? null }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  const user = await authenticatedUser(request);
  if (!user) return NextResponse.json({ error: "برای همگام‌سازی ابتدا وارد حساب شو." }, { status: 401 });
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return NextResponse.json({ error: "تنظیمات پایگاه داده کامل نیست." }, { status: 503 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "داده ارسالی معتبر نیست." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "ساختار پشتیبان معتبر نیست." }, { status: 400 });
  const data = body as Record<string, unknown>;
  const allowed = ["opportunities", "deliveries", "income", "wallet", "kycRecords", "kycResidence", "kycCitizenship", "kycBankCountry"];
  if (Object.keys(data).some(key => !allowed.includes(key)) ||
      !Array.isArray(data.opportunities) || !Array.isArray(data.deliveries) ||
      !Array.isArray(data.income) || !data.wallet || typeof data.wallet !== "object" || Array.isArray(data.wallet) ||
      (data.kycRecords !== undefined && !Array.isArray(data.kycRecords)) ||
      (data.kycResidence !== undefined && typeof data.kycResidence !== "string") ||
      (data.kycCitizenship !== undefined && typeof data.kycCitizenship !== "string") ||
      (data.kycBankCountry !== undefined && typeof data.kycBankCountry !== "string")) {
    return NextResponse.json({ error: "ساختار اطلاعات فضای کاری کامل نیست." }, { status: 400 });
  }
  const expectedUpdatedAt = typeof data.expectedUpdatedAt === "string" ? data.expectedUpdatedAt : null;
  delete data.expectedUpdatedAt;
  const updatedAt = new Date().toISOString();
  const headers = { ...supabaseHeaders(user.access), Prefer: "return=representation" };
  const endpoint = `${base}/rest/v1/workspace_state`;
  const response = expectedUpdatedAt
    ? await fetch(`${endpoint}?owner_id=eq.${encodeURIComponent(user.id)}&updated_at=eq.${encodeURIComponent(expectedUpdatedAt)}`, {
        method: "PATCH", headers,
        body: JSON.stringify({ data, updated_at: updatedAt }), cache: "no-store"
      })
    : await fetch(`${endpoint}?on_conflict=owner_id`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=representation" },
        body: JSON.stringify({ owner_id: user.id, data, updated_at: updatedAt }), cache: "no-store"
      });
  if (!response.ok) return NextResponse.json({ error: "ذخیره اطلاعات ابری ناموفق بود." }, { status: 502 });
  const rows = await response.json().catch(() => []);
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "نسخه فضای ابری تغییر کرده است؛ برای جلوگیری از بازنویسی اطلاعات جدید، همگام‌سازی متوقف شد. ابتدا همگام‌سازی دستی را اجرا کن." }, { status: 409 });
  }
  return NextResponse.json({ saved: true, updatedAt: rows[0]?.updated_at ?? updatedAt });
}
