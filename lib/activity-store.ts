import { readSession } from "@/lib/google-session";
import type { NextRequest } from "next/server";

export type ActivityEvent = {
  id: string;
  actor: "assistant" | "user" | "system";
  category: string;
  title: string;
  detail: string | null;
  status: "running" | "completed" | "needs_action" | "failed";
  requires_user_action: boolean;
  action_label: string | null;
  action_url: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
};

export function hasActivityStore() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isSignedIn(request: NextRequest) {
  return Boolean(readSession(request.cookies.get("creativeops_google_session")?.value));
}

export function isIngestAuthorized(request: NextRequest) {
  const secret = process.env.ACTIVITY_INGEST_SECRET;
  if (!secret || secret.length < 32) return false;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (supplied.length !== secret.length) return false;
  // Compare equal-length strings without an early character mismatch exit.
  let diff = 0;
  for (let i = 0; i < secret.length; i++) diff |= secret.charCodeAt(i) ^ supplied.charCodeAt(i);
  return diff === 0;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Activity storage is not configured");
  return { url, key };
}

export async function listActivity(limit = 50): Promise<ActivityEvent[]> {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/activity_events?select=id,actor,category,title,detail,status,requires_user_action,action_label,action_url,created_at,metadata&order=created_at.desc&limit=${limit}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Activity read failed (${response.status})`);
  return response.json() as Promise<ActivityEvent[]>;
}

export async function insertActivity(input: Omit<ActivityEvent, "id" | "created_at">) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/activity_events`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(input),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Activity write failed (${response.status})`);
  const rows = await response.json() as ActivityEvent[];
  return rows[0];
}
