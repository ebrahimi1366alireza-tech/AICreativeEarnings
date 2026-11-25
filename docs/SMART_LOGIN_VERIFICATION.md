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

## Supabase setup

Apply supabase/migrations/20261125130000_verification_handoffs.sql to the project's Supabase database. The migration creates the device pairing and handoff tables, owner-scoped RLS policies, and a narrowly scoped RPC for bearer-token submissions.

## Important platform limits

- The cloud/browser automation must be explicitly integrated with this API and configured with the pairing token. The current repository does not yet contain an automation hook that detects checkpoints on third-party sites.
- The phone dashboard must remain open and visible in the same browser tab for immediate navigation. Android browsers throttle background tabs and do not permit a website to force itself to the foreground. No notification, overlay, or background-launch workaround is attempted.
- A later native Android companion would be needed for deeper device-level integration, and Android still restricts silent background activity launches.
- The user always performs the verification on the provider's own page. Do not scrape, store, relay, or auto-submit OTPs, passwords, face images, liveness video, or identity documents.
- Never use fake identity details, rented accounts, VPN-based country misrepresentation, or other methods to bypass provider restrictions.
