# Optional Free Tooling Reference

Saved from the Balancito guide updated 24 November 2026. This is a reference catalogue, not an instruction to install or enable every tool. Revisit it when a currently used paid tool reaches a free-tier limit or becomes unavailable.

## Candidate tools

| Tool | Purpose described in the source guide | Upstream repository |
|---|---|---|
| Free LLM API | Manage multiple model providers through one API and configure fallback models when a provider is limited or fails. Provider API keys are still required; advertised token totals are not one shared personal credit balance. | https://github.com/bahattab/free-llm-api |
| Ponytail | Claude Code plugin intended to simplify/refactor code and review recent changes or a project. | https://github.com/DietrichGebert/ponytail |
| Agent Reach | Agent-facing web and social research/read tools, including supported YouTube, website, Reddit and LinkedIn workflows. Some channels require account login and platform-specific setup. | https://github.com/Panniantong/Agent-Reach |
| NVIDIA SkillSpector | Scan skills for suspicious files and commands before installation. The guide documents a no-LLM scan mode. | https://github.com/NVIDIA/SkillSpector |

## Android / Termux notes from the guide

- The guide documents Termux setup for Free LLM API and notes Android 7+, about 1 GB free space, and Node.js 22.13+ for that method.
- Ponytail is used inside Claude Code after Claude Code is running.
- Agent Reach needs its documented dependencies and channel-specific browser/account setup.
- SkillSpector needs uv, Python and additional libraries; a Linux environment or server may be easier if Android package installation fails.
- The guide mentions a proot/Linux environment for Claude Code on Android, but does not provide a full step-by-step setup in this document.

## Adoption policy for this repository

1. Keep these tools optional. Prefer existing free tiers and the current free-first architecture before adding another dependency.
2. Before adoption, verify the upstream repository, license, maintenance/activity, current installation instructions, platform compatibility, security risks, and actual free-tier limits. The guide is a dated reference, not proof that a service is still free or safe.
3. Test in an isolated branch or disposable environment first. Review install scripts, package dependencies, plugins, skills and requested permissions before execution.
4. Never commit API keys, access tokens, cookies, passwords, wallet secrets, seed phrases or one-time codes. Use secure environment secrets where genuinely required.
5. Do not route private user/project data to a third-party model or agent without reviewing data handling and obtaining approval.
6. Do not introduce paid API usage, subscriptions, deposits, or other charges without explicit cost approval. Free LLM API still requires provider API keys and may use providers with quotas or paid tiers.
7. Add a tool to production only after a concrete need is identified, compatibility is tested, and its benefit outweighs maintenance and security costs.

## Suggested future use

- Free LLM API: evaluate as a fallback/model-routing option if the current coding or AI provider becomes quota-limited. It is not itself a source of free model credits.
- Ponytail: evaluate only if Claude Code is part of the active development workflow.
- Agent Reach: evaluate for authorized public-web research and discovery workflows; respect platform terms, privacy and login boundaries.
- SkillSpector: use as a pre-install security check for third-party skills where its runtime is available.

## Source

Balancito, “4 powerful tools for Claude Code”, guide updated 24 November 2026, supplied by the project owner (9-page PDF). See pages 2–9 for the tool summaries, install notes and troubleshooting.
