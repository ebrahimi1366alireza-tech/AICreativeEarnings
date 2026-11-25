# Commercial Content Sales Product Direction

Last updated: 2026-11-26

## Product definition

AI Creative Earnings is a multi-user workspace for creating **commercial creative assets that can be sold to real buyers**. It is not an Instagram page manager, social-media scheduler, or follower-growth service. Instagram connection is not required for the core product.

The product helps a worker move through this sequence:

1. Discover a real client brief, paid creative order, contest, or legitimate digital-asset marketplace.
2. Review buyer identity, budget/funding, deliverables, usage rights, deadline, country eligibility, KYC, payout asset/network, withdrawal minimum, fees, and mandatory costs.
3. Prepare a production brief tailored to the buyer and deliverable.
4. Generate and edit the actual commercial asset (image, product visual, ad creative, short video, motion graphic, copy, or audio) using approved AI/media providers.
5. Run factual, visual, technical, originality, and commercial-rights checks.
6. Deliver through the buyer's requested channel after the worker approves.
7. Record only confirmed receipts as income.

## User experience

- User installs the app, creates their own account, and uses their own workspace.
- User does not need to install ChatGPT or connect Instagram.
- User chooses a sales route: marketplace order, direct client, digital asset storefront, or commercial contest/bounty.
- User selects the deliverable and provides product/client requirements.
- The system prepares the brief, creates the asset, and helps package the delivery.
- The user remains in control of account access, KYC, contract acceptance, submission, and financial actions.

## Current implementation status

### Implemented in this change
- Commercial content brief studio integrated into the main workspace.
- Brief fields: product/service, target buyer, market, sales channel, deliverable, language, benefit, and client requirements.
- Authenticated server endpoint `POST /api/creative/generate` for text and image generation.
- Server-side OpenAI API integration using `OPENAI_API_KEY`; text model configurable with `OPENAI_TEXT_MODEL` (default `gpt-4.1-mini`), image model configurable with `OPENAI_IMAGE_MODEL` (default `gpt-image-1`).
- Client controls to request generated advertising copy or a commercial image and preview/download the image.
- Authentication is checked server-side using the existing HttpOnly Supabase access cookie. The provider key is never sent to the browser.
- Same-origin POST validation, JSON content-type check, bounded request size, prompt length limit, request timeouts, and no-store responses.
- UI explicitly states that Instagram connection is not needed and generation may incur API charges.

### Not implemented yet (do not claim otherwise)
- Video generation or motion-graphics rendering.
- Persistent per-user quotas, billing, cost attribution, and abuse/rate-limit controls. Current endpoint is authenticated and request-bounded but is **not safe for unrestricted public launch** until these are added.
- Persistent storage/library for generated images and text; image output currently returns to the current browser session as a data URL.
- A real buyer/marketplace connector that submits assets or bids.
- Automatic delivery or payment confirmation.
- Public multi-user subscription billing and production-grade tenant isolation tests.
- Commercial-use licensing verification for each model/provider plan.

Generation requires an administrator to configure `OPENAI_API_KEY` in the server environment. No provider key is included in the repository or APK. Image generation can incur provider charges. The app does not trigger generation until the user clicks a generation action. If the key is absent, the endpoint returns a configuration message. Video generation is not yet available.

## Required architecture for AI generation

- Browser/APK calls authenticated server endpoints only.
- API credentials remain server-side; never embed provider secrets in the APK or client bundle.
- Every generation request is associated with the authenticated user ID derived from the server session, not a client-supplied owner ID.
- Store generation metadata, provider/model, prompt, status, output references, token/credit usage, and cost estimate in a per-user workspace.
- Enforce quotas, rate limits, output-size limits, and per-user budget caps before provider calls.
- Start with text/brief generation; image and video providers are separate capabilities and may have different costs and commercial-use terms.
- Do not run paid generation unless the user has explicitly approved the applicable cost/plan.
- Keep original source files, generated assets, licensing/usage notes, and final approved deliverables separate.
- Never claim an asset is commercially licensed until the exact provider plan, model, and asset terms have been checked.

## Sales-channel requirements

Each opportunity must distinguish:
- Public listing vs funded/escrowed order vs confirmed direct client.
- Asking budget vs guaranteed payment.
- Marketplace fee vs payment-network fee.
- Payout asset and exact chain/network.
- KYC and passport acceptance by citizenship.
- Current-presence eligibility vs formal residence-permit requirement.
- Commercial usage rights and exclusivity.
- Submission deadline and deliverable format.

No opportunity becomes eligible solely because it mentions crypto, says worldwide, or displays a budget.

## Product non-goals

- No requirement to connect Instagram, Facebook, TikTok, or another social account for core creation/sales.
- No automatic social posting as the core value proposition.
- No fake engagement, fake reviews, manipulated votes, or spam.
- No guaranteed-income claims.
- No automatic acceptance of contracts, identity checks, submissions, purchases, or financial actions.
