# AI Crypto Security Hunter — Team Assignments

Status: assigned in repository documentation; agents are not yet running autonomously.

This assignment applies to the seven specialist roles in ../docs/ai-team/. The project scope includes wallet security and EVM smart-contract/DeFi security. Work begins with read-only research, architecture, tool evaluation, and local/testnet planning.

## Current assignments

| Role | Immediate responsibility | Required deliverable |
|---|---|---|
| manager | Coordinate the workstreams, set dependencies, keep wallet and contract tracks separate, and report blockers | Prioritized task board and weekly decision summary |
| opportunity-scout | Research official bounty programs, in-scope assets, exclusions, disclosure rules, public advisories, and relevant open-source tools | Source-linked bounty and vulnerability-intelligence register |
| eligibility-payout | Check Armenia residence and Iranian-document eligibility, KYC, sanctions terms, payout currency/network, minimums, and direct-wallet payout support | Program eligibility and payout matrix with uncertainty labels |
| creative-producer | Prepare a standard vulnerability-report template, threat-model diagrams, and clear technical documentation | Report template, evidence checklist, and architecture diagrams |
| client-acquisition | Find legitimate audit/review engagements and public bounty opportunities; draft, but do not send, service proposals | Verified opportunity shortlist and proposal drafts |
| auditor | Verify authorization and scope, assess false positives, review evidence quality, and check safety controls | Scope/authorization checklist and independent finding-review template |
| manager + auditor | Define approval gates and ensure least-privilege, isolated test environments | Safety-gate checklist before any active testing |

## First work packages

### WP-01 — Program and scope intelligence
Owner: opportunity-scout  
Support: eligibility-payout, auditor  
- Build a shortlist of official wallet, EVM, and DeFi bounty programs.
- Capture each program's exact in-scope and out-of-scope assets, test restrictions, disclosure channel, and reward terms.
- Do not probe or scan live targets during discovery.

### WP-02 — Eligibility and payout feasibility
Owner: eligibility-payout  
Support: opportunity-scout  
- Evaluate the user's actual residence/document situation against official program rules.
- Verify whether rewards can be paid directly to a self-custody wallet, with network, token, minimum, fees, and timing.
- Keep unclear programs in a review queue as "KYC / country eligibility unknown"; do not silently discard them.

### WP-03 — Toolchain and architecture review
Owner: manager  
Support: auditor, opportunity-scout  
- Compare Slither, Foundry, Echidna, Mythril, and Semgrep for license, platform requirements, maintenance, resource use, and safe local use.
- Recommend a minimal EVM-first toolchain that can run in a controlled environment.
- No tool installation or paid service activation until cost and execution environment are understood.

### WP-04 — Reporting and evidence standards
Owner: creative-producer  
Support: auditor  
- Create a report format with summary, severity rationale, affected component/version, authorized reproduction steps, impact, evidence, remediation, and references.
- Use synthetic accounts and local/testnet assets only in examples.

### WP-05 — Legitimate service opportunities
Owner: client-acquisition  
Support: eligibility-payout, auditor  
- Identify credible audit/review clients or public bounty programs with clear authorization.
- Prepare draft proposals only; do not contact clients or accept contracts without the user's approval.

## Mandatory safety gates

1. No testing without written authorization or an explicitly published bounty scope that covers the exact target and method.
2. No scanning, fuzzing, exploitation, or load testing against third-party live systems unless the program explicitly permits that exact activity.
3. Begin with source review, static analysis, local forks, local deployments, and testnets.
4. Never access real user funds, seed phrases, private keys, personal data, or production secrets.
5. Never drain funds, phish, deploy malware, bypass authentication, or make destructive state changes.
6. Any sensitive live test, transaction, wallet connection/signature, public disclosure, or final bounty submission requires explicit user approval.
7. Record evidence, timestamps, tool versions, scope source, and reproduction environment. Label unverified findings as hypotheses.
8. Do not put secrets, tokens, OTPs, private keys, or recovery phrases in the repository.

## Completion criteria for this assignment phase

- [ ] Official bounty/scope register created
- [ ] Eligibility and payout matrix completed
- [ ] Toolchain comparison completed
- [ ] Vulnerability report template and evidence checklist created
- [ ] Safety and authorization checklist reviewed
- [ ] Manager consolidates recommendations and proposes the next implementation milestone

These are work assignments recorded for the specialist roles. They do not mean that autonomous AI agents, scanners, or background jobs have already been activated.
