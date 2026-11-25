# AI Creative Earnings

A Persian RTL workspace for discovering, reviewing, producing, delivering, and tracking paid creative work. This project is completely separate from AIRDROP AI.

## Six income streams

1. Paid writing and text services: articles, product copy, editing, and related client work.
2. AI music and audio production: original tracks, sound effects, and promotional audio.
3. Music evaluation and voting: only legitimate paid rating or judging programs with transparent rules; no fake or manipulated votes.
4. Paid surveys and market research: only genuine research participation with clear compensation.
5. AI image and video production: product visuals, advertising graphics, short videos, and creative deliverables.
6. Browser-only microtasks and website testing: web QA, content/data evaluation, and short tasks usable directly in a mobile browser.

The six streams are product scope, not proof that matching live opportunities or integrations already exist. The current public discovery feed reads LaborX and Subnano only; surveys, music evaluation, and browser-task platforms are not yet connected to live feeds. Every lead remains unverified until country eligibility, identity/KYC, payment method, fees, minimum withdrawal, task requirements, and zero mandatory entry costs are documented.

## Operating rules

- Start with free tools and free quotas. No registration fees, deposits, required purchases, or subscriptions to unlock tasks.
- Payouts must be crypto-only to the user's personal wallet; no token or coin has priority. Keep each asset's balance separate and never add unlike assets without a verified conversion. Do not mark a platform eligible until its exact supported asset/network, fees, minimum withdrawal, and country restrictions are verified.
- Never claim revenue until payment has actually arrived.
- Human approval is required for account verification, contracts, and financial actions.
- Never use fake votes, fake reviews, bots, or duplicate accounts to manipulate a platform.
- Do not bypass country restrictions with VPNs or false information.
- Include browser-only microtasks and website testing where tasks can be completed without installing an app. Exclude mandatory app/game installation, app-only testing, and reward offers that require installing software.
- Never store passwords, Google credentials, private keys, or wallet recovery phrases in the app or repository.

## AI-assisted remote work services

The opportunity workspace now includes a capability catalogue for AI-assisted product imagery, advertising/social graphics, short-video editing, motion-graphics preparation, and visual asset resizing or cleanup. Actual generation depends on connected tools, available quotas, account access, and commercial-use rights. Human approval remains required for account access, identity checks, contracts, final submissions, and financial actions. No paid tool usage or generation is allowed without explicit cost approval.

## Current application features

- Persian right-to-left dashboard focused on AI image, design, and short-video services.
- Opportunity radar with manual lead entry, source links, and review statuses.
- Production-order and delivery tracking.
- Income ledger that distinguishes pending from actually received payments and tracks totals separately by token symbol.
- Network-agnostic public wallet-address and network settings for supported crypto assets; the app does not connect to or control the wallet. Address format checks are basic input hygiene, not proof that an address or network is valid.
- JSON backup and restore.
- User-managed creative portfolio gallery for real image samples; images remain local to the current browser and are not cloud-synced.
- Smart Login verification handoff panel for a paired Android device. The secure queue and Supabase Edge Function are deployed, but automatic detection still requires the external browser automation agent to call the handoff endpoint.
- Email/password signup and login through Supabase Auth. Passwords are handled by Supabase and are never stored by this app.
- Supabase access and refresh tokens are stored in HTTP-only cookies.
- Authenticated cloud workspace sync through the `workspace_state` table. The API derives the owner from the verified Supabase session; clients cannot select another owner's ID. Row Level Security restricts each account to its own workspace.
- Cloud backup also includes the KYC/payment review catalogue and the selected residence, citizenship, and payout-bank country. Platform eligibility is stored separately by residence, and identity-document acceptance is stored separately by citizenship; unknown values remain unverified.
- If a cloud workspace already has data, the app restores it after sign-in. If it is empty, the app uploads the current browser workspace. Keep JSON backups as an additional safety measure.

## Infrastructure

- GitHub repository: `ebrahimi1366alireza-tech/AICreativeEarnings`
- Vercel project: `ai-creative-earnings`
- Supabase project: `AI-Creative-Earnings` (`eu-central-1`)
- Core Supabase tables: `profiles`, `opportunities`, `production_orders`, `assets`, `earnings`, `workspace_state`, `verification_devices`, and `verification_handoffs`. RLS is enabled on all eight tables.
- The latest production deployment completed successfully. A user account has not yet been registered, so end-to-end signup, login, and cross-device sync still require a real account test.

## Current earning-channel review

The latest live review is [docs/live-earning-channels-2026-11-25.md](docs/live-earning-channels-2026-11-25.md). It identifies Subnano as a possible free creator storefront (not guaranteed demand), keeps Gibwork on watchlist until a funded eligible creative bounty is verified, treats HireForHumans as waitlist-only until a live worker board is confirmed, and excludes low-value or manipulative Anoworks engagement tasks.

## Live discovery and current limitations

- A server-side public-feed discovery endpoint currently reads LaborX freelance posts and Subnano public requests. Employment feeds (Jobicy, Himalayas, Remote OK) are intentionally excluded because job vacancies are not the same as paid creative orders. The endpoint deduplicates and ranks topical matches and returns source links.
- The discovery feed is global; it is not restricted to the user's separate chef-job-search countries.
- Subnano requests are public budgets, not escrowed funds or guaranteed purchases. LaborX listings still require checking that the specific page is an actual freelance order, not an employment vacancy.
- Every discovered lead is unverified by default. A high topical score is not an eligibility or payment score. Do not mark a platform or lead eligible until no-KYC status, the user's country eligibility, direct wallet payout, supported asset/network, all fees, minimum withdrawal, and no-deposit/no-purchase conditions are documented from official sources.
- Subnano's current FAQ documents Nano and USDC on Base creator payouts, with a 7.5% Nano sale fee and 15% USDC sale fee. The FAQ does not itself establish that KYC is never required or that every country is eligible, so Subnano remains review-only until those points are confirmed.
- LaborX listings can be found publicly, but this project has not established a no-KYC guarantee or universal country eligibility for LaborX. Keep it review-only.
- No marketplace account, client application, contract, content submission, or financial action is automated. Human approval is required.
- No automatic payout confirmation or on-chain payment verification is implemented. The Smart Login phone handoff is implemented, but the browser automation agent is not yet wired to detect OTP/liveness/identity checkpoints and call it.

Do not present a public listing as a verified paid order or a review-only platform as KYC-free.

## Creative toolkit

- Dreamina: image and video drafts.
- Krea: image/video generation and editing. Verify the current account quota, regional access, watermark rules, and commercial rights for the exact model/output. Krea API billing is separate from the consumer app plan; do not trigger paid API generations without explicit cost approval.
- Canva: layouts, ads, and product visuals.
- CapCut: video editing, captions, and audio finishing.
- ElevenLabs: voice, audio, and music exploration; verify plan-specific commercial rights.
- ChatGPT: research, outlining, drafting, and editing.
- Google Docs: formatting and preparing written deliverables.
- Notion: project documentation and content management.

A free tier does not automatically grant unlimited generations or commercial-use rights.

## Review-only leads

- Subnano: possible paid-content marketplace. Its official FAQ has listed Nano and USDC on Base payouts, a 7.5% Nano fee, and a 15% USDC fee. Verify current country access, identity rules, and payout conditions inside the account.
- LaborX: crypto freelance marketplace. Its official site documents a standard freelancer fee; verify the current fee, supported USDT network, country access, KYC, and withdrawal terms before accepting a job.

Official references:
- https://subnano.ai/faq
- https://laborx.com/

## Development

```bash
npm install
npm run dev
``

The current app is a management workspace, not an earning guarantee. Manual entry does not verify a platform or make an opportunity eligible.

## Shared cloud development and optional FCC

The Dev Container keeps OpenCode as the primary coding agent. Free Claude Code (FCC) is an optional companion and is **not** installed automatically during container creation because its official installer is interactive and may offer additional agents.

See [docs/FCC_SETUP.md](docs/FCC_SETUP.md). Run the preflight with `bash scripts/install-fcc.sh --check`; install only after reviewing the provider-cost and security notes with `bash scripts/install-fcc.sh --install`. Choose OpenCode only in the official installer. FCC installation/provider connection has not been verified merely by adding these setup files.

GitHub Actions runs the TypeScript check on pushes and pull requests. This workflow does not deploy the app or connect to Supabase.
