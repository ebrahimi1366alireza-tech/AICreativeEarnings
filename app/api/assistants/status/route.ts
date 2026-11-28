import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";
import { getAssistantProviderConfig } from "@/lib/assistant-llm.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("creativeops_supabase_access")?.value;
  const user = await getSupabaseUser(accessToken);
  if (!user) {
    return NextResponse.json({ authenticated: false, enabled: false, reason: "authentication_required" }, {
      status: 401,
      headers: { "Cache-Control": "no-store" }
    });
  }

  const config = getAssistantProviderConfig();
  return NextResponse.json({
    authenticated: true,
    enabled: config.enabled,
    reason: config.enabled ? "ready" : config.reason
  }, { headers: { "Cache-Control": "no-store" } });
}
