export type CreativeMode = "product" | "social" | "video" | "banner";
export type CreativeStyle = "photoreal" | "minimal" | "luxury" | "vibrant" | "editorial";
export type CreativePromptInput = {
  mode?: CreativeMode;
  style?: CreativeStyle;
  subject?: string;
  audience?: string;
  platform?: string;
  language?: string;
  details?: string;
  format?: string;
};
export function buildCreativePrompt(input?: CreativePromptInput): string;
export const MODES: Record<CreativeMode, { label: string; instruction: string }>;
export const STYLES: Record<CreativeStyle, string>;
