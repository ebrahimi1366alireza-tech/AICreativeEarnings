export type RunwayGenerationKind = "image" | "video";
export function cleanPrompt(value: unknown): string;
export function estimateRunwayCost(kind: RunwayGenerationKind): { credits: number; usd: number; label: string };
export function buildRunwayRequest(kind: RunwayGenerationKind, prompt: string): { endpoint: string; body: Record<string, string | number | boolean> };
