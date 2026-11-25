# AI Creative Earnings: earning platform research

Last consolidated: 2026-11-24  
Purpose: keep a durable shortlist of marketplaces and payout routes for paid AI-assisted digital work. This is a research log, not a claim that accounts have been created or earnings are guaranteed.

## Selection rules
- Prefer zero-cost entry: no subscription, deposit, stake, bond, or mandatory paid credits.
- Human-presence verification, selfie, face match, and liveness/video checks are acceptable to the user; do not reject a platform for these alone. Check separately whether it also requires government ID/passport, proof of address, tax documents, or a paid verification fee. Never submit identity documents or biometric data without the user's explicit approval.
- Accept any cryptocurrency or token paid to the user's own wallet; no asset has priority. Verify the exact supported token/network, fees, minimum withdrawal, and country restrictions.
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


## New research pass — 2026-11-24

### Newly discovered candidates

| Candidate | Link | Current evidence | Requirements / costs | Decision |
|---|---|---|---|---|
| OpenJobs | https://openjobs.bot/ ; jobs: https://openjobs.bot/jobs ; skill: https://openjobs.bot/skill.md | Official site snapshot: 11 open jobs, 188 agent profiles; jobs page showed 11 open software-maintenance issues, each rewarding 50 WAGE. Homepage reported 155 completed jobs and 14,986 total volume, but these are platform counters, not independently audited payout totals. | Solana keypair, one signed onboarding request, owner email magic-link confirmation. Official skill says paid jobs may pay WAGE or USDC and rewards are escrowed at posting. No signup fee listed. All currently visible jobs were coding/maintenance tasks and denominated in WAGE, not USDC. | Conditional / low priority for this project. Could fit coding-agent work, but not image/video production; token liquidity/value and withdrawal requirements need verification. Never generate or expose a wallet private key without a separate secure, user-approved setup. |
| First Dollar | https://app.firstdollar.money/bounties ; terms: https://app.firstdollar.money/terms | Public campaign directory shows many completed campaigns, including UGC video, creator content, design and development; USDC on Base is a common payout rail. | Applying creates an embedded wallet via Privy. Terms explicitly allow identity verification (legal name, DOB, address, government ID) where required by law/payment partners; sanctions screening applies. Sponsors' terms govern unless platform administers payout. | Conditional. Relevant creative campaign marketplace, but payout KYC and country eligibility are not guaranteed. Do not spend time creating content until a currently live campaign, its funded budget, eligibility and payout checks are confirmed. |
| Higgsfield Talent Contest | https://higgsfield.ai/contests/talent-contest?tab=rules | Official rules effective Nov 12, 2026: $1,000,000 cash pool across 20 awards; free entry; deadline Nov 26, 2026 at 19:00 UTC. | 3–7 minute original film. All AI video/image generation must happen inside Higgsfield contest project; external AI assets require a qualifying Higgsfield edit. Submitted projects become public, including prompts and generation history. Winners undergo identity, residence, sanctions and tax verification; payment in USD by bank transfer or another supported method. Sanctioned persons and residents of embargoed territories cannot participate/receive prizes. | Conditional creative contest, not steady paid work. Potentially relevant, but do not invest effort until the user's legal eligibility and supported payout method are confirmed. No paid subscription required. |
| ContentRewards creator campaign (make.fun) | https://contentrewards.com/c/campaigns/6441e520-ad18-4f7f-83bf-01139f38c63a | Campaign page showed $2 per 1,000 verified views on TikTok, Instagram, YouTube and X; $1 minimum and $100 maximum payout per platform; $504 of $2,000 budget used and 16 creators listed at scrape time. | Requires original 20–45 second promotional clip and public posting; brief asks for human voice or face, captions, clear make.fun logo and CTA. Detailed creator requirements and payout/KYC terms are hidden until joining. | Experimental only. Requires user's own public social account and active posting; payment rail, KYC and country eligibility are not yet known. Do not promise earnings. |
| Video Marketplace | https://dev.vidodata.com/ | Free-to-join creator portal for short video recording tasks; accepted submissions are said to pay to a wallet. | Work requires the user to record real video on their phone/laptop; no task rates, payout token/network, KYC or country coverage were publicly disclosed. | Not suitable for assistant-only production. Keep only as a human-recording side option if user wants to do the physical recording. |

### New platform/task checks and exclusions

- **make.fun (https://make.fun/):** official payout ledger snapshot on 2026-11-24 reported $21,491.20 USDC total paid, 1,476 accounts paid, median payout $3, and $15,601.97 USDC in escrow across 184 bounties that day. This is meaningful payment evidence, but make.fun itself states a bounty is a contest, not wages, and most entrants win nothing. Its current creative/video bounty “Bring the humans” showed a $500 funded USDC escrow split across 20 winners ($14–$100 each), but required a public TikTok account, Node.js 22.18+, a public GitHub repo with a Node program, AI-agent transcripts and view-based ranking; 1,585 agents were listed. It is not a simple paid video commission and is highly competitive. Continue checking for low-entry image/video tasks with low entrant counts and funded escrow.
- **BountyBook (https://api.bountybook.ai):** do not prioritize. Independent recent checks reported the public domain parked/down, many open jobs unfunded, and failed payout attempts; one older payout record is not enough to make it safe.
- **AgentBounties / Agentizable:** do not prioritize until claimable work is actually available. Recent check showed 0 claimable tasks despite funded-looking issues; prior snapshots also showed claim fees/bonds or verification blockers.
- **Claw Earn:** exclude from zero-capital path. Its published flow requires worker stake/collateral and the human-flow minimum task is 9 USDC; recent snapshots showed no open tasks.
- **dealwork.ai:** do not prioritize until a task's escrow is verifiably funded. Independent audit snapshots found many open jobs but zero funded.
- **MusedIn:** not prioritized because available audit reports describe jobs as not escrowed and payout dependent on poster after completion.
- **AgentPact:** do not confuse the older Base-USDC gig marketplace with the newer agentpact.io product. Recent payout checks did not find reliable current settlement evidence for the older marketplace.
- **Artisan (https://artisan.ac/):** paid jobs are funded in USDG on Robinhood Chain and 95% goes to the agent, but agents must run on Orbio and pay inference costs in Orbio CREDIT. Not a zero-cost starting route; do not prioritize unless a genuinely free inference allowance is verified.

### Practical next ranking
1. Taskmarket — inspect current no-stake, funded USDC jobs first.
2. MoltJobs — only if the specific task has a funded escrow; current public board snapshot showed 7 independent customer-posted jobs, but inspected $80 and $5 research jobs had no deposit recorded and required a verified Google account.
3. Getly — digital-product sales route, after payout eligibility review.
4. make.fun — selective free-entry creative/image contests only; assess entrant count, funded escrow and prize odds per bounty.
5. First Dollar — only after confirming live campaigns and whether payout verification is possible.
6. Higgsfield — free contest opportunity only if sanctions/KYC/payment eligibility is confirmed.
7. OpenJobs — low priority because currently visible tasks are software issues paid in WAGE, not creative jobs.
8. ContentRewards — experimental; social posting and payout conditions still need confirmation.



## Candidate review — 2026-11-24 (seven URLs supplied by user)

| Platform | Link | Current findings | Decision for this project |
|---|---|---|---|
| Microworker.app | https://microworker.app/ | Worker fee 0%; USDT/USDC payouts on BNB Smart Chain, USDT also on Arbitrum/Polygon; $5 cash-out minimum; earnings become withdrawable after 3 days. Official payout page showed 34 cash-outs totaling $176.93 and 3,204 workers paid for tasks (platform-reported figures, with transaction links). Important: official Terms explicitly exclude people using the service from Iran, and accounts used there remain blocked pending review even if later accessed elsewhere. Terms also contain a daily inactivity balance transfer rule after notice. | **Exclude for Iran-based use.** Even though payout evidence exists, the explicit Iran exclusion makes it unsuitable. Do not attempt location circumvention. |
| Anoworks | https://www.anoworks.app/ | Pays workers in TRX to a TRON wallet; minimum withdrawal 5 TRX; homepage shows public Tronscan payout transaction links. Terms (updated 2026-11-24) state 10% platform fee is included in each job. Privacy policy requires email, first/last name, country, username and wallet address; no public statement found proving government-ID-free withdrawals or country-wide eligibility. Public jobs page redirects to worker sign-in, so live task volume could not be inspected without account access. | **Conditional test candidate, lower priority.** Social tasks, app reviews, influencer campaigns and surveys are mostly human/social-account work, not assistant-only AI creative commissions. Check country and payout verification before doing tasks; never use fake engagement or false reviews. |
| CryptoTask | https://www.cryptotask.org/ | Current task board showed recent projects, including $50 recruitment research, $200 website work and a $7,000/month community manager listing. Platform markets decentralized crypto escrow and has design/creative, writing, translation, marketing and software categories. Earlier Terms review identified a restriction on bots/scrapers/automated means without written permission; AI-assisted execution therefore needs written approval from the client/platform. | **Low priority / manual-only unless permission is explicit.** Potential higher-value projects exist, but many are specialist/long-term. Do not automate account activity or task execution against the Terms. Confirm escrow is funded before work. |
| LaborX | https://laborx.com/ | Web3 freelance marketplace. The live jobs page was largely empty in the current scrape, though a few recent full-time vacancies appeared. Previous review identified KYC/verification and payout limitations that make it a poor fit for the zero-KYC crypto-only requirement. | **Do not prioritize.** Keep only for a specific suitable gig if current verification, payout and country rules are acceptable. |
| HireForHumans | https://hireforhumans.com/ | Platform claims free worker signup, no KYC, no geographic restriction, USDC on Polygon, and on-chain escrow before work starts. Published worker guide lists content/translation, photography, research, testing and physical tasks. Terms/how-it-works describe 2.5% platform fee on completed jobs (97.5% to worker); dispute requires a bond. Publicly accessible worker page explains applying, but no verified current open-job inventory or independently verified payout history was established in this pass. | **Best fit among these seven to investigate next**, especially funded research/content/visual tasks. Before spending time, inspect actual open jobs, confirm escrow amount and contract address, and avoid any dispute bond. Claims about no KYC/country access are platform claims, not independently guaranteed. |
| Stacker News | https://stacker.news/ | Bitcoin community/forum, not a conventional job marketplace. Users may earn sats from community zaps/rewards for useful posts and comments, but income is voluntary, variable and not guaranteed. Wallet/Lightning support is part of the product; some interactions/territories and boosts can involve costs. | **Side experiment only, not dependable earnings.** Could publish original useful posts about AI creative workflows, but don't buy boosts or pay to create a territory. Do not count sats as predictable job income. |
| Microlancer.io | https://microlancer.io/ | Bitcoin/Lightning microtask marketplace. Current board snapshot showed 9,252 total tasks and 25 matching visible items; many visible rewards were only 10–100 sats (roughly $0.01–$0.06), with some older/low-value listings. FAQ says make an offer, wait for acceptance, and only start once escrow is funded; non-escrow P2P tasks also exist. Disputes are decided by platform support. Exact withdrawal minimum/fee should be checked in the live account FAQ before relying on it. | **Low priority / optional small test.** Use only accepted offers with standard escrow and worthwhile rewards. Most visible tasks are too low-paying for meaningful income; avoid non-escrow tasks and never pay to boost a listing. |

### Updated recommendation from this pass
1. HireForHumans — inspect live jobs and funded Polygon escrow first; no work until a specific job is visible and funded.
2. Anoworks — only if country/payout checks pass and a suitable paid task exists; 10% fee and TRX-only payout reduce attractiveness.
3. CryptoTask — only manual or explicitly AI-approved tasks with funded escrow; no bots/scrapers without written permission.
4. Microlancer — optional microtask channel, but visible rewards are generally tiny; escrow only.
5. Stacker News — optional community sats, not employment income.
6. LaborX — deprioritized due KYC/payout constraints and weak current job supply.
7. Microworker.app — excluded for Iran-based use by its own Terms.

No account was created, no application was submitted, no wallet was connected, no legal terms were accepted, and no transaction was made during this research pass.

## بررسی چهار پلتفرم ارسالی کاربر — ۲۴ نوامبر ۲۰۲۶

### Superteam Earn — https://superteam.fun/earn/bounties
- بازار bountyهای Web3/Solana؛ دسته‌های Content و Design ویدئو، مقاله، انیمیشن و پست اجتماعی دارد.
- Raenest Global Bounty: https://superteam.fun/earn/listing/the-raenest-global-bounty-writing-video-and-animation
  - جایزه کل 13,000 USDC؛ پنج جایزه اصلی مجموعاً 6,400 USDC و 20 جایزه قرعه‌کشی هرکدام 330 USDC.
  - مهلت ارسال 13 دسامبر 2026؛ اعلام برندگان تا 21 دسامبر 2026.
  - فقط یک track از Writing / Video / Animation. ویدئو و انیمیشن باید در X, TikTok, Instagram و YouTube منتشر شوند. نیازمند ساخت حساب Raenest با referral code community، استفاده واقعی از یکی از قابلیت‌های Raenest، شاهد استفاده و لینک referral شخصی است. نیمی از ارزیابی به جذب و فعال‌سازی referral وابسته است.
  - محدودیت مهم: با اینکه bounty «Global» است، شرایط رسمی Raenest Personal Account فعلاً فقط legal residents کشورهای US, Nigeria, Kenya, Ghana, Uganda, South Africa, Egypt و UK را eligible اعلام می‌کند. کاربر فعلاً در ارمنستان است و پاسپورت ایرانی دارد؛ ارمنستان در فهرست نیست و Raenest card prohibited list نیز ایران را برای cardholders منع می‌کند. تا وقتی Raenest کتبی تأیید نکند وضعیت کاربر واجد شرایط است، برای این bounty ثبت‌نام/تولید محتوا را شروع نکنیم.
  - Raenest KYC هویت و مدرک دولتی می‌خواهد؛ face/liveness به‌تنهایی مسئله نیست، اما eligibility و پذیرش مدرک/اقامت مهم است.
- اولویت: بازار bounty مناسب، اما این bounty خاص فعلاً مشروط/احتمالاً غیرقابل‌استفاده به علت شرط حساب Raenest.

### Scribble — https://scribble.network/creators
- کمپین‌های محتوای Web3/Tech: X thread، YouTube، Instagram، Reddit، Medium/Substack، meme و short video.
- ادعای پلتفرم: بیش از 500,000 دلار پاداش، بیش از 800 کمپین و پرداخت پس از انتخاب برند؛ معمولاً ظرف 7 روز پس از پایان review؛ بدون حداقل follower و بدون exclusivity.
- صفحه live bounty هنگام بررسی عدد 0 Live و 129 total نشان داد؛ موارد فهرست‌شده منقضی بودند. فعلاً درآمد فعال برای شروع ندارد.
- payout rail، KYC و امکان دریافت در ارمنستان/با پاسپورت ایرانی از صفحات عمومی تأیید نشد.
- اولویت: watchlist؛ تا ظاهرشدن bounty فعال و روشن‌شدن payout/KYC ثبت‌نام را جلو نبریم.

### GIMI — https://www.gimi.co/creators
- پلتفرم creator campaign با محتوای AI-generated، animation، cinematic AI، meme، clipping، walkthrough و face UGC؛ AI content ممکن است، اما هر campaign brief حاکم است.
- ثبت‌نام و ارسال اولیه رایگان؛ برای ارسال بیش از یک بار به همان campaign یا boost ممکن است هزینه بگیرد.
- پرداخت پس از تأیید برند، بر اساس approval / milestone / CPM / leaderboard؛ روش‌های payout شامل bank transfer، PayPal و USDC از طریق payment partners. حداقل برداشت فعلی 10 دلار و fee برداشت 5%.
- Terms می‌گوید ممکن است payment partner برای پرداخت، tax ID یا مدارک هویتی بخواهد. برای کمپین‌های approved، مالکیت محتوای تأییدشده به برند منتقل می‌شود؛ قبل از ارسال باید brief و حقوق استفاده/انحصار بررسی شود.
- نمونه داشبورد و creator stats در سایت نمایش داده شده، اما اینها به‌تنهایی اثبات برداشت واقعی کاربر نیستند. کشور/مدارک لازم برای پرداخت به ارمنستان هنوز تأیید نشده.
- اولویت: ارزش بررسی و تست ثبت‌نام رایگان؛ قبل از تولید محتوا، کمپین فعال، payout method در دسترس و حقوق مالکیت را بررسی کن. هیچ boost یا پرداختی انجام نشود.

### معیار به‌روزشده احراز هویت
- احراز انسان بودن، selfie، face match و liveness/video check برای کاربر قابل قبول است و به‌تنهایی دلیل حذف پلتفرم نیست.
- KYC با پاسپورت/مدرک دولتی، proof of address، tax ID و محدودیت کشور به‌صورت جداگانه بررسی شود. هیچ مدرک یا داده بیومتریک بدون تأیید صریح کاربر ارسال نشود.


## پنج منبع جدید ارسالی کاربر — بررسی اولیه 2026-11-24

| منبع | لینک | یافته‌های اولیه | تصمیم |
|---|---|---|---|
| Superteam Earn — KriptoK Creator Challenge | https://superteam.fun/earn/listing/kriptok-creator-challenge-01 | چالش تولید محتوای اصلی درباره KriptoK؛ مجموع جوایز 200 USDC (رتبه‌های اول تا پنجم: 50، 35، 25، 20 و 20 USDC و جوایز دیگر). صفحه در زمان بررسی Submissions Open و Global نشان می‌داد؛ اعلام برندگان 9 دسامبر 2026. محتوا می‌تواند پست، thread، ویدئو یا walkthrough باشد. رقابت بالا (335 submission در snapshot). | اولویت بالا برای بررسی نهایی deadline و شرایط دقیق؛ جایزه تضمینی نیست. فقط ورود رایگان و بدون اتصال/امضای کیف پول تا زمان نیاز. |
| Kyzzen | https://www.kyzzen.io/bounties | فهرست تجمیعی bountyها؛ snapshot شامل جوایز محتوایی 250–500 USDC و بعضی جوایز توکنی بود. بعضی deadlineها 22–24 نوامبر 2026 بودند و ممکن است منقضی شده باشند؛ تعداد شرکت‌کنندگان در برخی موارد زیاد است. | اولویت بالا به‌عنوان منبع کشف؛ هر bounty باید جداگانه باز و deadline، eligibility، deliverable، payout و رقابت آن تأیید شود. |
| Dealwork.ai | https://dealwork.ai/explore | بازار سفارش انسان/AI؛ سایت ادعا می‌کند escrow و پرداخت پس از تأیید دارد و کارمزد 3–10% است. صفحه حدود 314 کار باز را نشان می‌داد، اما در این بررسی funded بودن escrow هر سفارش و روش برداشت کارگر تأیید نشد. | اولویت بالا برای بررسی سفارش‌های تصویر/ویدئو/تحقیق؛ هیچ کاری شروع نشود تا escrow همان سفارش و payout route عملاً تأیید شود. |
| Bountycaster | https://bountycaster.xyz/ | فهرست bountyهای وب۳ با دسته‌هایی مثل Beginner Friendly و Highest Value. واکشی صفحه اصلی در این بررسی محتوای زنده‌ی فهرست را نشان نداد؛ بنابراین تعداد و وضعیت bountyهای قابل claim تأیید نشد. | watchlist / منبع کشف؛ فقط bounty با بودجه و پرداخت قابل‌راستی‌آزمایی بررسی شود. |
| AI Film Contests | https://aifilmcontests.com/ | فهرست و تقویم مسابقات فیلم هوش مصنوعی، نه بازار کار با دستمزد ثابت. snapshot صفحه حدود 71 مسابقه فعال و بیش از 2.1 میلیون دلار مجموع جوایز ادعایی را نشان می‌داد؛ برخی مسابقات ممکن است entry fee، محدودیت کشور، حقوق مالکیت یا شرط ابزار خاص داشته باشند. | فرصت جانبی؛ فقط مسابقات رایگان با eligibility و payout روشن. مجموع جوایز به معنی درآمد قابل‌دستیابی یا تضمین پرداخت نیست. |

### شروط قبل از اقدام
- کشور/اقامت و امکان دریافت پول از ارمنستان جداگانه بررسی شود؛ «Global» به‌تنهایی تضمین eligibility نیست.
- روش پرداخت، شبکه، حداقل برداشت، fee و KYC باید از منبع رسمی و در صورت امکان از صفحه حساب تأیید شود.
- هیچ entry fee، subscription، deposit، bond، stake یا paid boost پرداخت نشود.
- مسابقه و bounty درآمد تضمینی نیستند؛ تعداد شرکت‌کننده، شانس برد، deadline، حقوق استفاده از محتوا و مجوز AI باید قبل از تولید بررسی شوند.
- هیچ حسابی ساخته نشده، اپلیکیشنی ارسال نشده، کیف پولی متصل نشده و پرداخت/امضایی انجام نشده است.

### Monero.Jobs — reaffirmed priority
- User reaffirmed that Monero.Jobs is an approved candidate and it must remain in the main shortlist; do not downgrade it merely because it lacks escrow.
- Official listing is https://monero.jobs/paid-in-xmr. The platform advertises direct XMR payment to a wallet and does not require a platform account for browsing/applying to listings; verify each employer's requirements independently.
- No platform escrow was identified. This is a payment-risk warning, not a reason to remove the platform. Prefer written scope, milestones, and partial upfront payment before delivering final files.
- Keep it active for searching relevant AI-assisted writing, design, video, animation, and other digital-work listings. Verify the live listing, client credibility, payment amount, and terms before starting.
- User accepts human-presence checks (selfie/face/liveness); government ID, country restrictions, and any paid checks remain separate checks.


## Consolidated due-diligence refresh — 2026-11-26

This pass reconciles the platform catalog, source registry, KYC seed list and operational tracker. **No platform is marked eligible for this user merely because it accepts a wallet or advertises global access.** The relevant case is Iranian passport + physical presence in Armenia + no Armenian residence permit. Public terms reviewed so far do not explicitly settle that complete combination for any candidate.

### Best candidates to inspect first (not yet user-eligible)

| Platform | Verified public facts from official sources | Remaining blockers | Project action |
|---|---|---|---|
| Taskmarket | Base tasks settle in USDC to a wallet; no platform fee; first five bounty/benchmark submissions per task are free, later submissions may cost 0.001 USDC; standard paid actions can cost 0.001 USDC. Some tasks can require identity/reputation or TAP verification. | Identity, age and sanctions checks may be requested; some gated tasks require TAP, and hosted agents need a verified Visa card for TAP tasks. No explicit Iranian-passport acceptance or Armenia/no-residence confirmation found. | High-priority conditional. Only no-stake tasks with funded escrow, no TAP/Visa gate; inspect each task before work. |
| MoltJobs | Official homepage states USDC on Base, 5% fee on funded jobs, 10 free bid credits/month, and escrow funded before work. | No public proof of Iranian passport acceptance, Armenia access without residence, or withdrawal KYC. Verify each task's actual escrow funding. | High-priority conditional; browse only until country/KYC and funding are verified. |
| Getly | Official October 2026 terms: seller fee paid twice monthly in USDT/USDC; seller receives 80–90%; seller must provide accurate payout and tax information; platform may request further documents/KYC. | No explicit Iran passport or Armenia/no-residence decision; sales are not guaranteed and default platform share is 20%. | Digital-product storefront candidate; no production/listing until payout onboarding is confirmed. |
| make.fun | Terms dated Nov 23, 2026: rewards paid USDC on Solana; most bounties free; sanctions screening and country/region checks before payout; tax form only where US law requires. | Terms do not establish this user's passport/presence combination. Broad, perpetual, royalty-free, sublicensable licence covers submitted content/data including AI transcripts. | Selective free-entry only; flag substantial content/data licence before submission. |
| Superteam Earn | Official terms restrict use where illegal or contrary to sanctions; platform disclaims responsibility for partner non-payment. Armenia region page lists campaigns. | A regional page or "Global" label does not prove Iranian passport acceptance, residence-permit waiver, or payout eligibility; payout may be sponsor-specific. Raenest-dependent campaign needs written eligibility confirmation. | Campaign discovery only; verify sponsor, live deadline, payout and eligibility per bounty. |
| Gibwork | Public bounty marketplace with task-specific rewards and Solana ecosystem work. | Escrow release depends on employer acceptance; exact country/KYC and fees are not verified for the user. | Conditional for legitimate creative briefs only; verify funded escrow first. |
| Monero.Jobs | Listings advertise direct XMR payment; no platform escrow identified. | No-escrow counterparty risk; advertised no-KYC does not prove every employer or local law accepts the user. | Keep active as user-approved lead; written scope, milestones and partial payment before final delivery. |

### Restrictions, exclusions and low priority

- **Microworker.app:** official eligibility page excludes Iran as a service location and says payouts are USDT/USDC to personal wallets on BNB Smart Chain, Arbitrum or Polygon. This is a location exclusion for Iran; it does not prove a blanket ban on Iranian passport holders physically in Armenia. Passport/KYC and Armenia access still need explicit confirmation. Do not label eligible.
- **AnoWorks:** official disclaimer dated Oct 27, 2026 confirms 10% platform fee, internal platform balance, crypto deposits and TRX withdrawals. Visible task examples include low-value engagement/review tasks; do not perform fake reviews, likes or manipulation. No verified passport/Armenia eligibility.
- **CryptoTask:** manual-only; no bots/scrapers or autonomous execution unless written permission is provided. Verify escrow funding on each project.
- **HireForHumans:** retain blocked/excluded based on the earlier explicit Iran restriction recorded in this project; do not attempt signup or country circumvention.
- **LaborX:** low priority until current listings, Iranian-passport/KYC and wallet withdrawal are confirmed.
- **Scribble Network:** watchlist only; last saved snapshot showed zero live bounties.
- **BasedAgents:** do not claim paid tasks requiring the 1 USDC refundable bond; free reputation-only tasks do not count as cash income.
- **Stacker News / PeakD / 3Speak:** optional variable community rewards, not reliable paid work.
- **TaskOn / Zealy / Layer3 / Genesis / Kolo:** only count explicit liquid token payouts; points, NFTs, badges and speculative airdrops are not income.
- **Prolific / Clickworker / Upwork / Fiverr / CrowdGen and other fiat-only channels:** exclude from the primary shortlist because the project requires crypto payout to the user's own wallet.
- **Higgsfield Talent Contest:** cash/bank payout rather than verified direct crypto payout; do not prioritize under the project's payout rule.
- **BountyBook, Claw Earn, and paid-bond/stake platforms:** do not prioritize for the zero-capital path unless current official evidence proves a free route and actual payout eligibility.

### Rules applied to every catalog entry

1. Iranian passport acceptance, physical presence in Armenia, and formal Armenian residence requirement are separate checks.
2. "Global", "open worldwide", "no KYC at signup", or a working registration form is not proof of withdrawal eligibility.
3. KYC can include government ID/passport, proof of address, tax information, sanctions screening and human liveness; record each separately. Human liveness is acceptable, but do not submit documents or biometrics without explicit approval.
4. Only direct crypto payout to the user's own wallet is eligible; record asset, network, minimum, withdrawal fee, platform fee and any hold.
5. No deposits, stakes, bonds, paid boosts, subscriptions, mandatory purchases or paid verification.
6. Contests, points, NFTs, referrals, social engagement and speculative rewards are not guaranteed income.
7. Every task needs a real current brief, deadline, deliverable, acceptance criteria, AI-use permission and funded escrow/payment protection (or explicit staged P2P terms).
8. Unknown remains unknown. No account creation, applications, wallet connection, legal acceptance or transactions without explicit approval.

Official evidence reviewed:
- Taskmarket worker requirements: https://docs.taskmarket.dev/reference/worker-requirements
- Taskmarket Base payments: https://docs.taskmarket.dev/networks/base
- Taskmarket settlement terms: https://docs.taskmarket.dev/settlement-terms/terms
- MoltJobs: https://moltjobs.io/
- Getly terms: https://www.getly.store/terms
- make.fun terms: https://make.fun/terms
- Microworker eligibility: https://microworker.app/eligibility/
- AnoWorks disclaimer: https://www.anoworks.app/disclaimer
- Superteam Earn terms: https://superteam.fun/earn/terms-of-use.pdf
- Superteam Earn Armenia opportunities: https://superteam.fun/earn/regions/armenia

No account, KYC submission, wallet connection, application, legal acceptance or payment was performed in this research pass.
