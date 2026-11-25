import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function reply(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

function validUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > 2048) return null;
  try {
    const u = new URL(raw);
    const h = u.hostname.toLowerCase();
    if (u.protocol !== "https:" || u.username || u.password || (u.port && u.port !== "443")) return null;
    if (!h || h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return null;
    if (h.includes(":") || /^(\d{1,3}\.){3}\d{1,3}$/.test(h)) return null;
    if (/^(127\.|10\.|192\.168\.|169\.254\.)/.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h)) return null;
    return u.toString();
  } catch { return null; }
}

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes)).map(x => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply(405, { error: "Method not allowed" });

  const token = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1] ?? "";
  if (token.length < 32 || token.length > 256) return reply(401, { error: "کلید اتصال معتبر نیست." });

  let body: { url?: unknown; kind?: unknown; platform?: unknown };
  try { body = await req.json(); } catch { return reply(400, { error: "درخواست معتبر نیست." }); }

  const url = validUrl(body.url);
  if (!url) return reply(400, { error: "فقط نشانی HTTPS عمومی و معتبر پذیرفته می‌شود." });
  const allowedKinds = ["email_code", "human_verification", "identity_check", "unknown"];
  const kind = typeof body.kind === "string" && allowedKinds.includes(body.kind) ? body.kind : "unknown";
  const platform = typeof body.platform === "string" ? body.platform.trim().slice(0, 80) || "وب‌سایت" : "وب‌سایت";

  const base = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!base || !serviceKey) return reply(503, { error: "سرویس انتقال هنوز پیکربندی نشده است." });
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" };
  const tokenHash = await sha256(token);
  const deviceQuery = new URLSearchParams({
    select: "id,owner_id,updated_at",
    token_hash: `eq.${tokenHash}`,
    revoked_at: "is.null",
    limit: "1",
  });
  const deviceRes = await fetch(`${base}/rest/v1/verification_devices?${deviceQuery}`, { headers, cache: "no-store" });
  if (!deviceRes.ok) return reply(502, { error: "بررسی اتصال گوشی ناموفق بود." });
  const devices = await deviceRes.json();
  const device = Array.isArray(devices) ? devices[0] : null;
  if (!device?.id || !device?.owner_id || Date.now() - Date.parse(device.updated_at) > 180 * 86400000) {
    return reply(401, { error: "کلید اتصال نامعتبر، منقضی یا لغوشده است." });
  }

  const pendingQuery = new URLSearchParams({
    select: "id",
    owner_id: `eq.${device.owner_id}`,
    status: "eq.pending",
    expires_at: `gt.${new Date().toISOString()}`,
  });
  const pendingRes = await fetch(`${base}/rest/v1/verification_handoffs?${pendingQuery}`, { headers, cache: "no-store" });
  if (!pendingRes.ok) return reply(502, { error: "بررسی صف درخواست‌ها ناموفق بود." });
  const pending = await pendingRes.json();
  if (Array.isArray(pending) && pending.length >= 3) return reply(429, { error: "سه درخواست تأیید در انتظار وجود دارد." });

  const insertRes = await fetch(`${base}/rest/v1/verification_handoffs`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({
      owner_id: device.owner_id,
      device_id: device.id,
      platform,
      kind,
      url,
      status: "pending",
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }),
    cache: "no-store",
  });
  if (!insertRes.ok) return reply(502, { error: "ثبت درخواست انتقال انجام نشد." });
  const rows = await insertRes.json();
  return reply(200, { accepted: true, request_id: rows?.[0]?.id, expires_in_seconds: 900 });
});
