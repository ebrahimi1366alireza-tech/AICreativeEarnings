import { NextRequest, NextResponse } from "next/server";
import { decryptCookie } from "@/lib/secure-cookie";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = decryptCookie(request.cookies.get("creativeops_gmail_refresh")?.value);
  if (token) {
    await fetch("https://oauth2.googleapis.com/revoke", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token }), cache: "no-store"
    }).catch(() => undefined);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("creativeops_gmail_refresh", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
