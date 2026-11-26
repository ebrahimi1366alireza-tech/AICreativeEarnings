# External AI Tool Repository Candidates

Reviewed on: 2026-11-26

This document records nine external GitHub repositories as candidate references for future evaluation. Recording a repository here does **not** mean it has been installed, integrated, deployed, or approved for production use.

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
