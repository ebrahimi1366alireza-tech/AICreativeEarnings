# AI Assistant Rollout Plan — 2026-11-27

## Purpose

Turn the existing AI Creative Earnings workspace into a useful, supervised assistant system without adding paid services, unnecessary orchestration infrastructure, or unsafe account automation.

This is an implementation plan, not a claim that agents are already running.

## Verified starting point

- Repository: `ebrahimi1366alireza-tech/AICreativeEarnings`
- Application: Next.js 15 / React 19, TypeScript
- Existing product areas: opportunity discovery, opportunity review, production/delivery tracking, income ledger, wallet-address settings, Supabase Auth and per-user cloud workspace sync
- Existing public discovery sources: LaborX and Subnano
- Existing deployment: Vercel
- Existing database/auth infrastructure: Supabase
- No AI model/provider is configured as a verified, zero-cost inference runtime.
- No end-to-end user account test has been completed.
- Agent-orchestration repositories reviewed so far are candidates/reference material, not installed production dependencies.

## Hard operating constraints

1. No paid API calls, subscriptions, hosted browser credits, VPS, deposits, or purchases without explicit approval.
2. Do not assume a free software license means free model inference or hosting.
3. Do not store API keys, passwords, OAuth tokens, session cookies, wallet private keys, seed phrases, OTPs, or identity documents in source code, logs, prompts, or agent memory.
4. Do not bypass country, sanctions, identity, KYC, or platform restrictions. Never use VPN/location concealment, false details, rented accounts, or another person's identity to obtain access.
5. Keep unknown country eligibility, citizenship acceptance, KYC, payout asset/network, fees, and minimum withdrawal as unknown. Unknown is not eligible.
6. No agent may create accounts, complete KYC, sign wallet messages/transactions, accept contracts, apply to jobs, follow accounts, post publicly, submit work, purchase, or move funds.
7. Human approval is required before external publication, client submission, account changes, contracts, and every financial action.
8. Never report projected, pending, or contest prize money as received income.
9. Keep the seven existing income streams distinct: paid writing, original audio/music, legitimate paid evaluation, paid surveys/research, image/video/design production, and browser-only microtasks/website testing. Exclude fake engagement, fake reviews/votes, mandatory app/game installs, and deposit-funded tasks.

## Proposed assistant roles

These are logical roles first. They do not need to become separate deployed agents or incur separate model calls.

| Role | Responsibility | Permission boundary |
|---|---|---|
| Coordinator | Assign work, maintain task state, summarize blockers and next actions | Read/write internal workspace records only |
| Opportunity Scout | Find public creative briefs and candidate platforms; preserve source URLs and dates | Read public pages; no account actions or submissions |
| Eligibility & Payout Auditor | Check residence/citizenship, KYC, sanctions/terms, payout asset/network, fees, minimums and entry costs | Evidence-based review; cannot declare unknown fields eligible |
| Creative Producer | Turn an approved brief into a production plan, prompts, drafts and delivery checklist | Draft only; no paid generation or external delivery |
| Quality Reviewer | Check brief compliance, originality, format, language, rights, and revision limits | Review/draft feedback only |
| Delivery & Client Assistant | Prepare client messages, delivery notes and follow-up drafts | Draft only; user sends or approves externally |
| Earnings Auditor | Reconcile pending versus received income and flag missing payment evidence | Read/reconcile ledger; never initiate transfers |

## Rollout sequence

### Phase 0 — Make the existing product trustworthy

1. Run and record the existing TypeScript/build checks.
2. Test signup, login, logout, session persistence and cross-device workspace sync using a real user account; the user must complete any email/OTP/CAPTCHA step.
3. Verify that workspace data remains isolated per authenticated account and that JSON backup/restore works.
4. Review the current public discovery endpoint for stale listings, duplicate leads, source timestamps, rate limits and error handling.
5. Confirm that every lead is marked unverified until the required country/KYC/payout/fee/entry-cost evidence is present.

Exit condition: core workspace and data isolation pass tests; no claim of working agent automation yet.

### Phase 1 — Build the first useful assistant: Opportunity Triage

Implement this before a multi-agent framework.

Input: a public listing or manually entered opportunity.

Output:
- concise brief summary and deliverables
- source URL and checked-at timestamp
- opportunity type and required skills
- fixed price / prize / indicative budget clearly distinguished
- deadline and whether it is still open
- AI-use and commercial-rights requirements
- country/residence/citizenship eligibility evidence
- KYC and identity requirements
- payout asset, exact network, fees and minimum withdrawal
- deposit, subscription, purchase, installation or stake requirements
- evidence links for every material eligibility/payment claim
- explicit status: `unverified`, `review_required`, `ineligible`, or `approved_by_user`

Use deterministic validation for required fields and status transitions. An LLM may summarize evidence only after a genuinely free and permitted inference option is verified. Model output must never override missing evidence or convert unknown into approved.

### Phase 2 — Supervised creative production

For user-approved briefs:
1. Generate a production checklist and estimated effort.
2. Prepare text prompts, storyboards, copy and asset specifications.
3. Use only tools with a verified available quota and suitable commercial rights.
4. Require user approval before any action that may consume credits.
5. Run a quality checklist and prepare a delivery package.
6. Keep final submission and client communication under user control.

### Phase 3 — Earnings and follow-up assistant

- Track proposal, accepted order, work in progress, delivered, disputed, pending payment and received payment separately.
- Reconcile actual received payments against user-entered evidence.
- Draft follow-up messages and reminders.
- Never claim payment based only on a platform listing, contest prize pool, invoice, or pending transaction.

### Phase 4 — Add separate agent runtimes only if justified

Consider OpenCode, Free Claude Code, Hermes, Paperclip, browser-use or another candidate only after:
- the exact runtime and license are checked;
- the model/provider has a verified zero-cost path with sufficient quota;
- local/free hosting and regional access are verified;
- permissions can be sandboxed and audited;
- the same work cannot be done more simply inside the existing Next.js/Supabase application.

Do not install multiple overlapping orchestrators. The current app remains the source of truth for opportunities, production orders, deliveries and income.

## Immediate next engineering tasks

1. Inspect the complete app and API implementation before editing runtime behavior.
2. Add tests for opportunity eligibility/status rules and pending-versus-received accounting.
3. Implement the Opportunity Triage data model and review UI using the existing stack, with no new paid service.
4. Add source evidence and checked-at timestamps to discovered leads.
5. Run typecheck/build and review the diff before merging.
6. Verify the deployed preview before any production release.

## Definition of done for the first assistant

The Opportunity Triage Assistant is done only when it can take a candidate listing, preserve source evidence, produce a structured review, keep unknown eligibility/payment fields unresolved, explain why a lead is blocked, and save the result to the signed-in user's workspace. It must not submit applications, publish content, spend money, or touch wallets.

## Status

As of 2026-11-27, this document records the agreed rollout design. The logical roles are not deployed agents. No model/provider, paid service, agent runtime, or autonomous external-action permission is enabled by this plan.


## Implementation update — 2026-11-27

The first deterministic Opportunity Triage engine has now been added to the application branch:

- `lib/opportunity-triage.mjs` evaluates residence eligibility, Iranian-citizenship acceptance, KYC level, crypto payout method, asset, exact network, minimum withdrawal, fees, and mandatory entry costs.
- Each required condition needs its own HTTPS evidence URL. A listing URL alone cannot stand in for KYC, country, or payout evidence.
- Outcomes are `ineligible` or `review_required`. HTTPS evidence links remain unverified until their page contents, source ownership, freshness, and relevance are checked; the engine does not currently emit `ready_for_user_approval`.
- The opportunity form captures evidence links and citizenship acceptance; saved opportunity cards show the triage state and missing evidence.
- Seven Node built-in tests cover complete evidence, missing evidence, deposits, identity-document KYC, insecure URLs, evidence parsing, and missing listing sources.
- A GitHub Actions workflow runs the triage tests and TypeScript check.

Verification snapshot:
- Local isolated Node test run: 7/7 passed.
- GitHub Actions triage test job: passed on the initial corrected run.
- GitHub Actions TypeScript check: passed.
- GitHub Actions application quality workflow: TypeScript check and production build both passed.
- No AI model, provider, paid service, agent runtime, wallet action, or account submission was enabled.


## Follow-up implementation — 2026-11-27

- Evidence-link handling is now explicitly labeled `not_verified`: HTTPS syntax alone does not verify a source's ownership, page contents, freshness, or whether it proves the associated claim. The UI states this limitation; a perfect score is not evidence validation.
- Added a deterministic Creative Producer planner for image, video, audio, and text briefs. It produces execution stages, a quality/delivery checklist, a rights warning, and a budget-approval flag. It does not generate assets or call external tools.
- Added four Creative Producer tests and expanded the triage suite to assert the unverified-evidence warning. CI now runs all `tests/*.test.mjs` tests and TypeScript checks on branch pushes and pull requests.
- The component is a supervised planner, not a deployed LLM agent. Tool quota, regional access, commercial rights, and output licensing still require per-tool review.


## Quality Reviewer implementation — 2026-11-27

- Added `lib/quality-reviewer.mjs` and TypeScript declarations for a deterministic quality gate.
- Added a UI for recording the brief, deliverable description, output format, rights status, revision limits, reviewer notes, and seven manual quality criteria.
- Unknown rights, missing rights-evidence references, or incomplete criteria require correction; prohibited commercial use blocks delivery. A complete checklist reaches human review only.
- The reviewer explicitly reports that media inspection was not performed, checklist items are user-attested, and rights-evidence references are not verified. It does not open or analyze image/video/audio files, independently validate licenses, send deliverables, or publish content.
- Added six Node tests covering complete review, unknown/prohibited rights, unchecked criteria, missing brief data, and invalid rights labels.


## Delivery Assistant implementation — 2026-11-27

- Added `lib/delivery-assistant.mjs`, TypeScript declarations, a UI component, and eight automated tests.
- The assistant builds a manifest from required/included asset names, records version/format, lists missing assets and open corrections, and drafts a client message without inventing contact information.
- The result is blocked for prohibited rights or blocked QC; otherwise it requires revision if assets/details are missing, QC is not ready for human review, rights are unknown, or corrections remain open.
- A complete package reaches `ready_for_human_approval` only. Upload and send flags are always false; final approval remains with the user.
- File existence/content, QC claims, rights evidence, and recipient/channel details are not independently verified.


## Earnings Auditor implementation — 2026-11-27

- Added a deterministic earnings ledger and reconciliation engine, TypeScript declarations, UI, and ten automated tests.
- Each record captures expected net payout, gross received amount, fee, currency, source/order, optional transaction/evidence references, date, and notes.
- The engine distinguishes pending payment, user-attested receipt, reference-recorded receipt, missing data, disputes, refunds, and net-amount mismatches. Summaries are grouped by asset.
- Amount arithmetic uses exact decimal scaling up to 18 fractional digits. Net receipt is gross receipt minus user-entered fee and is compared with expected net payout.
- No wallet or platform connection, blockchain lookup, payment verification, external message, or financial action is performed. References are stored but not verified. Follow-up messages are drafts only.
- Records are stored locally in the browser under a separate key; they are not automatically synchronized with the older basic income list or a cloud database.


## Orchestration Manager implementation — 2026-11-27

- Added a deterministic project state engine, TypeScript declarations, dashboard component, and seven transition/safety tests.
- Tracks project stage across opportunity triage, creative production, quality review, delivery preparation, and earnings audit, plus blockers, next action, approvals, and event history.
- Stage progression requires a review gate; completion requires an explicit user-confirmation marker.
- This is a supervised state tracker, not an autonomous LLM agent. It does not yet invoke assistants or transfer their form data automatically. No external actions are enabled.
- Currency-neutral policy: no fiat currency, crypto asset, or network is prioritized or preselected. Assess opportunities by net profitability, risk, fees, minimum withdrawal, country/KYC restrictions, and practical payout access.
- Earnings Auditor now starts with a blank asset field; users must enter the relevant asset/currency for each record.
