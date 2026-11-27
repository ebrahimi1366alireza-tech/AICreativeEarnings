export type OpportunityEvidenceField =
  | "country" | "citizenship" | "kyc" | "payout" | "asset"
  | "network" | "minimum" | "fee" | "entryCost";
export type OpportunityEvidenceMap = Partial<Record<OpportunityEvidenceField, string>>;
export type OpportunityAssessment = {
  score: number;
  decision: string;
  status: "ineligible" | "review_required" | "ready_for_user_approval";
  reason: string;
  missingEvidence: string[];
};
export function parseOpportunityEvidence(raw: string): OpportunityEvidenceMap;
export function assessOpportunity(input: {
  sourceUrl?: string;
  countryCheck?: string;
  citizenshipAcceptance?: string;
  payout?: string;
  deposit?: string;
  paymentAsset?: string;
  network?: string;
  minimum?: string;
  fee?: string;
  kyc?: string;
  evidenceByField?: OpportunityEvidenceMap;
}): OpportunityAssessment;
export const opportunityEvidenceFields: readonly OpportunityEvidenceField[];
