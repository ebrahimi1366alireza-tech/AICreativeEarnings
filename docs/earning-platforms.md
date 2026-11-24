# AI Creative Earnings: earning platform research

Last consolidated: 2026-11-24  
Purpose: keep a durable shortlist of marketplaces and payout routes for paid AI-assisted digital work. This is a research log, not a claim that accounts have been created or earnings are guaranteed.

## Selection rules
- Prefer zero-cost entry: no subscription, deposit, stake, bond, or mandatory paid credits.
- Prefer crypto payouts, especially USDT/USDC, with a clear minimum withdrawal and network fee.
- Check separately: account signup requirements, payout/KYC requirements, country restrictions, AI-use rules, escrow/funding, fees, and live paid-task availability.
- Never start work on an unfunded task where payment is not protected.
- Do not use paid-entry competitions, refundable bonds, staking, or any other deposit without explicit user approval.
- Human-only tasks (personal surveys, real-world tests, voice/camera recordings, identity-bound assessments) are not work the assistant can complete on the user's behalf.
- Never request or enter wallet seed phrases/private keys. Any wallet signature, legal acceptance, payment, or transaction requires explicit user approval.
- Recheck live task availability and current terms before applying; the status below reflects research captured by 2026-11-24 and can change.

## Priority shortlist

| Priority | Platform | Link | Payout / network | Fees and entry | Identity / withdrawal notes | Risk / current decision |
|---|---|---|---|---|---|---|
| 1 | Taskmarket | https://taskmarket.dev/ ; tasks: https://taskmarket.dev/tasks | USDC on Base; OUSD on Tempo | Docs reported 0% platform fee; first 5 submissions per task free, later some submissions may cost 0.001 token. Standard preset generally no stake; Fast preset has 10% stake. | Agent setup via wallet/cryptographic signature. No general passport/ID requirement found in worker docs. Some tasks require ERC-8004 identity or Visa TAP. First marketplace write may require wallet-signing acceptance of four legal documents. | Best first candidate. Only free/no-stake tasks; reject Visa TAP or other inaccessible prerequisites. Do not sign legal terms or connect a real wallet without explicit approval. Testnet setup is the preferred first technical step. |
| 2 | MoltJobs | https://moltjobs.io/ ; open jobs: https://moltjobs.io/open-jobs ; skill: https://moltjobs.io/skill.md | USDC on Base | 5% fee; 10 free bid credits/month. | One-time owner email claim; withdrawals require email confirmation and a key with `wallet:withdraw`. Some tasks require a verified Google account. Whether withdrawal triggers identity KYC was not established. | Promising for AI agent work, but only apply after confirming the task is funded in escrow. Research snapshot found multiple open jobs, but several had no escrow deposit recorded. |
| 3 | Getly | https://www.getly.store/ | USDT / USDC | Seller receives reported 80–90%; minimum withdrawal $5; reported network fee $0.10. | Privacy policy says routine identity documents are not collected, but Terms allow requests for documents/tax information and payment processors may perform checks. | Suitable for listing AI images, templates, files, and other digital products. No guaranteed sales; payout KYC is not guaranteed to be absent. |
| 4 | Gibwork | https://gib.work/ | Solana-based bounty marketplace; confirm payout details per task | Fee and complete payout conditions not fully confirmed in this research pass. | Some tasks may require phone or X account verification. | Conditional candidate for design, content, social, research, and development bounties. Verify each task and withdrawal requirements first. |
| 5 | BasedAgents | https://basedagents.ai/ ; tasks: https://basedagents.ai/tasks | USDC on Base | No platform fee reported. Paid bounty claim requires a 1 USDC refundable bond; free tasks provide reputation only. | Agent identity uses Ed25519 keypair plus proof-of-work rather than passport, per docs reviewed. | Do not pay the bond. Consider only genuinely free tasks; paid tasks are excluded unless user explicitly approves the bond and its risks. |
| 6 | Monero.Jobs | https://monero.jobs/paid-in-xmr | XMR, peer-to-peer | No marketplace escrow identified. | Site advertises no ID/selfie/bank account for listings; verify employer/payment conditions independently. | Job board rather than guaranteed task marketplace. No escrow means non-payment risk; use written scope and staged payment. |
| 7 | XMRBazaar | https://xmrbazaar.com/ | Monero (XMR) | Peer-to-peer marketplace; escrow described as 2-of-3 multisig with moderator. | KYC and payout details must be rechecked against current terms. | Potentially safer than direct P2P because of escrow, but beta/low demand and no guaranteed refund. |
| 8 | make.fun | https://make.fun/ ; payouts: https://make.fun/payouts | USDC on Solana | Free and paid-entry competitions both exist. Payout page snapshot reported 78 open competitions and about $21,434 paid across 1,462 accounts; median payout around $3. | Some competitions may require X account or other prerequisites. | Try only free-entry competitions with accessible requirements. Never pay entry fees without explicit approval. Figures are a dated snapshot, not live guarantees. |
| 9 | AgentHansa | https://www.agenthansa.com/ | Payout method not confirmed | Fees/entry conditions not confirmed. | KYC and withdrawal rules not confirmed. | Site snapshot showed 227 missions and about $50,671 claimed earnings, including a video-from-photo example. Treat all payout claims as unverified until task and withdrawal details are checked. |
| 10 | Frantic | https://gofrantic.com/ | USDC on Base | Payment ledger showed about $2,500 settled; current task supply was very limited in the snapshot. | One open task observed required verified identity/contact. | Low priority; do not spend time unless an accessible task appears. |
| 11 | t2000 | https://t2000.ai/jobs | USDC; escrow advertised | About 5% fee reported. | KYC/withdrawal details not confirmed. | No open jobs were visible in the research snapshot. Recheck later. |
| 12 | Agentizable | https://agentizable.ai/ | USDC; escrow advertised | Exact fee not confirmed. | Signup and payout verification not confirmed. | Claim/task availability issues observed; do not prioritize until a real payable task can be claimed. |

## Other platforms reviewed and not prioritized
- Clustly (https://clustly.ai/): privacy policy says no identity-document collection, but seller fee reported 4%, possible account/reputation setup charges, and custodial agent wallet. Security review/contract and admin-key concerns were identified; do not use as a primary payout route. Only consider a tiny test after independent re-verification.
- TaskForce (https://www.task-force.app/): USDC on Solana/Base and milestone escrow are advertised, but live paid demand and completed payouts were not confirmed.
- The Colony: agent task network; payment appears Lightning-based and no escrow was established. Low priority.
- Riner: escrow and 7% fee were reported, but current paid task demand was not sufficiently verified.
- OpenJobs (https://openjobs.global/): USDC on Arbitrum and escrow advertised; fee and withdrawal KYC remain unknown.
- Microworker.app (https://microworker.app/): advertises USDT/USDC and $5 minimum withdrawal, but terms allow verification at payout and AI-use rules are unclear.
- CryptoTask: terms prohibit automated means such as bots/scrapers without written permission; unsuitable for autonomous agent execution.
- LaborX, Superteam Earn, TryBounty, Upwork, Fiverr, CrowdGen/Appen, Microworkers.com, Prolific, Freecash, Toloka, Mindrift, Ruul, Gumroad, Ko-fi, Shutterstock, BeatStars, and several survey/microtask platforms were not prioritized due to KYC, payment rail, country, automation, tax, or other eligibility constraints found in the earlier review. Recheck only if requirements materially change.

## Next actions
1. Re-open Taskmarket worker/agent documentation and inspect current paid tasks.
2. Filter tasks for: no stake/bond, no paid credits, no Visa TAP/identity gate, AI-compatible deliverable, clear acceptance criteria, and funded escrow or reliable payment protection.
3. Prepare the agent workflow and test it on Base Sepolia before any real-wallet connection or legal signature.
4. Review MoltJobs only for tasks with escrow deposit confirmed.
5. Keep Getly as a separate digital-product sales channel; prepare sample products only after validating payout eligibility.
6. Update the status file whenever an account is claimed, a task is applied for, or a payout condition is verified.

## Research provenance
This document consolidates findings from prior research in this ChatGPT project through 2026-11-24. Some figures and task counts are snapshots. Revisit official pages and terms before acting. A platform's claim that it does not collect ID at signup does not prove that withdrawals are KYC-free or that the service accepts every country.
