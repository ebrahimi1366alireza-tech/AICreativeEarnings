# Smart Login & Verification handoff

This feature is a human-verification bridge, not an identity-verification bypass.

## Current flow

1. The user signs in to AI Creative Earnings and opens the dashboard on the Android phone.
2. The user pairs the phone once. The UI generates a random 256-bit bearer token, stores only its SHA-256 hash in Supabase, and displays the raw token once for secure configuration in the automation agent.
3. The automation agent must detect an email OTP, human/liveness check, or identity-document checkpoint in its own browser session and call the handoff endpoint.
4. The phone dashboard polls while its tab is visible. It navigates the same tab to the exact HTTPS URL from the request.
5. The user enters the OTP or completes the site's own face/liveness/document flow directly with that provider. The project never receives OTPs, passwords, face images, or identity documents.
6. The user returns to the dashboard and marks the checkpoint complete. The agent can then resume its own flow.

## Agent API contract

POST /api/verification/handoff

Headers:
- Authorization: Bearer [phone-pairing-token]
- Content-Type: application/json

Body:
- url: exact provider verification URL (HTTPS public hostname only)
- kind: email_code, human_verification, identity_check, or unknown
- platform: short provider name

The endpoint stores a 15-minute request and returns a request ID. It rejects non-HTTPS URLs, local/private IP hosts, localhost, .local, .internal, embedded URL credentials, and nonstandard ports. The pairing token is never stored in plaintext. Revoke and re-pair the device if the token is exposed.

## Playwright adapter

The repository includes `scripts/verification-checkpoint.ts`, a provider-agnostic adapter for an external Playwright worker. It reads only the page title and visible body text to classify a likely checkpoint, then forwards the current HTTPS URL, checkpoint kind, and platform label. It does not forward page text, OTP values, passwords, identity data, or images.

Example integration in the external worker:

```ts
import { createCheckpointReporter } from "../scripts/verification-checkpoint";

const reporter = createCheckpointReporter({
  apiBaseUrl: process.env.AI_CREATIVE_EARNINGS_URL!,
  pairingToken: process.env.AI_CREATIVE_EARNINGS_PHONE_TOKEN!,
  platform: "Target platform"
});

// Call after navigation and after client-rendered content settles.
const result = await reporter.report(page);
if (result.detected && !result.sent) {
  // Pause the worker and surface the failure for operator review.
}
if (result.detected && result.sent) {
  // Pause until the user completes the provider's verification page.
}
```

The adapter is deliberately opt-in and must be called by the external worker. It is not a browser extension, background service, or universal CAPTCHA detector. Site wording varies, so false negatives and false positives are possible; the worker must pause on uncertain checkpoints and never attempt to solve or bypass them.

## Supabase setup

The schema is already deployed to the connected Supabase project as migration `20261125090327_verification_handoffs`. It creates `verification_devices` and `verification_handoffs` with owner-scoped RLS policies. Bearer-token submissions are validated by the `verification-handoff` Edge Function; there is no RPC in this flow. A follow-up migration, `20261125183432_optimize_verification_handoffs_policies_and_indexes`, adds the device foreign-key index and wraps `auth.uid()` in a scalar subquery to avoid per-row re-evaluation.

## Important platform limits

- The cloud/browser automation must be explicitly integrated with this API and configured with the pairing token. The repository now includes an opt-in Playwright checkpoint adapter, but the external browser worker must import it, configure the phone pairing token securely, and call it after navigation. No external worker is currently connected or verified.
- The phone dashboard must remain open and visible in the same browser tab for immediate navigation. Android browsers throttle background tabs and do not permit a website to force itself to the foreground. No notification, overlay, or background-launch workaround is attempted.
- A later native Android companion would be needed for deeper device-level integration, and Android still restricts silent background activity launches.
- The user always performs the verification on the provider's own page. Do not scrape, store, relay, or auto-submit OTPs, passwords, face images, liveness video, or identity documents.
- Never use fake identity details, rented accounts, VPN-based country misrepresentation, or other methods to bypass provider restrictions.
