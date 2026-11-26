export type CreativeReviewStatus = "blocked" | "revision_required" | "review_required" | "ready_for_human_review";
export interface CreativeReviewInput {
  brief: string;
  deliverable: string;
  format?: string;
  rightsStatus?: string;
  checks?: Record<string, boolean>;
  revisionLimit?: string;
  reviewerNotes?: string;
}
export interface CreativeReviewResult {
  status: CreativeReviewStatus;
  decision: string;
  score: number;
  missing: string[];
  unchecked: { key: string; label: string }[];
  rightsStatus: string;
  rightsEvidenceMissing: boolean;
  rightsEvidenceReferenceProvided: boolean;
  rightsEvidenceVerification: "not_verified";
  format: string;
  revisionLimit: string;
  reviewerNotes: string;
  checksAreUserAttested: boolean;
  mediaInspectionPerformed: false;
  reason: string;
  limitations: string[];
}
export function reviewCreativeDeliverable(input: CreativeReviewInput): CreativeReviewResult;
