/**
 * Crypto Opportunity Finder: conservative, evidence-first Web3 work intake.
 * This module classifies public leads only. It does not verify eligibility,
 * connect wallets, submit applications, or guarantee payment.
 */

const AIRDROP_TERMS = /\b(airdrop|token drop|claim free tokens|free token claim|retroactive rewards?)\b/i;
const UPFRONT_COST_TERMS = /\b(deposit required|pay to apply|activation fee|membership fee|subscription required|buy tokens to participate|purchase required)\b/i;
const WORK_TERMS = [
  ["bug_bounty", /\b(bug bounty|security bounty|vulnerability disclosure|smart contract audit|security researcher)\b/i],
  ["freelance", /\b(freelance|paid task|paid gig|fixed[- ]price|commission|client brief|design task|video editing|article writing|translation|research report)\b/i],
  ["community_bounty", /\b(community bounty|ambassador task|content bounty|creator bounty|moderation task|community manager)\b/i],
  ["research", /\b(research study|paid research|protocol analysis|market research|ecosystem research)\b/i]
];

function secureUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

export function classifyCryptoOpportunity(input = {}) {
  const title = String(input.title || "").trim();
  const description = String(input.description || "").trim();
  const searchable = `${title} ${description}`;
  const sourceUrl = secureUrl(input.sourceUrl || input.url);
  const reasons = [];

  if (!title || !sourceUrl) {
    return { accepted: false, status: "rejected", type: null, reasons: ["عنوان یا پیوند امن منبع معتبر نیست."] };
  }
  if (AIRDROP_TERMS.test(searchable)) {
    return { accepted: false, status: "rejected", type: null, reasons: ["ایردراپ و پاداش توکنی بدون دستمزد تضمین‌شده خارج از محدوده است."] };
  }
  if (UPFRONT_COST_TERMS.test(searchable)) {
    return { accepted: false, status: "rejected", type: null, reasons: ["هزینه ورود، سپرده یا خرید اجباری با سیاست پروژه مغایر است."] };
  }

  const match = WORK_TERMS.find(([, pattern]) => pattern.test(searchable));
  if (!match) {
    return { accepted: false, status: "needs_review", type: null, reasons: ["نوع کار درآمدزا از متن آگهی قابل تشخیص نیست."] };
  }

  const payout = String(input.payout || "unknown").toLowerCase();
  const countryEligibility = String(input.countryEligibility || "unknown").toLowerCase();
  const iranianPassport = String(input.iranianPassport || "unknown").toLowerCase();
  const kyc = String(input.kyc || "unknown").toLowerCase();

  if (payout === "fiat_only" || payout === "gift_card_only") {
    return { accepted: false, status: "rejected", type: match[0], reasons: ["روش پرداخت با سیاست پرداخت رمزارزی به کیف پول شخصی سازگار نیست."] };
  }
  if (payout === "unknown") reasons.push("روش پرداخت و امکان برداشت مستقیم به کیف پول هنوز بررسی نشده است.");
  if (countryEligibility !== "eligible") reasons.push("پذیرش محل اقامت در ارمنستان تأیید نشده است.");
  if (iranianPassport !== "accepted") reasons.push("پذیرش پاسپورت ایرانی تأیید نشده است.");
  if (kyc === "unknown") reasons.push("نوع احراز هویت و مدارک لازم نامشخص است.");

  const hasDirectWalletPayout = payout === "direct_wallet" || payout === "escrow_to_wallet";
  const verifiedProfile = hasDirectWalletPayout &&
    countryEligibility === "eligible" &&
    iranianPassport === "accepted" &&
    kyc !== "unknown";

  return {
    accepted: true,
    status: verifiedProfile ? "ready_for_human_review" : "needs_review",
    type: match[0],
    sourceUrl,
    payout,
    countryEligibility,
    iranianPassport,
    kyc,
    reasons
  };
}

export function rankCryptoOpportunities(items = []) {
  return items
    .map((item, index) => ({ item, index, result: classifyCryptoOpportunity(item) }))
    .filter(({ result }) => result.accepted)
    .sort((a, b) => {
      const score = (x) => (x.result.status === "ready_for_human_review" ? 20 : 0) +
        (x.result.payout === "escrow_to_wallet" ? 5 : x.result.payout === "direct_wallet" ? 3 : 0);
      return score(b) - score(a) || a.index - b.index;
    })
    .map(({ item, result }) => ({ ...item, triage: result }));
}
