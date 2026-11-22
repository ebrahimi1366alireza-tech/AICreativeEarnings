# AI Creative Earnings

A Persian RTL workspace for managing paid image/video creation opportunities, free AI tool quotas, production, quality review, delivery, and earnings.

## Principles
- Start with zero-cost tools and free daily/monthly quotas.
- Verify commercial-use rights, regional access, watermark rules, and payout eligibility before accepting work.
- Never pay a registration fee or deposit to unlock a task.
- Never claim revenue until payment is actually received.
- Human approval is required for account verification, contracts, and financial actions.

## Development
```bash
npm install
npm run dev
```

## Current status
Version 0.1.0 is a static dashboard foundation. Opportunity discovery, tool integrations, persistence, and payout tracking are not connected yet.


## Google OAuth setup

The application includes a server-side Google OAuth authorization-code flow. To enable it:

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
