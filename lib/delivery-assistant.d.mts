export type DeliveryPackStatus = "blocked" | "revision_required" | "ready_for_human_approval";
export interface DeliveryPackInput {
  orderId?: string;
  brief?: string;
  clientName?: string;
  deliveryChannel?: string;
  version?: string;
  requiredAssets?: string[];
  includedAssets?: string[];
  format?: string;
  qcStatus?: string;
  rightsStatus?: string;
  outstanding?: string[];
  deadline?: string;
  revisionNotes?: string;
}
export interface DeliveryPackResult {
  status: DeliveryPackStatus;
  decision: string;
  orderId: string;
  clientName: string;
  recipientProvided: boolean;
  deliveryChannel: string;
  deadline: string;
  version: string;
  format: string;
  manifest: { name: string; version: string; format: string; location: string }[];
  requiredAssets: string[];
  includedAssets: string[];
  absentAssets: string[];
  missing: string[];
  outstanding: string[];
  qcStatus: string;
  rightsStatus: string;
  rightsEvidenceVerification: "not_verified";
  revisionNotes: string;
  clientMessageDraft: string;
  sendPerformed: false;
  uploadPerformed: false;
  humanApprovalRequired: true;
  limitations: string[];
}
export function prepareDeliveryPack(input: DeliveryPackInput): DeliveryPackResult;
