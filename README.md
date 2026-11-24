# AI Creative Earnings

A Persian RTL workspace for discovering, reviewing, producing, delivering, and tracking paid creative work. This project is completely separate from AIRDROP AI.

## Approved income streams

1. Paid writing: articles, product descriptions, editing, and copywriting.
2. AI music and audio: commissioned music, sound effects, and audio assets.
3. Paid music voting and judging: legitimate listening contests and track-rating programs with verified rules and compensation.
4. Paid surveys and market research.
5. AI image and video production: commissioned visuals, short videos, advertising assets, and marketplace submissions.

These are categories, not verified earning opportunities. A lead stays unverified until country eligibility, identity requirements, commercial rights, payout method, fees, minimum withdrawal, and a successful test payout are checked.

## Operating rules

- Start with free tools and free quotas. No registration fees, deposits, required purchases, or subscriptions to unlock tasks.
- Payouts must be crypto-only to the user's wallet; USDT is preferred. Do not mark a platform eligible until its supported asset/network, fees, minimum withdrawal, and country restrictions are verified.
- Never claim revenue until payment has actually arrived.
- Human approval is required for account verification, contracts, and financial actions.
- Never use fake votes, fake reviews, bots, or duplicate accounts to manipulate a platform.
- Do not bypass country restrictions with VPNs or false information.
- Do not add game testing, game installation offers, Freecash, app-install rewards, or unrelated microtask platforms.
- Never store passwords, Google credentials, private keys, or wallet recovery phrases in the app or repository.

## AI-assisted remote work services

The opportunity workspace now includes a capability catalogue for services the assistant can help execute: writing and editing, research and virtual-assistant reports, AI-assisted images/design, video scripts and supported editing workflows, audio/voice preparation, and programming/debugging. Actual generation depends on connected tools, available quotas, account access, and commercial-use rights. Human approval remains required for account access, identity checks, contracts, final submissions, and financial actions. No paid tool usage or generation is allowed without explicit cost approval.

## Current application features

- Persian right-to-left dashboard with the five approved income streams.
- Opportunity radar with manual lead entry, source links, and review statuses.
- Production-order and delivery tracking.
- Income ledger that distinguishes pending from actually received payments.
- Public EVM payout-address settings; the app does not connect to or control the wallet.
- JSON backup and restore.
- Email/password signup and login through Supabase Auth. Passwords are handled by Supabase and are never stored by this app.
- Supabase access and refresh tokens are stored in HTTP-only cookies.
- Authenticated cloud workspace sync through the `workspace_state` table. The API derives the owner from the verified Supabase session; clients cannot select another owner's ID. Row Level Security restricts each account to its own workspace.
- If a cloud workspace already has data, the app restores it after sign-in. If it is empty, the app uploads the current browser workspace. Keep JSON backups as an additional safety measure.

## Infrastructure

- GitHub repository: `ebrahimi1366alireza-tech/AICreativeEarnings`
- Vercel project: `ai-creative-earnings`
- Supabase project: `AI-Creative-Earnings` (`eu-central-1`)
- Core Supabase tables: `profiles`, `opportunities`, `production_orders`, `assets`, `earnings`, and `workspace_state`. RLS is enabled on all six tables.
- The latest production deployment completed successfully. A user account has not yet been registered, so end-to-end signup, login, and cross-device sync still require a real account test.

## Live discovery and current limitations

- A server-side public-feed discovery endpoint currently reads LaborX public job posts, Subnano public requests, Jobicy, Himalayas, and Remote OK. It deduplicates and ranks topical matches and returns source links.
- The discovery feed is global; it is not restricted to the user's separate chef-job-search countries.
- LaborX, Himalayas, Jobicy, and Remote OK may return employment listings rather than one-off creative orders. Subnano requests are public budgets, not escrowed funds or guaranteed purchases.
- Every discovered lead is unverified by default. A high topical score is not an eligibility or payment score. Do not mark a platform or lead eligible until no-KYC status, the user's country eligibility, direct wallet payout, supported asset/network, all fees, minimum withdrawal, and no-deposit/no-purchase conditions are documented from official sources.
- Subnano's current FAQ documents Nano and USDC on Base creator payouts, with a 7.5% Nano sale fee and 15% USDC sale fee. The FAQ does not itself establish that KYC is never required or that every country is eligible, so Subnano remains review-only until those points are confirmed.
- LaborX listings can be found publicly, but this project has not established a no-KYC guarantee or universal country eligibility for LaborX. Keep it review-only.
- No marketplace account, client application, contract, content submission, or financial action is automated. Human approval is required.
- No automatic payout confirmation or on-chain payment verification is implemented.

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
