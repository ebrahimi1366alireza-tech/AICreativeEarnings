export interface AssistantPipelineInput {
  id?: string; title: string; sourceUrl?: string; countryCheck?: string; citizenshipAcceptance?: string;
  payout?: string; deposit?: string; paymentAsset?: string; network?: string; minimum?: string; fee?: string; kyc?: string; evidenceText?: string;
  contentType?: string; platform?: string; product?: string; audience?: string; message?: string; specifications?: string;
  existingAssets?: string; requiredAssets?: string; includedAssets?: string; rights?: string; rightsEvidenceReference?: string; budget?: string;
  orderId?: string; clientName?: string; deliveryChannel?: string; version?: string; currency?: string; expectedAmount?: string; feeAmount?: string;
}
export function runAssistantPipeline(input?: AssistantPipelineInput): { ok: boolean; error?: string; project?: any; stages?: any[]; eventLog?: any[]; limitations?: string[] };
