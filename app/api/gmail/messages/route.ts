import { NextRequest, NextResponse } from "next/server";
import { decryptCookie } from "@/lib/secure-cookie";
import { readSession } from "@/lib/google-session";
import { getSupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const signedIn = Boolean(readSession(request.cookies.get("creativeops_google_session")?.value)) ||
    Boolean(await getSupabaseUser(request.cookies.get("creativeops_supabase_access")?.value));
  if (!signedIn) return NextResponse.json({ error: "ابتدا وارد حساب شو." }, { status: 401 });
  const refreshToken = decryptCookie(request.cookies.get("creativeops_gmail_refresh")?.value);
  if (!refreshToken) return NextResponse.json({ error: "Gmail هنوز متصل نشده است." }, { status: 404 });
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return NextResponse.json({ error: "تنظیمات Google کامل نیست." }, { status: 503 });
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }), cache: "no-store"
    });
    const tokenData = await tokenResponse.json() as { access_token?: string };
    if (!tokenResponse.ok || !tokenData.access_token) return NextResponse.json({ error: "دسترسی Gmail منقضی یا لغو شده؛ دوباره متصلش کن." }, { status: 401 });
    const listResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }, cache: "no-store"
    });
    if (!listResponse.ok) return NextResponse.json({ error: "خواندن فهرست ایمیل‌ها ناموفق بود." }, { status: 502 });
    const list = await listResponse.json() as { messages?: Array<{ id: string; threadId: string }> };
    const messages = await Promise.all((list.messages || []).slice(0, 10).map(async message => {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(message.id)}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }, cache: "no-store"
      });
      if (!response.ok) return { id: message.id, subject: "(بدون عنوان)", from: "", date: "", snippet: "" };
      const item = await response.json() as { id: string; snippet?: string; payload?: { headers?: Array<{ name: string; value: string }> } };
      const headers = item.payload?.headers || [];
      const get = (name: string) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || "";
      return { id: item.id, subject: get("Subject") || "(بدون عنوان)", from: get("From"), date: get("Date"), snippet: item.snippet || "" };
    }));
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "خطا در ارتباط با Gmail." }, { status: 502 });
  }
}
