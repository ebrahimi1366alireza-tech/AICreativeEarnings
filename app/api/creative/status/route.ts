import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("creativeops_supabase_access")?.value;
  const user = await getSupabaseUser(token);
  if (!user) return NextResponse.json({ error: "برای استفاده از تولید محتوا ابتدا وارد حساب شو." }, { status: 401 });

  return NextResponse.json({
    provider: "Runway Dev",
    configured: Boolean(process.env.RUNWAYML_API_SECRET && process.env.SESSION_SECRET),
    image: { credits: 2, usd: 0.02, model: "gen4_image_turbo" },
    video: { credits: 65, usd: 0.65, seconds: 5, model: "seedance2_5_flash", quality: "480p" },
    apiBillingNote: "اعتبار API از اعتبار حساب عادی Runway جداست. حداقل شارژ اولیه API طبق درگاه توسعه‌دهنده ۱۰ دلار است."
  }, { headers: { "Cache-Control": "no-store" } });
}
