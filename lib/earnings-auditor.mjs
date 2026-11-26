const PAYMENT_STATES = new Set(["pending", "received", "disputed", "refunded"]);
const CURRENCY_PATTERN = /^[A-Z0-9._-]{2,20}$/;
const SCALE = 18n;
const FACTOR = 10n ** SCALE;

/** Parse a positive decimal into an exact 18-decimal integer representation. */
function parseAmount(value) {
  const raw = String(value ?? "").trim();
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,18})?$/.test(raw)) return null;
  const [whole, fraction = ""] = raw.split(".");
  return BigInt(whole) * FACTOR + BigInt((fraction + "0".repeat(18)).slice(0, 18));
}

function formatAmount(value) {
  const whole = value / FACTOR;
  const fraction = (value % FACTOR).toString().padStart(18, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

/**
 * Audits a user-entered earning record. No blockchain, platform, or wallet lookup occurs.
 * expectedAmount is the expected net payout; receivedAmount is the gross received amount.
 * @param {{source?:string, orderId?:string, currency?:string, expectedAmount?:string|number, paymentStatus?:string, receivedAmount?:string|number, feeAmount?:string|number, evidenceReference?:string, transactionReference?:string, paymentDate?:string, notes?:string}} input
 */
export function auditEarning(input) {
  const source = String(input.source || "").trim();
  const orderId = String(input.orderId || "").trim();
  const currency = String(input.currency || "").trim().toUpperCase();
  const expected = parseAmount(input.expectedAmount);
  const paymentStatus = PAYMENT_STATES.has(input.paymentStatus) ? input.paymentStatus : "pending";
  const receivedRaw = String(input.receivedAmount ?? "").trim();
  const feeRaw = String(input.feeAmount ?? "0").trim() || "0";
  const received = receivedRaw ? parseAmount(receivedRaw) : null;
  const fee = parseAmount(feeRaw);
  const evidenceReference = String(input.evidenceReference || "").trim();
  const transactionReference = String(input.transactionReference || "").trim();
  const missing = [];
  if (!source) missing.push("source");
  if (!currency || !CURRENCY_PATTERN.test(currency)) missing.push("currency");
  if (expected === null || expected <= 0n) missing.push("expectedAmount");
  if (paymentStatus === "received" && received === null) missing.push("receivedAmount");
  if (receivedRaw && received === null) missing.push("receivedAmountFormat");
  if (fee === null) missing.push("feeAmountFormat");
  if (received !== null && fee !== null && fee > received) missing.push("feeExceedsReceived");
  let netReceived = null;
  if (received !== null && fee !== null && fee <= received) netReceived = received - fee;
  let status = "pending_payment";
  if (missing.length) status = "review_required";
  else if (paymentStatus === "disputed") status = "disputed";
  else if (paymentStatus === "refunded") status = "refunded";
  else if (paymentStatus === "received") {
    if (netReceived !== expected) status = "amount_mismatch";
    else status = evidenceReference || transactionReference ? "received_reference_recorded" : "received_unreferenced";
  }
  const expectedFormatted = expected === null ? "" : formatAmount(expected);
  const receivedFormatted = received === null ? "" : formatAmount(received);
  const feeFormatted = fee === null ? "" : formatAmount(fee);
  const netFormatted = netReceived === null ? "" : formatAmount(netReceived);
  const followUpDraft = status === "pending_payment"
    ? `Hello, I am following up on the payment for ${source}${orderId ? ` (order ${orderId})` : ""}. The expected net amount is ${expectedFormatted} ${currency || "[currency]"}. Could you confirm the payment status and expected settlement date?`
    : status === "amount_mismatch"
      ? `Hello, I am following up on the payment for ${source}${orderId ? ` (order ${orderId})` : ""}. The expected net amount was ${expectedFormatted} ${currency}, while the recorded net receipt is ${netFormatted} ${currency}. Please share the payment breakdown so I can reconcile the difference.`
      : status === "disputed"
        ? `Hello, I am following up on the disputed payment for ${source}${orderId ? ` (order ${orderId})` : ""}. Please provide the settlement details and supporting record.`
        : "";
  return {
    status,
    source,
    orderId,
    currency,
    expectedAmount: expectedFormatted,
    receivedAmount: receivedFormatted,
    feeAmount: feeFormatted,
    netReceivedAmount: netFormatted,
    difference: expected !== null && netReceived !== null ? formatAmount(netReceived - expected) : "",
    paymentStatus,
    evidenceReference,
    transactionReference,
    referenceRecorded: Boolean(evidenceReference || transactionReference),
    referenceVerification: "not_verified",
    paymentVerification: "user_attested_only",
    paymentDate: String(input.paymentDate || "").trim(),
    notes: String(input.notes || "").trim(),
    missing,
    followUpDraft,
    paymentClaimAcceptedAsVerified: false,
    walletAccessPerformed: false,
    blockchainLookupPerformed: false,
    externalMessageSent: false,
    limitations: [
      "مبلغ دریافت‌شده، کارمزد و وضعیت پرداخت فقط بر اساس اطلاعات واردشده توسط کاربر هستند.",
      "شناسه تراکنش یا لینک مدرک صرفاً ثبت می‌شود؛ شبکه بلاکچین، کیف پول یا حساب پلتفرم بررسی نمی‌شود.",
      "این گزارش حسابداری کمکی است و جایگزین صورت‌حساب رسمی یا تأیید مستقل پرداخت نیست."
    ]
  };
}

/** Summarize audited records without treating pending or unverified entries as confirmed income. */
export function summarizeEarnings(records = []) {
  const totals = {};
  for (const record of records) {
    if (!record || !record.currency) continue;
    const currency = String(record.currency).toUpperCase();
    if (!totals[currency]) totals[currency] = { expected: 0, received: 0, pending: 0, mismatches: 0, records: 0 };
    const row = totals[currency];
    row.records += 1;
    const expected = parseAmount(record.expectedAmount);
    if (expected !== null && expected > 0n) row.expected += Number(expected) / Number(FACTOR);
    if (record.status === "pending_payment") row.pending += expected === null ? 0 : Number(expected) / Number(FACTOR);
    if (record.status === "amount_mismatch") row.mismatches += 1;
    if (["received_reference_recorded", "received_unreferenced", "amount_mismatch"].includes(record.status)) {
      const net = parseAmount(record.netReceivedAmount);
      if (net !== null) row.received += Number(net) / Number(FACTOR);
    }
  }
  return Object.entries(totals).map(([currency, values]) => ({ currency, ...values }));
}
