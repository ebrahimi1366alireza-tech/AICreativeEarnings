export type EarningsAuditStatus = "pending_payment" | "review_required" | "disputed" | "refunded" | "amount_mismatch" | "received_reference_recorded" | "received_unreferenced";
export interface EarningsAuditInput {
  source?: string;
  orderId?: string;
  currency?: string;
  expectedAmount?: string | number;
  paymentStatus?: "pending" | "received" | "disputed" | "refunded" | string;
  receivedAmount?: string | number;
  feeAmount?: string | number;
  evidenceReference?: string;
  transactionReference?: string;
  paymentDate?: string;
  notes?: string;
}
export interface EarningsAuditResult {
  status: EarningsAuditStatus;
  source: string;
  orderId: string;
  currency: string;
  expectedAmount: string;
  receivedAmount: string;
  feeAmount: string;
  netReceivedAmount: string;
  difference: string;
  paymentStatus: string;
  evidenceReference: string;
  transactionReference: string;
  referenceRecorded: boolean;
  referenceVerification: "not_verified";
  paymentVerification: "user_attested_only";
  paymentDate: string;
  notes: string;
  missing: string[];
  followUpDraft: string;
  paymentClaimAcceptedAsVerified: false;
  walletAccessPerformed: false;
  blockchainLookupPerformed: false;
  externalMessageSent: false;
  limitations: string[];
}
export interface EarningsSummary {
  currency: string;
  expected: number;
  received: number;
  pending: number;
  mismatches: number;
  records: number;
}
export function auditEarning(input: EarningsAuditInput): EarningsAuditResult;
export function summarizeEarnings(records?: EarningsAuditResult[]): EarningsSummary[];
