const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type CreativeUsage = { used: number; remaining: number; limit: number; resetsAt?: string };
export type CreditReservation = CreativeUsage & { allowed: boolean };

function dailyLimit() {
  const value = Number(process.env.CREATIVE_DAILY_CREDITS || "10");
  return Number.isInteger(value) && value >= 1 && value <= 10000 ? value : 10;
}

async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("CREATIVE_USAGE_NOT_CONFIGURED");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(args),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) throw new Error("CREATIVE_USAGE_DATABASE_ERROR");
  return response.json() as Promise<T>;
}

export function getDailyCreativeLimit() {
  return dailyLimit();
}

export async function reserveCreativeCredits(userId: string, units: number) {
  return rpc<CreditReservation>("reserve_creative_credits", {
    p_user_id: userId,
    p_units: units,
    p_daily_limit: dailyLimit()
  });
}

export async function releaseCreativeCredits(userId: string, units: number) {
  return rpc<{ used: number }>("release_creative_credits", {
    p_user_id: userId,
    p_units: units
  });
}

export async function getCreativeUsage(userId: string) {
  return rpc<CreativeUsage>("get_creative_usage", {
    p_user_id: userId,
    p_daily_limit: dailyLimit()
  });
}
