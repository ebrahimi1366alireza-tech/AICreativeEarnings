import { assessOpportunity, parseOpportunityEvidence } from "./opportunity-triage.mjs";
import { buildCreativeProductionPlan } from "./creative-producer.mjs";
import { reviewCreativeDeliverable } from "./quality-reviewer.mjs";
import { prepareDeliveryPack } from "./delivery-assistant.mjs";
import { auditEarning } from "./earnings-auditor.mjs";

const splitLines = (value) => String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

export function runAssistantPipeline(input = {}) {
  const title = String(input.title || "").trim();
  if (!title) return { ok: false, error: "عنوان پروژه الزامی است." };

  // Stage 1 -> 2: the opportunity decision and evidence are carried into the production brief.
  const evidenceByField = parseOpportunityEvidence(input.evidenceText || "");
  const opportunity = assessOpportunity({
    sourceUrl: input.sourceUrl,
    countryCheck: input.countryCheck,
    citizenshipAcceptance: input.citizenshipAcceptance,
    payout: input.payout,
    deposit: input.deposit,
    paymentAsset: input.paymentAsset,
    network: input.network,
    minimum: input.minimum,
    fee: input.fee,
    kyc: input.kyc,
    evidenceByField
  });

  const production = buildCreativeProductionPlan({
    contentType: input.contentType,
    platform: input.platform,
    product: input.product,
    audience: input.audience,
    message: input.message,
    specifications: input.specifications,
    existingAssets: input.existingAssets,
    rights: input.rights,
    budget: input.budget || "0"
  });

  // Stage 3: downstream assistant receives the exact brief and rights state.
  const rightsEvidenceReference = String(input.rightsEvidenceReference || "").trim();
  const rightsStatus = input.rights === "owned" ? "owned" : input.rights === "licensed" ? "licensed" : input.rights === "client_supplied" ? "client_supplied" : "unknown";
  const quality = reviewCreativeDeliverable({
    brief: [input.message, input.specifications].filter(Boolean).join("\n"),
    deliverable: production.stages.join("\n"),
    format: input.specifications,
    rightsStatus,
    rightsEvidenceReference,
    checks: {}
  });

  // Stage 4: delivery receives the production manifest and QC gate. Nothing is uploaded or sent.
  const requiredAssets = splitLines(input.requiredAssets || input.existingAssets);
  const deliveryRights = rightsStatus === "owned" ? "confirmed_owned" : rightsStatus === "client_supplied" ? "client_permission" : rightsStatus;
  const delivery = prepareDeliveryPack({
    orderId: String(input.orderId || title),
    brief: [input.message, input.specifications].filter(Boolean).join("\n"),
    clientName: input.clientName,
    deliveryChannel: input.deliveryChannel,
    version: input.version || "v1",
    requiredAssets,
    includedAssets: splitLines(input.includedAssets),
    format: input.specifications,
    qcStatus: quality.status,
    rightsStatus: deliveryRights,
    outstanding: quality.unchecked.map((item) => item.label).concat(quality.missing)
  });

  // Stage 5: create an honest pending ledger draft; never treat it as received income.
  const earnings = auditEarning({
    source: String(input.platform || title),
    orderId: String(input.orderId || title),
    currency: input.currency,
    expectedAmount: input.expectedAmount,
    paymentStatus: "pending",
    receivedAmount: "",
    feeAmount: input.feeAmount || "0",
    notes: "پیش‌نویس خودکار؛ تا زمان ثبت و راستی‌آزمایی دریافت، درآمد محسوب نمی‌شود."
  });

  const stages = [
    { id: "opportunity_triage", assistant: "Opportunity Triage", status: opportunity.status, output: opportunity, handoff: "اطلاعات کشور، تابعیت، KYC، پرداخت و مدارک به پرونده پروژه منتقل شد." },
    { id: "creative_production", assistant: "Creative Producer", status: production.ready ? "plan_created" : "needs_input", output: production, handoff: "بریف و محدودیت‌های تولید برای بازبینی کیفیت ارسال شد." },
    { id: "quality_review", assistant: "Quality Reviewer", status: quality.status, output: quality, handoff: "چک‌لیست ناقص به آماده‌سازی تحویل منتقل شد؛ هیچ فایل یا مجوزی مستقل بررسی نشده است." },
    { id: "delivery_preparation", assistant: "Delivery Assistant", status: delivery.status, output: delivery, handoff: "بسته تحویل ساخته شد؛ ارسال و آپلود غیرفعال است." },
    { id: "earnings_audit", assistant: "Earnings Auditor", status: earnings.status, output: earnings, handoff: "دفتر درآمد به‌صورت پیش‌نویس در انتظار پرداخت ساخته شد." }
  ];

  return {
    ok: true,
    project: { id: String(input.id || ""), title, createdAt: new Date().toISOString(), currentStage: "opportunity_triage", status: "review_required", externalActionsPerformed: false },
    stages,
    eventLog: stages.map((stage) => ({ event: "assistant_executed", assistant: stage.assistant, stage: stage.id, status: stage.status, at: new Date().toISOString() })),
    limitations: [
      "این زنجیره پنج ماژول محلی را به‌صورت ترتیبی اجرا و خروجی ساختاریافته را بین آن‌ها منتقل می‌کند؛ عامل‌های مستقل ابری یا مدل زبانی در این نسخه اجرا نمی‌شوند.",
      "منابع، حقوق محتوا، فایل‌ها و دریافت وجه به‌طور مستقل راستی‌آزمایی نمی‌شوند.",
      "هیچ ثبت‌نام، هزینه، اتصال کیف پول، آپلود، ارسال پیام یا اقدام خارجی انجام نمی‌شود."
    ]
  };
}
