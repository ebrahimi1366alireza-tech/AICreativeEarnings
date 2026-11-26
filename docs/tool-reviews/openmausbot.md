# OpenMausBot review

**Reviewed:** 2026-11-26  
**Upstream:** https://github.com/milind-soni/OpenMausBot  
**Status:** Candidate for isolated evaluation; not adopted as a production dependency.

## Summary

OpenMausBot is an open-source, local-first desktop environment for coordinating multiple AI agents. It is relevant as a possible orchestration and computer-use layer, but it is not an earning platform and does not itself create verified income opportunities.

## Potential uses in AI Creative Earnings

- Coordinate research agents that discover and triage creative-work opportunities.
- Delegate platform eligibility, KYC, country restrictions, payout-network, fee, and minimum-withdrawal checks.
- Coordinate content-production and delivery workflows.
- Produce internal reports and hand off tasks between specialized agents.

Potential later uses in AIRDROP AI include campaign monitoring, task research, and reporting. Any wallet, account, claim, or financial action must remain subject to explicit human approval.

## Runtime and dependencies

- Desktop-oriented; supported environments noted in the upstream project include Windows, macOS, and Ubuntu 24.04.
- Building from source requires Node.js 24+ and pnpm.
- The workflow depends on supported agent CLIs (for example Claude Code, Codex, or Grok CLI) being installed and authenticated.
- Model/agent usage may consume provider subscriptions or paid usage. Do not assume that the application makes model inference free.
- This is not a native Android runtime and cannot be run directly as the main application on the user's current Android phone.

Check the upstream README and release notes before installation because requirements can change.

## Licensing

The main project is described as Apache-2.0, while the `enterprise/` area has separate licensing terms. Review the exact license files for the components intended for use before redistribution or production deployment.

## Security and deployment cautions

- Agents may execute with the permissions of the user or execution environment. Use least privilege and isolated test accounts.
- Do not provide production credentials, wallet secrets, seed phrases, private keys, or unrestricted access to personal accounts during evaluation.
- Review how each engine stores credentials and configuration; do not assume secrets are encrypted at rest.
- Avoid Full Access modes unless the environment is disposable and isolated.
- Review the upstream SECURITY.md and current issues before each deployment. The project has documented security considerations involving shared workspaces and Slack permissions; verify the current advisory/status and affected versions rather than assuming a fix.
- Keep human approval for account verification, external submissions, contracts, purchases, withdrawals, and all financial actions.

## Integration decision

Do not replace the existing AI Creative Earnings architecture or introduce OpenMausBot as a production dependency at this stage. First complete the current application, then run a separate proof of concept in an isolated desktop environment. Evaluate:

1. Installation and startup reliability.
2. Agent isolation and permission boundaries.
3. Credential storage and secret redaction.
4. Task orchestration, retries, audit logs, and failure recovery.
5. Actual provider costs and free-tier limits.
6. Whether it can integrate cleanly without weakening the existing Supabase authentication, row-level security, or human-approval rules.

**Decision:** Keep as a reviewed candidate/reference for a later orchestration experiment, not an adopted component.
