import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";

const BUCKET = "portfolio-assets";
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;
const MAX_ITEMS = 20;
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

function decodePart(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  try {
    return decodeURIComponent(value);
  } catch {
    return fallback;
  }
}

function matchesImageSignature(bytes: Uint8Array, mime: string) {
  if (mime === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mime === "image/png") return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  if (mime === "image/gif") {
    const signature = String.fromCharCode(...bytes.slice(0, 6));
    return signature === "GIF87a" || signature === "GIF89a";
  }
  if (mime === "image/webp") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
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
    const extension = categoryPart?.split(".").pop() || "";
    const title = decodePart(titlePart, "نمونه‌کار");
    const category = decodePart(categoryPart?.replace(/\.[^.]+$/, ""), "سایر");
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
  const fileBuffer = await file.arrayBuffer();
  if (!matchesImageSignature(new Uint8Array(fileBuffer), file.type)) {
    return NextResponse.json({ error: "محتوای فایل با فرمت اعلام‌شده تصویر مطابقت ندارد." }, { status: 415 });
  }
  const existingResponse = await fetch(`${ctx.base}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: { ...headers(ctx), "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: ctx.user.id, limit: MAX_ITEMS, offset: 0 }),
    cache: "no-store"
  });
  if (!existingResponse.ok) return NextResponse.json({ error: "بررسی ظرفیت گالری ناموفق بود." }, { status: 502 });
  const existingFiles = await existingResponse.json();
  if (Array.isArray(existingFiles) && existingFiles.length >= MAX_ITEMS) {
    return NextResponse.json({ error: "گالری به سقف ۲۰ تصویر رسیده است. ابتدا یک مورد را حذف کن." }, { status: 409 });
  }
  const safeTitle = encodeURIComponent(title).replace(/_/g, "%5F").replace(/%2F/gi, "%252F");
  const safeCategory = encodeURIComponent(category).replace(/_/g, "%5F").replace(/%2F/gi, "%252F");
  const name = `${randomUUID()}__${safeTitle}__${safeCategory}.${extension}`;
  const path = `${ctx.user.id}/${name}`;
  const response = await fetch(`${ctx.base}/storage/v1/object/${BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`, {
    method: "POST",
    headers: { ...headers(ctx), "Content-Type": file.type, "x-upsert": "false" },
    body: fileBuffer,
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
