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
- Added a commercial content brief studio to the main workspace.
- The form captures product/service, target buyer, market, sales channel, deliverable, language, benefit, and client requirements.
- It produces a structured production prompt/brief that can be copied.
- UI explicitly says Instagram connection is not needed.

### Not implemented yet (do not claim otherwise)
- Live AI image/video generation from the app.
- Provider credentials, model routing, quota metering, and per-user cost controls.
- A real buyer/marketplace connector that submits assets or bids.
- Automatic delivery or payment confirmation.
- Public multi-user subscription billing and production-grade tenant isolation tests.

The current brief builder creates a structured prompt. It does **not** itself call an AI model or produce a finished image/video. The next engineering milestone is to add a server-side, provider-agnostic AI generation layer.

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
