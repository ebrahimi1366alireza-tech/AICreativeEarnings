# Parallel implementation sprint: cloud workspace, discovery, and identity

Date: 2026-11-25  
Base: `main` at `5d92e13bfe8eaf3c516122b3fe3f9aa9f9107152`

This sprint tracks three workstreams in parallel. It is an implementation checklist, not a claim that the items below are already complete.

## 1. Cloud workspace and mobile development

### Verified existing pieces
- `docs/CLOUD_WORKSPACE.md` documents GitHub Codespaces from an Android browser, the port-3000 preview, OpenCode CLI, free-quota guardrails, and GitHub Actions builds.
- `app/components/cloud-workspace-sync.tsx` syncs the browser workspace through `/api/workspace/sync`, binds it to the signed-in email, and creates a local restore backup before a remote restore.
- `app/api/workspace/sync/route.ts` derives the owner from the verified Supabase access token and relies on row-level security.

### Work remaining
- **Implemented in draft:** conditional cloud writes compare the expected `updated_at`; stale writes return HTTP 409, and concurrent initial inserts do not overwrite an existing row. End-to-end two-device tests remain pending.
- Verify backup/restore with empty, partially populated, malformed, and cross-account local data.
- Make backup export and restore status visible and understandable on narrow Android screens.
- Review whether KYC review records contain document images or other sensitive identity data. Keep raw identity documents and biometric templates out of workspace sync; sync only the minimum review metadata needed.
- **Implemented in draft:** KYC/payment readiness distinguishes the user's current physical presence in a country from a formal residence-permit requirement. Legacy residence-access fields are not treated as proof of lawful physical-presence eligibility. ID or liveness KYC can qualify only when the passport for the selected citizenship is explicitly accepted; address KYC and unknown KYC remain under review. Readiness requires a separate evidence excerpt and evidence-check date no older than 90 days.
- Integration tests remain pending for unauthenticated access, cross-account isolation, payload validation, concurrent updates, and recovery from HTTP 409.
- Keep Codespaces stopped when idle and never add paid usage or payment methods without explicit approval.

### Acceptance checks
- Account A cannot read or overwrite Account B's workspace.
- A restore never destroys local-only records without a recoverable backup and clear user notice.
- Two-device edits produce a visible conflict/merge decision rather than silent data loss.
- The mobile user can export and restore a JSON backup without desktop-only controls.

## 2. Advanced opportunity discovery

### Verified existing pieces
- `app/api/opportunities/discover/route.ts` currently reads the public LaborX Telegram feed and Subnano public requests, filters creative work into four streams, and caches results for 15 minutes.
- `app/components/opportunity-discovery.tsx` supports manual lead review and strict eligibility scoring.
- `README.md` explicitly says six income streams are product scope, not proof that live feeds exist. Music evaluation, paid surveys, and browser-only microtasks are not connected to live feeds yet.

### Work remaining
- Add source adapters independently, with per-source timeouts, response validation, rate limits, deduplication, and source freshness timestamps.
- Prioritize official/public sources for: AI image/design orders, short-video work, writing, original audio/music work, legitimate paid research, and browser-only QA/microtasks.
- Do not add employment vacancies as if they were paid creative orders.
- **Implemented in draft:** opportunity scoring separates Iranian passport acceptance, KYC with that passport, legal access based on current physical presence, formal residence-permit requirements, crypto payout, and mandatory fees/deposits. An eligible decision also requires a valid HTTPS source, an excerpt of at least 30 characters, and an explicit evidence-check date within the last 90 days. Automated source verification and official evidence for individual platforms remain pending.
- Unknown eligibility must remain `needs review`; a topical score must never imply payment or eligibility.
- Show the source page and last-checked time; expire or flag stale listings.

### Acceptance checks
- A source outage does not take down the full discovery endpoint.
- Unverified leads are visibly unverified and cannot be auto-submitted.
- The user's own country/citizenship/payment constraints are evaluated separately.
- No opportunity is labelled eligible without official evidence for every required gate.

## 3. Authentication and human verification

### Verified existing pieces
- Email/password signup and login use Supabase Auth.
- Access and refresh tokens are placed in HttpOnly cookies.
- `/api/auth/status` validates the access token and attempts refresh.
- Signup correctly reports when email confirmation is required; the user has already completed one email-confirmation flow.

### Work remaining
- **Implemented in draft:** generic password-reset request, recovery-token validation, HttpOnly session cookies, and a mobile new-password form. End-to-end email-link testing and rate limiting review remain pending.
- Add Google OAuth only after provider configuration, callback URLs, state/PKCE handling, and mobile-browser return flow are verified.
- Add a visible human-verification handoff for email links, OTP, CAPTCHA, and identity checks. Never bypass these steps or collect the user's codes in chat.
- Design a user-visible face/liveness entry point only through a lawful, trusted identity provider and only with explicit consent. Do not capture or persist raw face images, face templates, or biometric data in this app.
- Test expired access tokens, refresh rotation, logout, unconfirmed email, invalid credentials, and cross-device sessions.
- Enable Supabase leaked-password protection after confirming the Auth setting and testing signup behavior.

### Acceptance checks
- Password reset and confirmation links return to the correct mobile app route. Password recovery is implemented in draft; live email-link verification remains pending.
- OAuth cannot be marked connected until the callback is validated and the session is established.
- Human checks remain in the user's control; no CAPTCHA/OTP bypass.
- No password, OTP, recovery code, OAuth secret, or biometric data is written to logs or local storage.

## Current external finding

Supabase Security Advisor reports **Leaked Password Protection Disabled** (warning). Remediation is to enable Supabase Auth's compromised-password protection. This setting has not been changed in this sprint.

## Verification protocol

For each code change:
1. Review the exact diff and affected routes.
2. Run `npm run lint` and `npm run build` in GitHub Actions.
3. Test the relevant route/UI on a mobile viewport and verify real authenticated behavior.
4. Confirm the Vercel deployment URL and target before calling it production.
5. Report completed, failed, and blocked checks separately.

No paid service, subscription, deposit, or provider API usage is authorized by this sprint.
