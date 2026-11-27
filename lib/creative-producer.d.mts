export type CreativeContentType = "image" | "video" | "audio" | "text";
export type CreativeRights = "owned" | "licensed" | "client_supplied" | "unknown";
export interface CreativeProductionInput {
  contentType: string;
  platform: string;
  product: string;
  audience: string;
  message: string;
  specifications?: string;
  existingAssets?: string;
  rights?: string;
  budget?: string;
}
export interface CreativeProductionPlan {
  ready: boolean;
  missing: string[];
  contentType: CreativeContentType | "unknown";
  rights: CreativeRights;
  budget: string;
  budgetApprovalRequired: boolean;
  stages: string[];
  quality: string[];
  toolPolicy: string;
  rightsWarning: string;
  summary: string;
}
export function buildCreativeProductionPlan(input: CreativeProductionInput): CreativeProductionPlan;
