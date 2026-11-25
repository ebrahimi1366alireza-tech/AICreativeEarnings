import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";

const BUCKET = "portfolio-assets";
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

async function context(request: NextRequest) {
  const token = request.cookies.get("creativeops_supabase_access")?.value;
  const user = await getSupabaseUser(token);
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!user || !token) return { response: NextResponse.json({ error: "برای گالری ابری ابتدا وارد حساب شو." }, { status: 401 }) };
  if (!base || !key) return { response: NextResponse.json({ error: "تنظیمات فضای ابری کامل نیست." }, { status: 503 }) };
  return { user, token, base, key };
}

function headers(ctx: { token: string; key: string }) {
  return { apikey: ctx.key, Authorization: `Bearer ${ctx.token}` };
}

function signedUrl(base: string, value: string) {
  if (/^https:\/\//i.test(value)) return value;
  return `${base}/storage/v1${value.startsWith("/") ? value : `/${value}`}`;
}

export async function GET(request: NextRequest) {
  const ctx = await context(request);
  if ("response" in ctx) return ctx.response;
  const response = await fetch(`${ctx.base}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: { ...headers(ctx), "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: ctx.user.id, limit: 100, offset: 0, sortBy: { column: "created_at", order: "desc" } }),
    cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "خواندن گالری ابری ناموفق بود." }, { status: 502 });
  const files = await response.json() as Array<{ name?: string; created_at?: string; metadata?: { size?: number } }>;
  const items = await Promise.all((Array.isArray(files) ? files : []).filter(file => typeof file.name === "string" && !file.name.includes("/")).map(async file => {
    const path = `${ctx.user.id}/${file.name}`;
    const signed = await fetch(`${ctx.base}/storage/v1/object/sign/${BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`, {
      method: "POST",
      headers: { ...headers(ctx), "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 3600 }),
      cache: "no-store"
    });
    if (!signed.ok) return null;
    const data = await signed.json() as { signedURL?: string };
    const [id, titlePart, categoryPart] = file.name!.split("__");
    const extension = titlePart?.split(".").pop() || "";
    const title = titlePart ? decodeURIComponent(titlePart) : "نمونه‌کار";
    const category = categoryPart ? decodeURIComponent(categoryPart.replace(/\.[^.]+$/, "")) : "سایر";
    return { id, title, category, path, image: data.signedURL ? signedUrl(ctx.base, data.signedURL) : "", createdAt: file.created_at || new Date().toISOString(), size: file.metadata?.size || 0, extension };
  }));
  return NextResponse.json({ items: items.filter(Boolean) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const ctx = await context(request);
  if ("response" in ctx) return ctx.response;
  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  const title = String(form?.get("title") || "").trim().slice(0, 80);
  const category = String(form?.get("category") || "سایر").trim().slice(0, 60);
  if (!(file instanceof File) || !title || file.size < 1) return NextResponse.json({ error: "عنوان و فایل تصویر الزامی است." }, { status: 400 });
  const extension = MIME_EXTENSIONS[file.type];
  if (!extension) return NextResponse.json({ error: "فقط تصویر JPG، PNG، WebP یا GIF مجاز است." }, { status: 415 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "حجم هر تصویر باید حداکثر ۱.۵ مگابایت باشد." }, { status: 413 });
  const safeTitle = encodeURIComponent(title).replace(/%2F/gi, "%252F");
  const safeCategory = encodeURIComponent(category).replace(/%2F/gi, "%252F");
  const name = `${randomUUID()}__${safeTitle}__${safeCategory}.${extension}`;
  const path = `${ctx.user.id}/${name}`;
  const response = await fetch(`${ctx.base}/storage/v1/object/${BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`, {
    method: "POST",
    headers: { ...headers(ctx), "Content-Type": file.type, "x-upsert": "false" },
    body: await file.arrayBuffer(),
    cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "بارگذاری امن تصویر در فضای ابری انجام نشد." }, { status: 502 });
  return NextResponse.json({ saved: true, path });
}

export async function DELETE(request: NextRequest) {
  const ctx = await context(request);
  if ("response" in ctx) return ctx.response;
  const body = await request.json().catch(() => null) as { path?: unknown } | null;
  const path = typeof body?.path === "string" ? body.path : "";
  if (!path.startsWith(`${ctx.user.id}/`) || path.includes("..") || path.includes("\\")) {
    return NextResponse.json({ error: "مسیر فایل معتبر نیست." }, { status: 400 });
  }
  const response = await fetch(`${ctx.base}/storage/v1/object/${BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`, {
    method: "DELETE", headers: headers(ctx), cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "حذف فایل از فضای ابری انجام نشد." }, { status: 502 });
  return NextResponse.json({ deleted: true });
}
