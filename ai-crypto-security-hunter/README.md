# AI Crypto Security Hunter

> Ethical crypto security research platform for authorized vulnerability discovery, validation, and responsible bug-bounty reporting.

## Project decision

The selected scope is **both**:
1. Cryptocurrency wallet security (software wallets, browser extensions, mobile apps, APIs, transaction/signing flows, and authorized hardware-wallet integrations).
2. Smart-contract and DeFi security (initially EVM-compatible networks, with other ecosystems considered after the first release).

This project is a separate module inside the AI Creative Earnings repository. Its development priority is **after the core AI Creative Earnings project is completed**.

## Product objective

Build a practical security-research assistant that helps identify genuine, in-scope vulnerabilities, validate them safely, and prepare high-quality reports for legitimate bounty programs. It is not an automated intrusion or wallet-draining tool.

## Proposed architecture

- **AI Orchestrator:** coordinates agents, jobs, evidence, and approval gates.
- **Wallet Security Engine:** analyzes public source code and authorized app/API test targets; reviews transaction construction, signing flows, permissions, session handling, dependencies, and security-sensitive UI behavior.
- **Smart Contract Engine:** analyzes Solidity/EVM contracts and protocol logic.
- **DeFi Security Engine:** reviews access control, accounting, lending, liquidity pools, staking, oracle assumptions, bridges, and upgradeability.
- **Static/Dynamic Analysis:** integrates established tools such as Slither, Mythril, Semgrep, Foundry, and Echidna where appropriate.
- **Vulnerability Intelligence:** correlates findings, ranks severity, checks evidence, and reduces false positives.
- **PoC Lab:** isolated, resource-limited environment for local/testnet reproduction and non-destructive proof-of-concept tests.
- **Bounty Intelligence:** collects program rules, scope, exclusions, reward terms, KYC, country eligibility, and payout requirements.
- **Eligibility Checker:** evaluates the user's actual residence/document profile against each program; unclear cases remain flagged for manual review rather than being silently discarded.
- **Report Generator:** creates evidence-based English reports with impact, reproduction steps, PoC, logs, and remediation suggestions.
- **Earnings Manager:** tracks drafts, submissions, triage, acceptance/rejection, and paid rewards.
- **Safety & Authorization Gateway:** enforces explicit scope, rate limits, safe test modes, human approval for sensitive live tests, and audit logs.

## Suggested technology

| Layer | Initial choice |
|---|---|
| Frontend | Next.js + TypeScript |
| API/backend | Python + FastAPI |
| Database/auth/storage | PostgreSQL / Supabase |
| Background jobs | Redis + Celery |
| EVM analysis | Slither, Mythril, Semgrep |
| Contract testing | Foundry, Echidna |
| Isolation | Docker with restricted network and resource limits |
| AI integration | Provider/model abstraction, optionally through an AI gateway |
| Reports | Markdown and PDF |

## Suggested repository layout

```text
ai-crypto-security-hunter/
├── README.md
├── frontend/
├── backend/
│   ├── api/
│   ├── orchestrator/
│   ├── agents/
│   └── database/
├── engines/
│   ├── wallet-security/
│   ├── smart-contract/
│   ├── defi-security/
│   ├── vulnerability-analysis/
│   └── bounty-intelligence/
├── scanners/
│   ├── static-analysis/
│   ├── dependency-check/
│   └── fuzz-testing/
├── sandbox/
├── poc-lab/
├── report-generator/
├── earnings-manager/
├── eligibility-checker/
├── safety-gateway/
└── tests/
```

## MVP roadmap

1. Project foundation: dashboard, data model, job orchestration, scope registry, and authorization controls.
2. EVM contract analysis: Solidity intake, Slither integration, Foundry-based local testing, and evidence capture.
3. Wallet analysis: public-source and explicitly authorized app/API analysis.
4. AI analysis: specialist agents, finding correlation, severity triage, and false-positive reduction.
5. Bounty workflow: program discovery, scope/KYC/country/payout eligibility checks, report generation, and reward tracking.
6. Security and release testing: sandbox hardening, regression tests, operational limits, and end-to-end validation.

**Initial implementation priority:** EVM smart-contract analysis, while keeping wallet security in the MVP scope. Expand to additional chains after the EVM workflow is reliable.

## Time estimates (planning estimates, not guarantees)

- Usable MVP: approximately **8–12 weeks**.
- Advanced version: approximately **4–6 months**.
- More comprehensive professional version: approximately **6–9 months**.

Actual duration depends on integration complexity, testing depth, and available development time. These estimates do not imply that the project has been implemented or that it will generate bounty income.

## Revenue model

Potential routes include legitimate bug-bounty rewards, authorized security audits, and later subscription access for development/security teams. Rewards are irregular and never guaranteed; program maximums are not typical earnings.

## Non-negotiable safety rules

- Test only assets and systems that are explicitly in scope and authorized, or local/testnet environments controlled by the researcher.
- Never steal funds, drain wallets, phish users, deploy malware, bypass authentication, or obtain seed phrases/private keys.
- Never collect real user secrets. Use synthetic test accounts and test assets.
- Do not perform destructive or high-impact tests on live systems.
- Verify program scope and rules before testing; require human approval for sensitive live actions.
- Submit only evidence-backed, non-duplicate findings through responsible disclosure channels.

## Current status

**Design recorded; implementation has not started.** This folder is a planning artifact. The project remains behind completion of the core AI Creative Earnings work.
