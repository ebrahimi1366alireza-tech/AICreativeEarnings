/**
 * Provider-agnostic Playwright adapter for Smart Login & Verification.
 *
 * Call reporter.report(page) after each navigation and after a site's
 * client-rendered verification step appears. This helper only forwards the
 * current HTTPS URL and checkpoint type; it never reads or submits form values.
 */

export type CheckpointPage = {
  url(): string;
  title(): Promise<string>;
  locator(selector: string): {
    innerText(options?: { timeout?: number }): Promise<string>;
  };
};

export type CheckpointKind =
  | "email_code"
  | "human_verification"
  | "identity_check"
  | "unknown";

export type CheckpointReporterConfig = {
  apiBaseUrl: string;
  pairingToken: string;
  platform: string;
};

export type CheckpointReport =
  | { detected: false }
  | { detected: true; sent: false; reason: string; kind: CheckpointKind }
  | { detected: true; sent: true; requestId?: string; kind: CheckpointKind };

function classifyCheckpoint(text: string): CheckpointKind | null {
  if (/captcha|i am not a robot|i'm not a robot|verify (that )?you are human|human verification|security challenge/i.test(text)) {
    return "human_verification";
  }
  if (/verify (your )?identity|identity verification|liveness check|selfie verification|upload (your )?(passport|identity|government id)|proof of identity/i.test(text)) {
    return "identity_check";
  }
  if (/one[- ]time (password|code)|verification code|security code|enter (the )?(otp|code)|email verification|verify your email|sms code|otp/i.test(text)) {
    return "email_code";
  }
  return null;
}

export function createCheckpointReporter(config: CheckpointReporterConfig) {
  const base = new URL(config.apiBaseUrl);
  if (base.protocol !== "https:" && base.hostname !== "localhost") {
    throw new Error("Smart Login API must use HTTPS.");
  }
  if (config.pairingToken.length < 32 || config.pairingToken.length > 256) {
    throw new Error("A valid phone pairing token is required.");
  }

  const reportedUrls = new Set<string>();

  return {
    async report(page: CheckpointPage): Promise<CheckpointReport> {
      const currentUrl = page.url();
      let url: URL;
      try {
        url = new URL(currentUrl);
      } catch {
        return { detected: false };
      }
      if (url.protocol !== "https:" || reportedUrls.has(url.toString())) {
        return { detected: false };
      }
      const sensitiveQueryKeys = /^(access_token|refresh_token|token|token_hash|code|otp|password|secret|api_key|key|signature|sig|jwt|ticket)$/i;
      if ([...url.searchParams.keys()].some(key => sensitiveQueryKeys.test(key))) {
        return {
          detected: true,
          sent: false,
          reason: "This URL contains a credential-like query parameter. It was not forwarded; pause and ask the user to complete verification without sharing the one-time link.",
          kind: "unknown"
        };
      }
      url.hash = "";

      let visibleText = "";
      try {
        const [title, body] = await Promise.all([
          page.title(),
          page.locator("body").innerText({ timeout: 2500 })
        ]);
        visibleText = (title + "\\n" + body).slice(0, 12000);
      } catch {
        return { detected: false };
      }

      const kind = classifyCheckpoint(visibleText);
      if (!kind) return { detected: false };

      const endpoint = new URL("/api/verification/handoff", base).toString();
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.pairingToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: url.toString(),
            kind,
            platform: config.platform.slice(0, 80)
          }),
          cache: "no-store"
        });
        const data = await response.json().catch(() => ({})) as {
          accepted?: boolean;
          request_id?: string;
          error?: string;
        };
        if (!response.ok || !data.accepted) {
          return {
            detected: true,
            sent: false,
            reason: data.error || `Handoff failed with HTTP ${response.status}.`,
            kind
          };
        }
        reportedUrls.add(url.toString());
        return { detected: true, sent: true, requestId: data.request_id, kind };
      } catch {
        return {
          detected: true,
          sent: false,
          reason: "Could not reach the Smart Login handoff API.",
          kind
        };
      }
    }
  };
}
