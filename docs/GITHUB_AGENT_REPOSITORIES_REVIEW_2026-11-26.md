# GitHub Agent Repositories Review — 2026-11-26

Scope: evaluate the repositories supplied for the AI Creative Earnings project. This is a source triage, not approval to install every dependency or grant autonomous access.

## Highest-value sources for our current work

| Repository | What it provides | Project relevance | Decision |
|---|---|---|---|
| https://github.com/addyosmani/agent-skills | 26 production-oriented engineering skills and lifecycle commands for spec, plan, build, test, review, performance, accessibility and ship. MIT. | Directly useful as a development-process reference for our Next.js/Supabase app. | Adopt selected practices; do not add the whole repo as a runtime dependency. |
| https://github.com/obra/superpowers | Cross-agent software-development methodology with composable skills, specification, planning, TDD, subagent work and review. MIT. | Strong development workflow reference; supports Codex and Hermes among other harnesses. | Adopt selectively for implementation discipline; avoid overlapping skill stacks. |
| https://github.com/Shubhamsaboo/awesome-llm-apps | Curated collection of 100+ AI apps, agents, skills and RAG examples; Apache-2.0. | Useful source of reusable patterns for future content generation, product creation, research and automation features. Individual examples may still require paid model/API services. | Reference catalog; evaluate each subproject and its costs/license separately. |
| https://github.com/Agenta-AI/awesome-ai-agent-platforms | Curated comparison of agent platforms, frameworks, automation and browser agents, with license/hosting notes. | Useful discovery index when we need a specific capability rather than building it from scratch. | Reference catalog only. Verify each linked project's license, hosting and cost. |
| https://github.com/erson/awesome-agent-orchestrators | Metrics-backed index of 633 orchestration tools; README reports 449 active in the last 30 days using a 2026-11-15 snapshot. | Broad discovery map for future automation and agent operations. | Reference catalog; metrics are a dated snapshot, not a guarantee of quality. |
| https://github.com/andyrewlee/awesome-agent-orchestrators | Curated orchestrator list split into parallel coding agents, swarms, loop/task runners, personal assistants and infrastructure. | Useful to compare agent orchestration patterns. | Reference catalog; overlaps substantially with erson's index. |
| https://github.com/bradagi/awesome-cli-coding-agents | Curated list of 160+ CLI coding agents and harnesses; README says updated 2026-11-23. | Useful for choosing development agents and CLI harnesses. | Reference catalog; not an application dependency. |

## Conditional candidates

| Repository | What it does | Cost / risk notes | Decision |
|---|---|---|---|
| https://github.com/browser-use/browser-use | MIT Python browser agent that drives a real browser through CDP; supports local browser and local LLM, as well as paid hosted models/browser services. | Library is free; model inference and hosted browsers may cost money. Browser sessions can expose credentials and perform external actions. | Candidate for controlled browser QA and supervised public-opportunity research only. No unattended applications, account creation, purchases, follows, posts, or submissions. Use local browser/model where practical and pin tested versions. |
| https://github.com/NousResearch/hermes-agent | MIT self-improving agent with memory, skill creation, cron, subagents, messaging gateways and multiple terminal backends. | Agent code is free, but model inference and hosting may cost. Broad tool access needs sandboxing and strict spend limits. | Potential later task-worker/monitoring agent; not needed inside the current web app yet. |
| https://github.com/Untrivial-ai/agent-orchestrator | Go-based system for supervising coding-agent teams from planning to merge; organization page reports Apache-2.0 and last update 2026-10-02. | Requires a separate orchestration environment and agent/model runtimes; README could not be fetched through the connected GitHub file reader during this review. | Hold for a later development-scale test; no integration now. |
| https://github.com/paperclipai/paperclip | MIT self-hosted control plane for agent teams, goals, roles, budgets, approvals and work tracking. | Does not supply the underlying agents or free model inference. Extra infrastructure and operational complexity. | Already reviewed previously; useful only if we later operate several independent agents. Not a replacement for the app or its earning logic. |

## Defer / do not install now

| Repository | Reason |
|---|---|
| https://github.com/thedotmack/claude-mem | Apache-2.0 persistent coding-agent memory. Local storage is possible, but it records tool/session observations, has optional cloud sync and analytics, and the hosted observer/provider path can incur cost. Our current project does not need another memory layer. Reconsider only after a privacy and data-retention review. |

## Implementation priorities

1. Use selected engineering practices from addyosmani/agent-skills and obra/superpowers when changing the existing app: clarify scope, plan small changes, test, review, and verify deployment.
2. Use awesome-llm-apps as a source of patterns for sellable digital products and AI content workflows. Check every example's actual model/API costs before adoption.
3. Use browser-use only in a restricted, supervised prototype if browser QA or repeatable public-page research becomes a bottleneck.
4. Keep Paperclip, Hermes and Untrivial as optional orchestration candidates. Do not add several overlapping orchestrators to the current project.
5. Treat all awesome-lists as discovery indexes, not vetted endorsements. Recheck each candidate's current maintenance, license, dependencies, model costs and security before use.

## Non-negotiable project safeguards

- No subscriptions, deposits, paid API calls, hosted browser credits or VPS spend before real earnings and explicit approval.
- Prefer local/free tiers and daily free credits; clearly mark any unavoidable model or hosting cost.
- Never automate KYC, identity submission, wallet signatures, account creation, public posting, applications, purchases or other irreversible/external actions.
- Keep country eligibility, Iranian identity acceptance, Armenia residence, payout asset/network, minimum withdrawal and fees as separately verified fields. Unknown means review required, not assumed eligible.
- Do not bypass geographic, platform, sanctions or identity restrictions.
- Do not expose secrets, session cookies, wallet credentials or personal documents to third-party agent memory or browser tools.

## Review limitations

This is a README/metadata-level triage as of 2026-11-26, not a full security audit or installation test. In particular, the connected GitHub reader could not retrieve a README/LICENSE file from Untrivial-ai/agent-orchestrator; its organization page was used for the basic description, license and activity snapshot. The erson repository was confirmed through its public GitHub page rather than the connected file reader.
