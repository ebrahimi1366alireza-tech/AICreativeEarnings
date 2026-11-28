# Social account connection architecture

## Scope

The Account Connections area covers Instagram, YouTube, Telegram, Discord, X, Facebook, TikTok, Pinterest, Reddit, Snapchat, LinkedIn, WhatsApp, Slack, Twitch, Threads, Mastodon, and Bluesky.

This is an optional, task-scoped capability. Discovering opportunities must not require connecting any personal account. A connection may be requested only when a selected task genuinely requires that service.

## Current implementation status

- The dashboard contains a 17-service catalogue and a local preparation-request queue.
- All providers are explicitly displayed as **not connected**.
- Queueing a provider is only a local planning signal. It does not authenticate, connect, request permissions, or perform an account action.
- No social OAuth provider, token storage, account action, or provider webhook is enabled by this catalogue.
- Do not describe any social account as connected until a real provider callback and server-side verification confirm it.

## Required implementation before enabling a provider

1. Verify the provider's current official developer documentation, allowed use cases, regional availability, account-type requirements, and API pricing.
2. Implement OAuth authorization-code flow with state and PKCE where supported. Use exact redirect URI allowlists and validate state on callback.
3. Request only the scopes required by the selected task. Show the provider, exact scopes, purpose, and limitations before redirecting.
4. Exchange and store tokens server-side only. Encrypt refresh/access tokens at rest using a server-only key; never return tokens to the browser, local storage, logs, or analytics.
5. Derive the user identity from the authenticated server session. Enforce ownership checks and CSRF protection on connect/disconnect actions.
6. Implement token refresh, expiry/error states, provider revocation, and deletion of stored tokens on disconnect.
7. Add an explicit approval step for each consequential action. Never auto-follow, auto-like, auto-join, auto-message, auto-comment, or publish without a separate user confirmation.
8. Add tests for OAuth state mismatch, invalid callback, scope mismatch, cross-user access, token secrecy, expiry, revocation, and disconnect.

## Provider-specific cautions

- Instagram and Facebook: Meta permissions, account type, app review, and supported endpoints constrain capabilities. Do not promise follow/like automation.
- YouTube: API capabilities and policies do not provide unrestricted subscription or engagement automation.
- Telegram: a bot connection is not a personal-account connection.
- Discord: bot installation is not the same as user OAuth.
- X: API access and pricing can restrict features. Never enable a paid tier without explicit budget approval.
- WhatsApp: Business Platform access is not access to a user's personal WhatsApp account.
- LinkedIn, TikTok, Snapchat, Pinterest, Twitch, Threads, Mastodon, Reddit, Slack, and Bluesky: verify official scope and policy support for each use case before implementation. Treat server-specific or account-type restrictions as first-class capability limits.

## Task-level authorization contract

A future opportunity or task may declare required providers and scopes. The app should compare these against verified server-side connections and show a connect request only when required. A missing connection must not block browsing or reviewing the opportunity. The user can decline, use a manual alternative where permitted, or skip the task.

No platform credential, password, recovery phrase, private key, or one-time login code may be requested or stored by this feature.
