# Stack on a Budget review

**Reviewed:** 2026-11-26  
**Upstream:** https://github.com/255kb/stack-on-a-budget  
**Status:** Reference catalogue for infrastructure research; not an adopted dependency or service provider.

## Summary

Stack on a Budget is a community-maintained catalogue of third-party services that advertise free tiers. It covers infrastructure and developer-facing categories such as application hosting, databases, static hosting/CDNs, CI/CD, monitoring and error reporting, email, authentication, APIs, and security.

It is useful as a discovery index when looking for low-cost infrastructure. It is not itself a hosting platform, cloud service, income platform, or guarantee that any listed provider still offers the described free tier.

## Relevance to AI Creative Earnings

Potential research uses:

- Compare free or low-cost hosting options for preview environments and small auxiliary services.
- Discover database, object-storage, CDN, email, authentication, monitoring, and error-reporting providers.
- Find data/API providers that may support opportunity discovery or internal tooling.
- Identify alternatives only when the existing infrastructure has a demonstrated limitation or cost problem.

The project already uses Vercel for deployment and Supabase for authentication and cloud workspace data. This catalogue does not justify replacing either service. Any proposed change must be evaluated against the current architecture, security controls, reliability, migration effort, and actual free-tier limits.

## Reliability and freshness

- The repository is a catalogue maintained through community contributions. Its own contribution guide asks contributors to document the free tier, pros, limitations, overage behavior, and whether a credit card is required.
- Provider pricing, quotas, geographic availability, product names, and free-tier terms can change independently of this catalogue.
- A listing is a lead for investigation, not current proof. Re-check the provider's official pricing, terms, documentation, status page, and signup flow immediately before adoption.
- Verify whether a free tier is permanent, time-limited, trial credit, or usage-limited; whether a payment card is required; what happens at quota exhaustion; and whether unexpected overage billing is possible.
- Check Armenia availability and any citizenship, sanctions, identity-verification, phone, payment-card, or billing-address restrictions where relevant. Do not bypass restrictions with VPNs or false information.
- Confirm data region, retention, export/deletion, backup, encryption, access control, and incident-response details before storing project or user data.

## Licensing

The upstream repository provides an MIT license. This applies to the repository's own content/code subject to the license terms; it does not grant rights to third-party services listed in the catalogue or override their individual terms.

## Security and cost rules for this project

- Prefer the existing Vercel and Supabase setup unless a specific technical or cost issue is demonstrated.
- Do not connect a new provider to production data during initial evaluation. Use synthetic data and an isolated test project.
- Never place Supabase service-role keys, OAuth secrets, passwords, wallet private keys, or recovery phrases in source files, public repositories, browser code, or agent prompts.
- Require explicit approval before enabling paid plans, adding a payment method, consuming paid credits, or creating billable resources.
- Check free-tier exhaustion behavior and billing safeguards before deployment. A nominally free service that can silently create charges is not acceptable by default.
- Do not treat signup availability as proof that the user's residence/citizenship combination is eligible.
- Human approval is required before production integration, data migration, or any external account action.

## Evaluation decision

**Keep as a research/reference catalogue. Do not add it as a runtime dependency and do not migrate existing infrastructure based on its listings.**

When a concrete need arises, shortlist one or more providers from the relevant category and independently verify:

1. Current official free-tier quota, duration, and overage behavior.
2. Credit-card/payment-method requirements and cost controls.
3. Armenia availability and applicable identity/country restrictions.
4. Data security, privacy, region, backup, and deletion controls.
5. Integration effort and compatibility with the existing Vercel/Supabase architecture.
6. Whether the provider solves a measured problem better than the current setup.

## Sources checked

- Upstream repository: https://github.com/255kb/stack-on-a-budget
- Contribution and service-selection guidance: https://github.com/255kb/stack-on-a-budget/blob/master/CONTRIBUTING.md
- Upstream license: https://github.com/255kb/stack-on-a-budget/blob/master/LICENSE.md

**Conclusion:** Useful for discovering possible free-tier infrastructure, but every provider must be re-verified from its own official sources. No service has been selected, connected, or adopted by this review.
