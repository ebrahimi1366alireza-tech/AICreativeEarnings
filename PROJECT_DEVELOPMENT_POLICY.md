# Shared Project Development Policy

This file records cross-project decisions and must be consulted when starting, continuing, or creating any project in this account. Copy this policy into every new project repository and keep it aligned with the latest version.

## Development environment
- Prefer one shared, mobile-accessible cloud development workflow for the user's Android-only setup.
- Use OpenCode as the primary coding agent.
- Use GitHub Codespaces as the preferred cloud development environment and GitHub Actions for builds, tests, and APK workflows.
- Use Free Claude Code (FCC) as an optional supplementary tool alongside OpenCode, not as a replacement for it.
- Keep FCC integration opt-in and security-reviewed. Do not run an unreviewed interactive installer automatically during container creation or post-create hooks.
- Prefer genuinely free tiers, free model/provider quotas, and open-source tools. The fact that a client or harness is free does not mean its model/API provider is free.

## Cost and authorization
- Do not create paid subscriptions, paid API usage, deposits, or other charges without the user's explicit approval.
- Before any potentially chargeable integration, state the actual pricing, free-tier limits, and whether a payment method or identity verification is required.
- Never store passwords, OTPs, recovery codes, seed phrases, private keys, or API secrets in Git.
- Pause at account login, email/SMS verification, CAPTCHA, identity checks, wallet connection, or other user-only authorization steps and make the step accessible to the user. The user must enter their own codes and approve sensitive actions.

## Project order
- Complete **AI Creative Earnings** before starting or advancing **AIRDROP AI**.
- Do not let AIRDROP AI work overtake the AI Creative Earnings completion priority unless the user explicitly changes this order.
- Apply the shared development and cost policy to all other current and future projects as well.

## Product and automation safety
- Be transparent about what is implemented, tested, deployed, and still blocked. Never report an installation, build, deployment, or integration as complete unless it was actually verified.
- Keep user-visible controls for important features; do not hide requested capabilities solely in background logic.
- Require explicit user review and approval before financial transactions, wallet signatures, publishing, or irreversible actions.
- Treat external project listings, airdrops, earning opportunities, links, and claims as unverified until checked against authoritative sources. Never promise earnings or allocations.

## Maintenance
- This policy is shared project guidance, not proof that tools are installed or services are connected.
- When creating a new repository, add this file before implementation begins.
- Update this file when the user explicitly changes a cross-project decision, and propagate the update to every active project repository.


## Income platforms and opportunity research
- For AI Creative Earnings and any future income-oriented project, consult the repository's `docs/INCOME_PLATFORMS_CATALOG.md` before selecting tasks, services, or monetization channels.
- Reuse the catalog automatically as a starting point; do not make the user repeat platform names or prior constraints.
- Treat listed platforms as research leads, not verified earning guarantees. Before recommending or automating a platform, re-check official country eligibility, identity/KYC rules, payout methods, fees, minimum withdrawal, and whether upfront payment/deposit is required.
- Prefer opportunities with no mandatory deposit, no paid subscription, transparent task requirements, and a payout route the user can actually access.
- Keep the catalog current: add newly vetted sources and record blocked, unavailable, or unsuitable platforms with the reason.
