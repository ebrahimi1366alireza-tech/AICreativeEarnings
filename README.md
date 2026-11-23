# AI Creative Earnings

A Persian RTL workspace for finding and managing paid online work. This project is completely separate from AIRDROP AI.

## Independent income streams
1. Paid writing: articles, product descriptions, editing, and copywriting.
2. AI music creation: commissioned music, sound effects, and audio assets.
3. Music voting and judging: paid music polls, listening contests, and track-rating programs where real compensation and rules are verified.
4. Paid surveys and market research: general surveys and product research, distinct from music voting.
5. AI image and video creation: commissioned visuals, short videos, advertising assets, and content marketplace submissions.

## Operating principles
- Keep AI Creative Earnings separate from AIRDROP AI; do not mix airdrop tasks, wallets, balances, or reports into this workspace.
- Start with zero-cost tools and free daily/monthly quotas.
- Verify commercial-use rights, regional access, watermark rules, task eligibility, payout methods, fees, and minimum withdrawal before accepting work.
- Never pay a registration fee, deposit, purchase, or subscription to unlock a task.
- Never claim revenue until payment is actually received.
- Human approval is required for account verification, contracts, and financial actions.
- Do not use fake votes, fake reviews, bots, or duplicate accounts to manipulate contests or platforms.

## Development
```bash
npm install
npm run dev
```

## Current status
The application has a dashboard foundation, browser-local opportunity/delivery/income tracking, a preloaded EVM payout destination, wallet-inclusive JSON backup/restore, and a server-side Google OAuth authorization-code flow. Google sign-in currently verifies an account session only; it does not sync dashboard data or connect Gmail services. The income hub now displays five configured work streams: paid writing, AI music production, paid music voting/judging, paid surveys/market research, and AI image/video production. These are categories, not verified earning opportunities. Automatic opportunity discovery, marketplace integrations, production APIs inside the app, durable cross-device storage, and on-chain payout verification are not connected yet. Subnano is listed only as a review lead for selling paid posts: it supports creator payouts in USDC on Base or Nano, takes 15% on USDC sales and 7.5% on Nano sales, and pays each sale individually; country access and audience demand still need manual validation. LaborX is listed as a review lead for freelance writing/design work with crypto escrow and USDT support on Ethereum and BNB Chain; the published freelancer fee is 10%, Premium is not required to apply, and country/KYC/withdrawal requirements still need account-level verification. Entries are manual records and must not be treated as verified jobs or confirmed blockchain receipts. Opportunity records now include income stream, eligible countries, payout route, network, minimum withdrawal, fees, KYC requirement, and an official evidence URL. Their status defaults to `needs review`; entering these fields does not independently verify a platform or make it eligible.

## Google OAuth setup
To enable Google sign-in:
1. Create an OAuth 2.0 Web application client in Google Cloud Console.
2. Add the deployed app's exact callback URL to Authorized redirect URIs:
   `https://YOUR-VERCEL-DOMAIN/api/auth/google/callback`
3. Add these variables to the Vercel project (Production and Preview as appropriate):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET` (secret)
   - `GOOGLE_REDIRECT_URI` (the exact callback URL above)
   - `SESSION_SECRET` (a random secret of at least 32 characters)
4. Redeploy after adding the variables.

The app stores a signed, HTTP-only session cookie. It requests only OpenID, email, and basic profile scopes. It does not request Gmail mailbox access. Never commit OAuth secrets to GitHub or paste them into chat.


## Explicit exclusions
- Do not add game testing, game installation offers, Freecash, app-install rewards, or unrelated microtask platforms.
- The five approved work streams are paid writing, AI music/audio production, paid music voting/judging, paid surveys/market research, and AI image/video production.
- Payouts must be crypto-only to the user's wallet, with USDT preferred. Do not claim a platform qualifies until its crypto payout, fees, minimum withdrawal, and country eligibility have been verified.

## Installed creative toolkit
The current phone toolkit is:
- Dreamina: AI image and video drafts.
- Krea: connected to ChatGPT for image/video generation and editing. Its current pricing page lists 100 free units per day and a commercial license; verify the current terms and model-specific rights before client delivery. Krea API billing is separate from the consumer app plan and is pay-per-generation, so do not trigger API generations unless the exact cost is known and approved.
- Canva: layouts, ads, and product visuals.
- CapCut: video editing, captions, and audio finishing.
- ElevenLabs: AI voice/audio and music exploration.
- ChatGPT: research, outlining, drafting, and editing articles.
- Google Docs: formatting and preparing written deliverables.
- Notion: connected workspace for project documents and content management; ChatGPT handles English spelling, grammar, sentence flow, and final proofreading.

A free tier does not automatically grant unlimited generations or commercial-use rights. Before accepting paid work, verify the specific account's quota, regional availability, watermark rules, and license for every generated asset. Do not purchase subscriptions or credits without the user's explicit approval.


## Payout wallet and opportunity review
- The selected public EVM payout address is preloaded into the browser-local wallet settings on first load and can be changed by the user. It is included in JSON backups; private keys, seed phrases, and Google credentials are never stored or exported.
- The wallet address passed an initial third-party sanctions-list lookup with no record found, but that is not a full AML clearance or an on-chain risk analysis. Always confirm the destination network and the receiving platform's requirements before accepting a payout.
- Subnano is a review-only lead for selling paid posts, not a guaranteed job source. Its official FAQ lists USDC on Base and Nano payouts, no minimum creator balance, a 15% USDC fee, and a 7.5% Nano fee. Country eligibility, KYC requirements, and whether the user can attract buyers remain unverified.
- Do not treat any lead as verified income until country eligibility, identity requirements, commercial rights, payout destination, and a small successful test payout have been checked.

- LaborX official reference: https://laborx.com/ (crypto freelance marketplace; 10% standard freelancer fee and supported USDT networks are documented on its site).



## Account authentication
- The app uses email/password signup and sign-in through Supabase Auth. Passwords are handled by Supabase and are never stored by this app.
- Supabase access and refresh tokens are stored in HTTP-only cookies. The app refreshes expired access sessions server-side.
- Google sign-in and Gmail mailbox integration are not part of the current account flow.
- Cross-device dashboard synchronization remains future work; current opportunity, delivery, income and wallet records are browser-local and can be transferred with JSON backup/restore.
