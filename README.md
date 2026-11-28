# AI Creative Earnings

A Persian RTL workspace for discovering, reviewing, producing, delivering, and tracking paid creative work. This project is completely separate from AIRDROP AI.

## Seven income streams

1. Paid writing and text services: articles, product copy, editing, and related client work.
2. AI music and audio production: original tracks, sound effects, and promotional audio.
3. Music evaluation and voting: only legitimate paid rating or judging programs with transparent rules; no fake or manipulated votes.
4. Paid surveys and market research: only genuine research participation with clear compensation.
5. AI image and graphic-design services: product visuals, advertising graphics, thumbnails, and creative deliverables.
6. AI video and motion-graphics services: short videos, editing, and motion assets.
7. Browser-only microtasks and website testing: web QA, content/data evaluation, and short tasks usable directly in a mobile browser.

The seven streams are product scope, not proof that matching live opportunities or integrations already exist. The current public discovery feed reads LaborX, Subnano, and Superteam Earn. The 25-platform registry explicitly distinguishes connected feeds (3), catalog-only sources (21), and a restricted platform (1); a catalog entry is never presented as a live integration. Surveys, music evaluation, and browser-task platforms remain unconnected until an official public feed is implemented and tested. Every lead remains unverified until country eligibility, Iranian passport acceptance, identity/KYC, payment method, asset/network, fees, minimum withdrawal, task requirements, and zero mandatory entry costs are documented.

## Operating rules

- Start with free tools and free quotas. No registration fees, deposits, required purchases, or subscriptions to unlock tasks.
- Payouts must be crypto/token-only to the user's own wallet. Fiat, PayPal, Payoneer, Wise, gift cards, and bank withdrawals are excluded. Verify the exact asset, network, fees, minimum withdrawal, and country restrictions before accepting any task.
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
- Income ledger that distinguishes pending from actually received payments.
- Public wallet-address and network settings for different supported crypto assets; the app does not connect to or control the wallet.
- JSON backup and restore. New exports use AES-256-GCM encryption with a PBKDF2-SHA-256 derived key (310,000 iterations), random salt, and random IV. A password of at least 12 characters is required and is never stored. Legacy plaintext schema-v1 imports require an explicit warning confirmation. Automatic pre-import backups are encrypted as well.
- Email/password signup and login through Supabase Auth. Passwords are handled by Supabase and are never stored by this app.
- Supabase access and refresh tokens are stored in HTTP-only cookies.
- Authenticated cloud workspace sync through the `workspace_state` table. The API derives the owner from the verified Supabase session; clients cannot select another owner's ID. Row Level Security restricts each account to its own workspace.
- Cloud backup also includes the KYC/payment review catalogue and the selected residence, citizenship, and payout-bank country. Platform eligibility is stored separately by residence, and identity-document acceptance is stored separately by citizenship; unknown values remain unverified.
- If a cloud workspace already has data, the app restores it after sign-in. If it is empty, the app uploads the current browser workspace. Keep JSON backups as an additional safety measure.

## Infrastructure

- GitHub repository: `ebrahimi1366alireza-tech/AICreativeEarnings`
- Vercel project: `ai-creative-earnings`
- Supabase project: `AI-Creative-Earnings` (`eu-central-1`)
- Supabase public tables: `profiles`, `opportunities`, `production_orders`, `assets`, `earnings`, `workspace_state`, `verification_devices`, `verification_handoffs`, and `creative_daily_usage`. RLS is enabled on all nine tables.
- The latest production deployment completed successfully. A user account has not yet been registered, so end-to-end signup, login, and cross-device sync still require a real account test.
- Supabase Auth's leaked-password protection is currently disabled. Supabase documentation states this feature is available on Pro plan and above; this organization is currently on the Free plan. Do not upgrade or incur a subscription without the owner's explicit budget approval. Review the setting under [Supabase Auth password security](https://supabase.com/dashboard/project/hkbyijbvkymwnsgyoqmm/auth/providers?provider=Email) if the plan is later upgraded.

## Current earning-channel review

The dashboard includes a 25-entry platform compatibility review catalogue in `app/components/platform-review-catalog.tsx`. Every entry is review-only by default; country, Iranian passport acceptance, KYC, payout route, fees, and no-deposit conditions must be checked before any platform is marked compatible. Microworker.app, Loopuman, SurveyTokens (IOTA route only for review), Taskmarket, Monero.Jobs, XmrBazaar, LaborX, and CryptoTask are prioritized candidates. Dework and Open Bounty remain conditional leads; Web3.Career and CryptoJobs.com are job-board sources only, not payout providers. Worqen is recorded as excluded because its current terms explicitly prohibit Iranian nationals and require KYC. The catalogue does not automate signup, KYC, wallet connection, submissions, or payouts.

## Live discovery and current limitations

- A server-side public-feed discovery endpoint currently reads LaborX freelance posts, Subnano public requests, and open creative listings from Superteam Earn. Employment feeds (Jobicy, Himalayas, Remote OK) are intentionally excluded because job vacancies are not the same as paid creative orders. The endpoint deduplicates and ranks topical matches and returns source links.
- The discovery feed is global; it is not restricted to the user's separate chef-job-search countries.
- Subnano requests are public budgets, not escrowed funds or guaranteed purchases. LaborX listings still require checking that the specific page is an actual freelance order, not an employment vacancy.
- Every discovered lead is unverified by default. A high topical score is not an eligibility or payment score. Do not mark a platform or lead eligible until its KYC requirements and document rules, the user's country eligibility, direct wallet payout, supported asset/network, all fees, minimum withdrawal, and no-deposit/no-purchase conditions are documented from official sources.
- Subnano's current FAQ documents Nano and USDC on Base creator payouts, with a 7.5% Nano sale fee and 15% USDC sale fee. The FAQ does not itself establish that KYC is never required or that every country is eligible, so Subnano remains review-only until those points are confirmed.
- LaborX listings can be found publicly, but this project has not established a no-KYC guarantee or universal country eligibility for LaborX. Keep it review-only.
- No marketplace account, client application, contract, content submission, or financial action is automated. Human approval is required.
- No automatic payout confirmation or on-chain payment verification is implemented.

Do not present a public listing as a verified paid order or a review-only platform as KYC-free.

## Free-first AI video generation\n\nSee [docs/free-video-generation.md](docs/free-video-generation.md). The current release supports manual handoff to consumer tools and open-source self-hosting; it does not claim a free unlimited video API. All provider APIs remain disabled, and Runway Dev API remains disabled because it requires paid API credits.\n\n## Creative toolkit

- Dreamina: image and video drafts.
- Krea: image/video generation and editing. Verify the current account quota, regional access, watermark rules, and commercial rights for the exact model/output. Krea API billing is separate from the consumer app plan; do not trigger paid API generations without explicit cost approval.
- Canva: layouts, ads, and product visuals.
- CapCut: video editing, captions, and audio finishing.
- ElevenLabs: voice, audio, and music exploration; verify plan-specific commercial rights.
- ChatGPT: research, outlining, drafting, and editing.
- Google Docs: formatting and preparing written deliverables.
- Notion: project documentation and content management.

A free tier does not automatically grant unlimited generations or commercial-use rights.

## Reviewed agent orchestration tools

- [OpenMausBot review](docs/tool-reviews/openmausbot.md): candidate for a later isolated multi-agent orchestration experiment. It is not a production dependency or an earning platform. Review runtime requirements, provider costs, licensing, agent permissions, credential handling, and security cautions before any trial.
- [Stack on a Budget review](docs/tool-reviews/stack-on-a-budget.md): reference catalogue for discovering free-tier infrastructure (hosting, databases, CDN, email, monitoring, APIs, and related services). It is not a provider or runtime dependency; verify every provider's current pricing, Armenia availability, identity restrictions, security, and overage behavior before adoption.
- [Free Claude Code (FCC) review](docs/tool-reviews/free-claude-code.md): optional local model/provider routing companion for OpenCode, not a multi-agent orchestrator or earning platform. The existing opt-in setup remains confirmation-gated; do not install automatically or enable paid providers without explicit approval.

## Review-only leads

- Subnano: possible paid-content marketplace. Its official FAQ has listed Nano and USDC on Base payouts, a 7.5% Nano fee, and a 15% USDC fee. Verify current country access, identity rules, and payout conditions inside the account.
- LaborX: crypto freelance marketplace with escrow and USDC/USDT/DAI on Ethereum or BNB Chain; the official FAQ states a 10% freelancer fee. Country and identity eligibility for this account remain unverified.
- CryptoTask: freelance marketplace advertising crypto payments, escrow, and fees up to 3%; exact payout assets/networks and KYC/country acceptance remain unverified.
- Dework: DAO bounty board; each sponsor determines reward token and conditions, so USDC payout is not guaranteed.
- Open Bounty: its current official API documentation explicitly describes the marketplace integration as testnet, with USDC/x402 on the configured Base network. Public bounty reads exist, but real mainnet worker payouts are not established by that documentation. Keep it catalog-only until production-network status and real payouts are independently confirmed.
- Web3.Career and CryptoJobs.com: discovery boards only. The employer, not the board, determines payout, KYC, and country eligibility.
- Worqen: excluded for this account. Its official Terms explicitly bar Iranian nationals and require KYC; do not attempt to bypass this restriction.

Official references:
- https://subnano.ai/faq
- https://laborx.com/
- https://www.cryptotask.org/en
- https://app.dework.xyz/bounties
- https://openbounty.app/
- https://web3.career/pay-in-crypto-jobs
- https://www.cryptojobs.com/public/jobs
- https://worqen.com/legal/terms

## Development

```bash
npm install
npm run dev
```

The current app is a management workspace, not an earning guarantee. Manual entry does not verify a platform or make an opportunity eligible.

## Shared cloud development and optional FCC

The Dev Container keeps OpenCode as the primary coding agent. Free Claude Code (FCC) is an optional companion and is **not** installed automatically during container creation because its official installer is interactive and may offer additional agents.

See [docs/FCC_SETUP.md](docs/FCC_SETUP.md). Run the preflight with `bash scripts/install-fcc.sh --check`; install only after reviewing the provider-cost and security notes with `bash scripts/install-fcc.sh --install`. Choose OpenCode only in the official installer. FCC installation/provider connection has not been verified merely by adding these setup files.

GitHub Actions runs the TypeScript check on pushes and pull requests. This workflow does not deploy the app or connect to Supabase.

## Supervised Orchestration Manager

The deterministic Orchestration Manager creates and tracks project records across opportunity triage, creative production, quality review, delivery preparation, and earnings audit. It records stage, status, blockers, next action, approvals, and an event log. This first version is a supervised state tracker: it does not yet invoke or transfer data between the five assistants automatically, and it performs no external actions. Completion requires explicit user confirmation.

## Supervised Creative Producer

The Creative Producer turns a brief into a deterministic production plan, execution stages, quality checklist, rights warning, and budget-approval flag for image, video, audio, and text work. It does not generate files, call external tools, consume credits, or submit deliverables. Rights marked unknown remain explicitly unresolved, and non-zero tool budgets require separate user approval. The planner is covered by automated Node tests.

## Quality Reviewer

The Quality Reviewer evaluates a manually completed checklist for brief compliance, format, language, technical quality, originality, rights evidence, and destination-platform rules. Unknown or prohibited rights block commercial delivery. A complete checklist reaches human review only: the tool does not inspect media bytes, independently verify rights or license references, approve work, publish, or send files. Checklist entries and evidence references are user-provided and are not independently validated.

## Delivery Assistant

- The supervised Delivery Assistant prepares a delivery manifest from user-entered required and included asset names, order details, version, format, QC state, rights state, open corrections, and an optional deadline.
- Missing assets, incomplete details, unresolved/prohibited rights, an unreviewed or blocked QC state, and outstanding corrections prevent a ready-for-approval result.
- A complete pack is marked `ready_for_human_approval`, never sent automatically. It generates a client-message draft but does not invent contact details, verify files, upload assets, contact clients, or submit deliverables.
- Asset names and QC/rights statuses are user-provided claims. File existence, content, license evidence, and delivery-channel access are not independently verified.
- Eight Node tests cover complete packs, missing assets, missing QC, unknown/prohibited rights, missing fields, no invented recipient, and outstanding corrections.


## Earnings Auditor

- The supervised Earnings Auditor records expected net payout, user-entered gross receipt, fees, asset, order/source, optional payment date, transaction reference, evidence reference, and notes.
- It separates pending, received, disputed, refunded, amount-mismatch, and incomplete records. Summaries are grouped by asset and distinguish expected, pending, and user-recorded received amounts.
- Decimal arithmetic supports up to 18 fractional digits. A received amount is reconciled against expected net amount after the entered fee.
- A transaction hash or receipt URL is stored as a reference only. The app does not connect to wallets, query blockchains or platforms, verify payment, or send follow-up messages.
- Follow-up text is a draft only. Records are stored in the current browser's local storage; export a workspace backup before changing devices or clearing site data.
- Ten Node tests cover exact reconciliation, pending and disputed/refunded states, amount mismatch, missing data, fee validation, aggregation, decimal precision, and the absence of external actions.


## Connected assistant pipeline

The Connected Assistant Pipeline runs the five local deterministic modules in sequence: Opportunity Triage -> Creative Producer -> Quality Reviewer -> Delivery Assistant -> Earnings Auditor. Each stage receives structured output from the previous stage, records its status and handoff, and creates a reviewable execution report. The pipeline is local and does not require a model API or paid inference.

This is real module orchestration, not a claim that independent cloud agents or LLMs are running. Source pages, licenses, media files, and payments are not independently verified. Unknown rights, incomplete QC, missing assets, and unverified earnings remain unresolved. No account registration, wallet connection, payment, upload, client message, or external submission is performed. Human approval remains mandatory.

## Optional LLM assistant adapter

An authenticated, server-side OpenAI-compatible adapter is available at `/api/assistants/advice`. It is disabled by default, requires server-only provider configuration and explicit per-request consent, and forwards only allowlisted creative-brief fields. It returns advisory text only and cannot override deterministic safety gates. See [the adapter guide](docs/assistant-llm-adapter.md). No provider credentials, paid inference, or live external processing are configured by this repository change.


## Opportunity source integration status

The discovery UI reads the explicit 25-platform integration registry from `lib/opportunity-sources.mjs`. LaborX (public Telegram feed), Subnano (public requests API), and Superteam Earn (public listings API) are marked connected. The other 21 sources are catalog-only and Worqen is marked restricted for this target profile. Tests in `tests/opportunity-sources.test.mjs`, `tests/opportunity-streams.test.mjs`, and `tests/opportunity-filter.test.mjs` prevent catalog entries from being mistaken for live feeds and cover the safety filters.


Superteam Earn uses the read-only public listings endpoint `https://superteam.fun/api/listings?take=100&status=open`. The integration keeps open, not-yet-awarded listings whose titles match the creative stream classifier; it records the token as stated by the API and never assumes the network, eligibility, KYC, or payment guarantee. Apply/submit remains a manual user action.
