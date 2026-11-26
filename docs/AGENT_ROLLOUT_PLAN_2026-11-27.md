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
9. Keep the six existing income streams distinct: paid writing, original audio/music, legitimate paid evaluation, paid surveys/research, image/video/design production, and browser-only microtasks/website testing. Exclude fake engagement, fake reviews/votes, mandatory app/game installs, and deposit-funded tasks.

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
