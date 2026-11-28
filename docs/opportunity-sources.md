# AI Creative Earnings — Opportunity Sources

Last reviewed: 2026-11-24
Status: source registry seed; live public discovery integrations currently include LaborX, Subnano, Superteam Earn, and Dealwork AI; individual platforms and live campaigns still require eligibility, payout, fee, KYC, and geographic verification before applying.

These sources are discovery targets, not guaranteed income. Prioritize work with a defined deliverable and explicit payout. Do not pay deposits, activation fees, or subscription fees to access a task. Never sign a wallet transaction or pay a network fee without the user's explicit review and approval.

## Creator campaigns, video, writing, and animation

| Platform / listing | URL | Focus |
|---|---|---|
| Superteam Earn — Raenest Global Bounty | https://superteam.fun/earn/listing/the-raenest-global-bounty-writing-video-and-animation | Writing, video, animation bounty |
| Superteam Earn — KriptoK Creator Challenge | https://superteam.fun/earn/listing/kriptok-creator-challenge-01 | Creator challenge |
| Superteam Earn — Bounties | https://superteam.fun/earn/bounties | Bounty discovery |
| Kyzzen — Bounties | https://www.kyzzen.io/bounties | Creator/Web3 bounties |
| Airaa — For Creators | https://airaa.xyz/for-creators | UGC, clipping, creator campaigns |
| ClipRush | https://www.cliprush.net | Short-form branded video |
| ClipFlip — Creator | https://www.clipflip.io/creator | Creator clipping/video |
| Drip Haus — Creators | https://drip.haus/creators | Creator monetization |
| Scribble Network — Creators | https://scribble.network/creators | Creator opportunities |
| Gimi — Creators | https://www.gimi.co/creators | Creator work |
| AI Film Contests | https://aifilmcontests.com | AI film contests and prizes |

## AI data contribution and microtasks

| Platform | URL | Focus |
|---|---|---|
| Loopuman — For Workers | https://loopuman.com/for-workers | Worker tasks |
| Microworker | https://microworker.app | Microtasks |
| AnoWorks | https://www.anoworks.app | Online work / tasks |
| Sapien | https://www.sapien.io | AI data contribution |
| PublicAI | https://publicai.io | AI data contribution |
| Humanbased — Contributors | https://humanbased.ai/contributors | Data contribution and review |

## Missions, communities, and campaign platforms

| Platform | URL | Focus |
|---|---|---|
| Genesis / Onfin | https://genesis.onfin.io/en | Campaign / rewards platform |
| Kolo Ambassadors | https://ambassadors.kolo.xyz | Ambassador campaigns |
| Zealy | https://zealy.io | Community quests |
| Layer3 | https://layer3.xyz | Web3 quests and campaigns |

## Freelance and crypto bounty marketplaces

| Platform | URL | Focus |
|---|---|---|
| CryptoTask | https://www.cryptotask.org | Freelance tasks, crypto payments |
| Dealwork AI | https://api.dealwork.ai/explore | Public freelance task board; escrow; USD wallet; USDC Polygon top-ups documented, but worker withdrawal method, KYC, and country eligibility remain unverified |
| LaborX | https://laborx.com | Web3 freelance and jobs |
| Dealwork AI | https://dealwork.ai | Human/AI task marketplace |
| Bountycaster | https://bountycaster.xyz | Onchain bounty discovery |

## Dealwork AI public feed integration (read-only)

The public GET https://api.dealwork.ai/api/v1/jobs endpoint is documented without authentication. The app reads public jobs only and keeps rows with posted or bidding status, public visibility, and worker eligibility of any or human_only. It filters for supported creative/research streams and excludes disallowed task patterns. A listing is not treated as escrow-funded unless the public record explicitly reports posterFunded: true; otherwise the UI warns that funding is unverified and work must not begin until escrow is visible in the contract. Country eligibility, Iranian passport acceptance, KYC, crypto withdrawal route, minimum withdrawal, and fees remain unverified and require human review. The integration performs GET requests only; it never registers, bids, claims, messages, or accepts contracts.

## Intake and ranking rules

For each discovered opportunity, record:
- Platform, campaign title, canonical URL, discovery date, and deadline.
- Status: open, closing soon, closed, or unverified.
- Deliverable type: image, video, animation, writing, data task, quest, or freelance service.
- Reward amount, currency, payout rail, payout threshold, and estimated time.
- Entry cost and any required purchase, deposit, subscription, or gas fee.
- KYC / identity requirements and country eligibility, including restrictions affecting Iranian nationals or residents of Armenia.
- Audience/follower requirements, portfolio requirements, and required social accounts.
- Whether AI-assisted production is allowed and any disclosure or originality rules.
- Submission steps, acceptance criteria, and evidence of successful payout.

## Automation priority

1. Paid creator briefs and fixed-price bounties with clear acceptance criteria.
2. AI image/video/writing jobs that can be completed with existing tools at no upfront cost.
3. Data-labeling and review tasks with a published per-task rate.
4. Crypto quests only when they require no deposit or paid transaction.
5. Contests and speculative reward programs last; never count prize pools as expected earnings.

Do not auto-apply, submit personal information, accept legal terms, connect wallets, or sign transactions without the user's explicit approval.

## Additional platforms to verify

These were added as candidate platforms from the earlier discussion. They are not yet confirmed as accessible or payout-eligible for the user's location or nationality.

| Platform | URL | Focus | Verification status |
|---|---|---|---|
| Clickworker | https://www.clickworker.com | Microtasks, text, research, and AI data tasks | Country availability, task access, KYC, and payout method to verify |
| Vocal Media | https://vocal.media | Writing and creator publishing challenges | Eligibility, contest terms, and payout method to verify |
| Prolific | https://www.prolific.com | Paid research studies and surveys | Participant country eligibility, waitlist, and payout method to verify |


## Additional creator, freelance, and Web3 task platforms — reviewed 2026-11-24

| Platform | URL | Primary use | Initial fit / priority |
|---|---|---|---|
| Gibwork | https://gib.work | Solana bounty marketplace: content, social promotion, video, design, research, testing, development | High: prioritize funded, nontechnical creative briefs; verify country eligibility and exact escrow before work. |
| Monero.jobs | https://monero.jobs | Freelance marketplace with direct XMR payments | High: inspect writing, translation, research, and creative tasks; no escrow means higher counterparty risk. |
| PeakD | https://peakd.com | Hive social publishing for articles, photos, and communities | Medium: possible long-term food/cooking content channel; rewards depend on community votes/tips, not guaranteed. |
| 3Speak | https://3speak.tv | Hive-based video publishing and viewer rewards | Medium: test only as a no-upfront-cost creator channel; video rewards and ad share are variable. |
| TaskOn | https://taskon.xyz | Web3 quests, campaigns, points, NFTs, and sponsor rewards | Low / side channel: prioritize only campaigns with explicit liquid payout; points/EXP are not cash income. |
| QuestN | https://questn.com | Web3 quest/campaign platform | Unverified: research snapshot failed DNS resolution; recheck site availability before any interaction. |
| Monero Bounties | https://bounties.monero.social | Community bounties, mainly Monero ecosystem development | Low: mostly technical; older notice says translation/research bounty intake was paused, so confirm a live eligible listing first. |

### Initial due-diligence notes
- **Gibwork:** Solana bounty marketplace. Example listings observed during review included USDC rewards for promotion, product demos, testing, and design; examples are not guaranteed available or accessible. Employer-funded escrow is described, but release depends on employer acceptance and the platform does not guarantee approval. Terms include geographic/sanctions restrictions; confirm eligibility for the user's nationality and current residence before signup. Check platform fees per task.
- **Monero.jobs:** Direct XMR payment between client and freelancer; the site advertises no KYC and no platform fee, but no escrow was identified. Treat client reliability and staged payment terms as essential. Listing counts are volatile and must be rechecked live.
- **PeakD:** Hive-based social publishing. Potential rewards include Hive community rewards and tips; earnings depend on audience/community response and are not guaranteed. A relevant content angle is Persian cooking and food photography/video.
- **3Speak:** Hive-based video platform. Its published creator information describes HIVE/HBD rewards, ad revenue sharing, and viewer/curation rewards; eligibility, current payout rules, thresholds, and actual earnings must be checked in-account. Do not treat viewer rewards as predictable income.
- **TaskOn:** Campaign rewards can be tokens, NFTs, points/EXP, whitelist access, or prizes. Some campaigns may be free, while claims/mints can require gas or purchases. KYC and country restrictions can be campaign-specific. Points and speculative airdrops are not confirmed income.
- **QuestN:** The review session could not resolve the domain and did not find reliable current official evidence. No wallet connection or registration until the service is independently reachable and verified.
- **Monero Bounties:** Community bounty board appears weighted toward software/development. A site notice indicated translation/research bounty intake had been paused since March 2024 and established-project bounty submissions require prior approval since March 2025; verify current rules and open listings.

These are research leads only. No account was created, no application submitted, no wallet connected, and no legal acceptance or transaction made. Check current country eligibility, sanctions terms, KYC, fees, escrow funding, AI-use rules, payout thresholds, and net reward before applying. Never pay to unlock a task or withdraw earnings.

## Paid media and content-consumption rewards — added 2026-11-28

A separate discovery stream now covers platforms that claim to reward genuine human activity such as viewing advertisements, watching short videos, or listening to music. This is distinct from paid creator work: the participant consumes content rather than producing a deliverable.

Search vocabulary:
- Paid-to-click (PTC), paid ad viewing, ad-viewing rewards.
- Watch videos for rewards, paid video tasks.
- Paid music listening, music listening rewards.

**Verification status: discovery category enabled; no platform or payout provider is approved by this entry.** Candidate services must be added only after current official terms and payout evidence are checked. For every candidate, record:
- Whether users in Armenia and Iranian nationals are accepted, separately.
- Passport/document KYC, liveness checks, and any additional identity/address requirements.
- Direct wallet payout availability, supported assets/networks, minimum withdrawal, fees, and payout proof.
- Whether rewards are cash/withdrawable crypto versus points, sweepstakes, gift cards, or locked tokens.
- Required watch/listen duration, reward rate, daily caps, and realistic effective earnings per hour.
- Deposits, subscriptions, purchases, withdrawal-release fees, and other entry costs. Any mandatory upfront payment is disqualifying.
- Whether the official terms permit browser automation. Never simulate views/listens, bypass timers, create multiple accounts, or fake engagement. Cloud execution may be considered only for explicitly permitted workflows and must not claim a human watched/listened when that did not happen.

Keep platforms with unclear KYC or country eligibility visible as **KYC / country eligibility unclear — human review required**. Do not mark any candidate eligible based on marketing claims alone.


## Social media and community task campaigns — added 2026-11-28

A separate discovery stream covers paid social/community actions and marketing bounties. Candidate task types include:
- Follow or subscribe to a brand account, join a Telegram channel or Discord server.
- Genuine comments, replies, shares, reposts, and participation in community discussions.
- Publish an approved campaign post, UGC clip, product review, or creator promotion.
- Brand ambassador programs, referral campaigns, community moderation, and marketing bounties.

**Verification status: discovery category enabled; individual campaigns and payout providers are not approved by this entry.** For each campaign verify:
- Official campaign URL, sponsor identity, campaign deadline, task steps, acceptance criteria, and evidence required.
- Whether it requires the user's personal social account, public profile, follower count, audience location, language, or content niche.
- Whether the requested action is permitted by the relevant social network's current rules and the campaign's terms. Exclude fake engagement, purchased followers, spam comments, coordinated inauthentic behavior, and account manipulation.
- Whether the reward is guaranteed per accepted task or merely a contest/prize/points allocation; record payout rail, minimum, fees, and actual payout evidence.
- Country eligibility and Iranian nationality acceptance separately, plus KYC, identity/address documents, and any age requirements.
- Any required purchase, deposit, subscription, paid verification, or gas fee. Mandatory upfront costs disqualify the opportunity.
- Whether AI-assisted content is permitted and whether advertising/sponsorship disclosure is required.

Do not auto-follow, auto-join, comment, repost, or publish from the user's accounts. The app may discover, classify, prepare a checklist, and queue opportunities. Any action on a personal account or submission of personal data requires explicit user approval. Keep unclear country/KYC cases visible for human review.
