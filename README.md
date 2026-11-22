# AI Creative Earnings

A Persian RTL workspace for finding and managing paid online work. This project is completely separate from AIRDROP AI.

## Independent income streams
1. Paid writing: articles, product descriptions, editing, and copywriting.
2. AI music creation: commissioned music, sound effects, and audio assets.
3. Music voting and judging: paid music polls, listening contests, and track-rating programs where real compensation and rules are verified.
4. Paid surveys and market research: general surveys and product research, distinct from music voting.
6. AI image and video creation: commissioned visuals, short videos, advertising assets, and content marketplace submissions.

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
The application has a static dashboard foundation, browser-local opportunity/delivery/income tracking, and a server-side Google OAuth authorization-code flow. The income hub now displays five approved work categories: paid writing, AI music production, paid music voting/judging, paid surveys/market research, and AI image/video production. Opportunity discovery, platform integrations, production APIs, durable cross-device storage, and payout tracking are not connected yet.

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
