# External AI Tool Repository Candidates

Reviewed on: 2026-11-26

This document records external GitHub repositories as candidate references for future evaluation. Recording a repository here does **not** mean it has been installed, integrated, deployed, or approved for production use.

## Candidate repositories

| Repository | Potential use | Initial priority | Important checks |
|---|---|---:|---|
| [OpenHiggsfield](https://github.com/wide-trace/open-higgsfield) | Unified image/video generation interface; architectural reference | Research only | No clear software license found in the initial review. Do not copy, redistribute, or integrate code until licensing and upstream rights are clarified. |
| [VoiceStudio](https://github.com/debpalash/VoiceStudio) | AI voice generation, voice conversion/cloning, dubbing and speech workflows | High | AGPL-3.0; separately verify licenses and commercial terms for each model, voice, and external service. |
| [OpenSEO](https://github.com/every-app/open-seo) | SEO research, keyword and competitor analysis, MCP/agent workflows | High | Verify current repository license and feature availability. Real data may require a paid DataForSEO API account. |
| [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) | Knowledge base, workspace, notes and task organization | Medium | AGPL-3.0; assess hosting, operational weight, and overlap with existing project tooling. |
| [OpenWhispr](https://github.com/OpenWhispr/openwhispr) | Local speech-to-text, transcription, dictation and translation workflows | High | MIT; verify model/runtime requirements, supported platforms, and privacy behavior. |
| [OpenProject](https://github.com/opf/openproject) | Project planning, task tracking, timelines and Gantt workflows | Low | GPL-3.0; likely operationally heavy unless advanced project management is needed. |
| [Cal.com](https://github.com/calcom/cal.com) | Scheduling and appointment booking | Low / investigate alternative | Initial review indicated the main repository's licensing/product model changed in 2026; evaluate Cal.diy separately and verify current license and feature differences before adoption. |
| [Chatwoot](https://github.com/chatwoot/chatwoot) | Omnichannel customer support inbox and customer messaging | Medium | MIT; verify channel integrations, hosting requirements, and messaging-provider costs. |
| [Cap](https://github.com/CapSoftware/Cap) | Screen recording, video editing and product/tutorial content | High | Mixed licensing was identified in the initial review (AGPL-3.0 for much of the project, MIT for some components); verify each component before reuse. |

## Suggested evaluation order

1. VoiceStudio
2. OpenWhispr
3. OpenSEO
4. Cap
5. Chatwoot
6. AppFlowy
7. OpenProject
8. Cal.diy (evaluate separately from Cal.com)
9. OpenHiggsfield (research only until licensing is clarified)

## Integration policy

Before adopting any candidate:
- Re-check the upstream repository, latest commit, maintenance status, dependencies, security posture, and exact license.
- Check commercial-use rights for models, datasets, fonts, media, and third-party APIs separately from the software license.
- Prefer local processing and free/open components where practical; identify unavoidable API, hosting, GPU, and usage costs.
- Test in an isolated branch or environment before integrating into a production workflow.
- Do not store API keys, credentials, personal data, or secrets in this document or in source control.

## Project-specific relevance

This is a shared reference list copied into this repository for discovery only. Each project should independently decide which tools are relevant; do not install every candidate merely because it appears in this list.

**Status:** Reference list only. No installation, deployment, or code integration has been performed.


## Additional engineering and agent infrastructure candidates — 2026-11-26

These four repositories were reviewed as cross-project engineering references. They are candidates only; none has been installed, executed, security-audited, or integrated.

| Repository | Potential use | Initial priority | Important checks / decision |
|---|---|---:|---|
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Coding-agent review/audit and simplification workflows; reduce over-engineering and potentially lower token and maintenance costs | High | MIT. Candidate for selective use with Codex/Claude Code-compatible workflows. Treat upstream efficiency claims as hypotheses until benchmarked on our own code. |
| [OmniRoute](https://github.com/diegosouzapw/OmniRoute) | Local multi-provider AI gateway; route requests across model providers, manage model choice and fallback, and provide a unified endpoint | Very high | MIT. The supplied repository may redirect to the current OmniRoute project under cheaper-inference. The gateway being free does not make inference free: verify provider pricing, free-tier quotas, country/KYC restrictions, API-key handling, privacy, and data routing before use. |
| [Graphify](https://github.com/Graphify-Labs/graphify) | Build queryable knowledge graphs from codebases, documentation, schemas, and configuration to help agents understand architecture and dependencies | High | Repository contains Apache-2.0 and MIT licensed components/files; inspect the exact component and license before reuse. Structural code parsing can be local; semantic document processing may require an LLM/API or local model. |
| [Agent Skills](https://github.com/addyosmani/agent-skills) | Engineering skills and workflows for requirements, planning, implementation, testing, security, review, performance, and release | Very high | MIT; 26 skills reported in the reviewed project. Adopt selected skills only. Avoid enabling overlapping instructions alongside Ponytail or other skill packs without checking for conflicts and token overhead. |

### Cross-project use notes

- **AI Creative Earnings:** All four are relevant as development and infrastructure candidates. OmniRoute is the strongest candidate for reducing model-provider lock-in and managing inference costs; Agent Skills and Ponytail can improve development discipline; Graphify can help navigate the growing codebase.
- **AIRDROP AI:** Keep this project independent. The same four tools may be evaluated as shared engineering references, but do not merge its code, configuration, data, or runtime with AI Creative Earnings.
- Follow the account-wide project order: finish AI Creative Earnings before starting or advancing AIRDROP AI, unless the user explicitly changes that order.
- Do not add all skill packs or agents at once. Select only the capabilities needed for a concrete task and test them in isolation.
- Before any provider integration, verify actual costs, free quotas, country eligibility, KYC, privacy, and whether user data or secrets are sent to third parties.
- No paid usage, subscription, hosted inference, or other charge without explicit user approval.

**Status:** Saved as reviewed candidates for future evaluation only. No software installation or integration is implied.


## Additional cross-project agent platform candidate — 2026-11-26

| Repository | Potential use | Initial priority | Important checks / decision |
|---|---|---:|---|
| [Freebuff](https://github.com/CodebuffAI/freebuff) | Multi-agent development and orchestration platform with Desktop, CLI, Web, Cloud (GitHub repository agents), and Chat modes. Potential shared engineering workspace for coding, research, app building, and parallel agent tasks. | High / trial candidate | Apache-2.0. README describes a limited free allowance (reported as 5 hours/day, with lower allowance under VPN/proxy) and access to different model providers; actual availability and quotas may vary by region, account, model capacity, and current terms. Some model/features may collect or process prompts, agent traces, project files, or other data for service operation, advertising, model improvement, or partner evaluation. Do not expose wallet private keys, seed phrases, API tokens, credentials, .env files, or sensitive/private repositories. Verify current privacy terms, data controls, region access, model pricing, and command/file permissions before testing. |

### Cross-project relevance and trial status

- **AI Creative Earnings:** High relevance for agent-assisted coding, research, parallel development, and GitHub workflows.
- **AIRDROP AI:** High relevance as a possible shared development/orchestration tool; keep project code, secrets, and runtime isolated.
- **Global Job Intelligence:** Medium–high relevance for building and testing job-search automation and research workflows.
- **Dropshipping:** Medium relevance for storefront tooling, product research, and marketing workflow development.
- **AI Crypto Security Hunter:** Medium relevance for code analysis and report-generation workflows; never provide wallet secrets or authorize uncontrolled execution against live systems.
- **Decision:** Worth a controlled trial, but not approved as production infrastructure. Start with a disposable test repository/workspace, least-privilege permissions, and non-sensitive sample data. Review every command and file change before accepting it.
- **License note:** Apache-2.0 applies to the Freebuff repository's software; it does not automatically grant commercial rights to third-party models, hosted services, generated media, or external dependencies.
- **Status:** Candidate reference saved only. No installation, account connection, deployment, security audit, or code integration has been performed.
