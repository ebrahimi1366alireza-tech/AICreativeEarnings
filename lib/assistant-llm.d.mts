export type AssistantBriefInput = {
  title?: unknown;
  contentType?: unknown;
  platform?: unknown;
  product?: unknown;
  audience?: unknown;
  message?: unknown;
  specifications?: unknown;
};
export type AssistantProviderConfig =
  | { enabled: false; reason: string }
  | { enabled: true; baseUrl: string; apiKey: string; model: string };
export function getAssistantProviderConfig(env?: NodeJS.ProcessEnv): AssistantProviderConfig;
export function sanitizeAssistantBrief(input?: AssistantBriefInput): Record<string, string>;
export function buildAssistantMessages(brief: Record<string, string>): Array<{ role: "system" | "user"; content: string }>;
