"use client";

import { useEffect, useMemo, useState } from "react";

type KycRecord = {
  id: string;
  platform: string;
  url: string;
  kyc: "none" | "id" | "address" | "selfie" | "unknown";
  iranianPassport: "accepted" | "rejected" | "unknown";
  passportAcceptanceByCitizenship?: Record<string, "accepted" | "rejected" | "unknown">;
  countryAccess: "allowed" | "blocked" | "unknown";
  /** Access based on current physical presence, separate from formal residence. */
  currentPresenceAccess?: "allowed" | "blocked" | "unknown";
  currentPresenceAccessByCountry?: Record<string, "allowed" | "blocked" | "unknown">;
  /** Whether payouts are supported for the selected receiving-account country. */
  payoutCountryAccessByCountry?: Record<string, "allowed" | "blocked" | "unknown">;
  /** Whether a formal residence permit is required for the selected country. */
  residencePermitRequirement?: "required" | "not-required" | "unknown";
  residencePermitRequirementByCountry?: Record<string, "required" | "not-required" | "unknown">;
  countryAccessByResidence?: Record<string, "allowed" | "blocked" | "unknown">;
  payout: "direct-crypto" | "platform-wallet" | "fiat" | "unknown";
  cost: "free" | "fee" | "deposit" | "unknown";
  asset: string;
  network: string;
  minimum: string;
  fee: string;
  evidenceUrl: string;
  evidenceNote?: string;
  evidenceCheckedAt?: string;
  checkedAt: string;
};

const seed: KycRecord[] = [
  ["LaborX","https://laborx.com/"],["Subnano","https://subnano.ai/"],
  ["Taskmarket","https://taskmarket.dev/"],["MoltJobs","https://moltjobs.io/"],
  ["Getly","https://www.getly.store/"],["Gibwork","https://gib.work/"],
  ["BasedAgents","https://basedagents.ai/"],["Monero.Jobs","https://monero.jobs/"],
  ["XMRBazaar","https://xmrbazaar.com/"],["make.fun","https://make.fun/"],
  ["AgentHansa","https://www.agenthansa.com/"],["t2000","https://t2000.ai/"],
  ["Agentizable","https://agentizable.ai/"],["Upwork","https://www.upwork.com/"],
  ["Fiverr","https://www.fiverr.com/"],
  ["Microworker.app","https://microworker.app/"],
  ["AnoWorks","https://www.anoworks.app/"],
  ["CryptoTask","https://www.cryptotask.org/"],
  ["HireForHumans","https://hireforhumans.com/"],
  ["Stacker News","https://stacker.news/"],
  ["Microlancer","https://microlancer.io/"],
  ["Loopuman","https://loopuman.com/for-workers"],
  ["Humanbased","https://humanbased.ai/contributors"],
  ["Clickworker","https://www.clickworker.com/"],
  ["Prolific","https://www.prolific.com/"],
  ["Superteam Earn","https://superteam.fun/earn/bounties"],
  ["Kyzzen","https://www.kyzzen.io/bounties"],
  ["Airaa","https://airaa.xyz/for-creators"],
  ["ClipRush","https://www.cliprush.net/"],
  ["ClipStake","https://www.clipstake.com/creators"],
  ["Yeez","https://www.yeez.app/"],
  ["Clipur","https://www.clipur.com/"],
  ["Promote (promote.sh)","https://promote.sh/"],
  ["ClipFlip","https://www.clipflip.io/creator"],
  ["Drip Haus","https://drip.haus/creators"],
  ["Scribble Network","https://scribble.network/creators"],
  ["GIMI","https://www.gimi.co/creators"],
  ["AI Film Contests","https://aifilmcontests.com/"],
  ["Sapien","https://www.sapien.io/"],
  ["PublicAI","https://publicai.io/"],
  ["Genesis / Onfin","https://genesis.onfin.io/en"],
  ["Kolo Ambassadors","https://ambassadors.kolo.xyz/"],
  ["Zealy","https://zealy.io/"],
  ["Layer3","https://layer3.xyz/"],
  ["Dealwork AI","https://dealwork.ai/"],
  ["Bountycaster","https://bountycaster.xyz/"],
  ["PeakD","https://peakd.com/"],
  ["3Speak","https://3speak.tv/"],
  ["TaskOn","https://taskon.xyz/"],
  ["QuestN","https://questn.com/"],
  ["Monero Bounties","https://bounties.monero.social/"],
  ["TaskForce","https://www.task-force.app/"],
  ["OpenJobs","https://openjobs.global/"],
  ["Clustly","https://clustly.ai/"],
  ["Frantic","https://gofrantic.com/"],
  ["OpenJobs (openjobs.bot)","https://openjobs.bot/"],
  ["First Dollar","https://app.firstdollar.money/bounties"],
  ["Higgsfield Talent Contest","https://higgsfield.ai/contests/talent-contest?tab=rules"],
  ["ContentRewards","https://contentrewards.com/c/campaigns/6441e520-ad18-4f7f-83bf-01139f38c63a"],
  ["Video Marketplace","https://dev.vidodata.com/"],
  ["Vocal Media","https://vocal.media/"],
  ["BountyBook","https://api.bountybook.ai/"],
  ["Claw Earn","https://clawearn.com/"],
  ["Artisan","https://artisan.ac/"],
  ["Raenest (payout dependency)","https://raenest.com/"],
  ["Paragraph (Mirror migration)","https://paragraph.com/"],
  ["Microworkers.com","https://www.microworkers.com/"],
  ["Freecash","https://freecash.com/"],
  ["Toloka","https://toloka.ai/"],
  ["Mindrift","https://mindrift.ai/"],
  ["Ruul","https://ruul.io/"],
  ["Gumroad","https://gumroad.com/"],
  ["Ko-fi","https://ko-fi.com/"],
  ["Shutterstock Contributor","https://submit.shutterstock.com/"],
  ["BeatStars","https://www.beatstars.com/"],
  ["MusedIn","https://musedin.com/"],
  ["AgentPact","https://agentpact.io/"]
].map(([platform,url]) => ({

  id: platform.toLowerCase().replace(/[^a-z0-9]+/g,"-"), platform, url,
  kyc:"unknown" as const, iranianPassport:"unknown" as const,
  countryAccess:"unknown" as const, payout:"unknown" as const, cost:"unknown" as const,
  asset:"", network:"", minimum:"نامشخص", fee:"نامشخص", evidenceUrl:"", checkedAt:""
})).map(record => record.id === "gibwork" ? {
  ...record,
  iranianPassport:"rejected" as const,
  passportAcceptanceByCitizenship:{ IR:"rejected" as const },
  evidenceUrl:"https://gib.work/terms",
  evidenceNote:"شرایط رسمی Gibwork استفاده را برای شهروند یا مقیم حوزه‌های مشمول تحریم جامع ممنوع می‌کند. راهنمای رسمی OFAC، ایران را در دسته تحریم‌های گسترده/جامع حوزه‌محور قرار می‌دهد؛ بنابراین شرط شهروندی در متن Gibwork برای تابعیت ایرانی مانع است، حتی اگر محل حضور فعلی ارمنستان باشد.",
  evidenceCheckedAt:"2026-11-26",
  checkedAt:"2026-11-26"
} : record);

// ISO 3166-1 alpha-2 country/territory codes. Names are localized by the browser.
const COUNTRY_CODES = `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW`.split(" ");
const regionNames = new Intl.DisplayNames(["fa"], { type: "region" });
const COUNTRIES = COUNTRY_CODES.map(code => ({ code, name: regionNames.of(code) || code }))
  .sort((a,b) => a.name.localeCompare(b.name, "fa"));
const countryName = (code:string) => COUNTRIES.find(c => c.code === code)?.name || code;

const labels = {
  kyc: { none:"بدون KYC", id:"مدرک هویتی / پاسپورت", address:"مدرک آدرس / مالیات", selfie:"سلفی / زنده‌سنجی", unknown:"نامشخص" },
  iranianPassport: { accepted:"پذیرفته می‌شود", rejected:"پذیرفته نمی‌شود", unknown:"بررسی نشده" },
  countryAccess: { allowed:"دسترسی کشور مجاز", blocked:"دسترسی کشور مسدود", unknown:"نامشخص" },
  currentPresenceAccess: { allowed:"حضور فعلی مجاز", blocked:"حضور فعلی غیرمجاز", unknown:"بررسی نشده" },
  payoutCountryAccess: { allowed:"کشور دریافت پشتیبانی می‌شود", blocked:"کشور دریافت پشتیبانی نمی‌شود", unknown:"بررسی نشده" },
  residencePermitRequirement: { required:"اقامت رسمی الزامی", "not-required":"اقامت رسمی لازم نیست", unknown:"بررسی نشده" },
  payout: { "direct-crypto":"مستقیم به کیف پول", "platform-wallet":"موجودی داخلی پلتفرم", fiat:"فقط فیات", unknown:"نامشخص" },
  cost: { free:"رایگان، بدون سپرده", fee:"هزینه / اشتراک اجباری", deposit:"سپرده / وثیقه اجباری", unknown:"نامشخص" }
};

type Filter = "all" | "ready" | "review" | "blocked";

function isVerifiedEvidence(item: KycRecord) {
  if (!item.evidenceUrl || !item.evidenceNote || item.evidenceNote.trim().length < 30 || !item.evidenceCheckedAt) return false;
  try {
    const url = new URL(item.evidenceUrl);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return false;
  } catch { return false; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.evidenceCheckedAt)) return false;
  const checkedDate = new Date(item.evidenceCheckedAt + "T00:00:00.000Z");
  const checked = checkedDate.getTime();
  // Reject normalized impossible dates such as 2026-02-31, not just malformed strings.
  if (!Number.isFinite(checked) || checkedDate.toISOString().slice(0, 10) !== item.evidenceCheckedAt) return false;
  const age = Date.now() - checked;
  return age >= 0 && age <= 90 * 24 * 60 * 60 * 1000;
}

function readiness(item: KycRecord, presenceCountry: string, citizenship: string, payoutCountry: string) {
  const presenceAccess = item.currentPresenceAccessByCountry?.[presenceCountry] ?? item.currentPresenceAccess ?? item.countryAccessByResidence?.[presenceCountry] ?? item.countryAccess ?? "unknown";
  const payoutCountryAccess = item.payoutCountryAccessByCountry?.[payoutCountry] ?? "unknown";
  const permitRequirement = item.residencePermitRequirementByCountry?.[presenceCountry] ?? item.residencePermitRequirement ?? "unknown";
  const passportAcceptance = item.passportAcceptanceByCitizenship?.[citizenship] ?? (citizenship === "IR" ? item.iranianPassport : "unknown");
  if (passportAcceptance === "rejected" || presenceAccess === "blocked" || payoutCountryAccess === "blocked" || permitRequirement === "required" || item.payout === "fiat" || item.cost === "fee" || item.cost === "deposit") return "blocked";
  const kycCompatible = item.kyc === "none" || ((item.kyc === "id" || item.kyc === "selfie") && passportAcceptance === "accepted");
  if (kycCompatible && passportAcceptance === "accepted" && presenceAccess === "allowed" && permitRequirement === "not-required" &&
      payoutCountryAccess === "allowed" && item.payout === "direct-crypto" && item.cost === "free" && item.asset.trim() &&
      item.network.trim() && item.minimum.trim() && item.fee.trim() && isVerifiedEvidence(item)) return "ready";
  return "review";
}

export default function KycPaymentIntelligence() {
  const [records,setRecords] = useState<KycRecord[]>(seed);
  const [loaded,setLoaded] = useState(false);
  const [filter,setFilter] = useState<Filter>("all");
  const [residence,setResidence] = useState("AM");
  const [citizenship,setCitizenship] = useState("IR");
  const [bankCountry,setBankCountry] = useState("AM");
  const [newName,setNewName] = useState("");
  const [newUrl,setNewUrl] = useState("");
  const [notice,setNotice] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("creativeops-kyc-intelligence-v1");
      if (raw) {
        const saved = JSON.parse(raw) as KycRecord[];
        if (Array.isArray(saved)) {
          const byId = new Map(saved.filter(x => x && typeof x.id === "string").map(x => [x.id,x]));
          setRecords(seed.map(x => byId.get(x.id) || x).concat(saved.filter(x => !seed.some(s => s.id === x.id))));
        }
      }
    } catch { /* keep safe defaults */ }
    const savedResidence = localStorage.getItem("creativeops-kyc-residence-v2") || localStorage.getItem("creativeops-kyc-residence-v1");
    if (savedResidence) setResidence(savedResidence === "ارمنستان" ? "AM" : savedResidence === "ایران" ? "IR" : savedResidence);
    const savedCitizenship = localStorage.getItem("creativeops-kyc-citizenship-v1");
    if (savedCitizenship) setCitizenship(savedCitizenship);
    const savedBankCountry = localStorage.getItem("creativeops-kyc-bank-country-v1");
    if (savedBankCountry) setBankCountry(savedBankCountry);
    setLoaded(true);
  },[]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("creativeops-kyc-intelligence-v1",JSON.stringify(records));
      localStorage.setItem("creativeops-kyc-residence-v2",residence);
      localStorage.setItem("creativeops-kyc-citizenship-v1",citizenship);
      localStorage.setItem("creativeops-kyc-bank-country-v1",bankCountry);
      window.dispatchEvent(new Event("creativeops-workspace-changed"));
    }
  },[records,residence,citizenship,bankCountry,loaded]);

  const counts = useMemo(() => records.reduce((a,r) => { a[readiness(r,residence,citizenship,bankCountry)]++; return a; },{ready:0,review:0,blocked:0}),[records,residence,citizenship,bankCountry]);
  const visible = records.filter(r => filter === "all" || readiness(r,residence,citizenship,bankCountry) === filter);

  function update(id:string, patch:Partial<KycRecord>) {
    setRecords(current => current.map(r => r.id === id ? {...r,...patch,checkedAt:new Date().toISOString().slice(0,10)} : r));
  }
  function updatePassportAcceptance(id:string, value:KycRecord["iranianPassport"]) {
    setRecords(current => current.map(r => r.id === id ? {
      ...r,
      ...(citizenship === "IR" ? { iranianPassport: value } : {}),
      passportAcceptanceByCitizenship: { ...(r.passportAcceptanceByCitizenship || {}), [citizenship]: value },
      checkedAt: new Date().toISOString().slice(0,10)
    } : r));
  }

  function updatePresenceAccess(id:string, value:"allowed"|"blocked"|"unknown") {
    setRecords(current => current.map(r => r.id === id ? {
      ...r,
      currentPresenceAccessByCountry: { ...(r.currentPresenceAccessByCountry || {}), [residence]: value },
      checkedAt: new Date().toISOString().slice(0,10)
    } : r));
  }

  function updateResidencePermitRequirement(id:string, value:"required"|"not-required"|"unknown") {
    setRecords(current => current.map(r => r.id === id ? {
      ...r,
      residencePermitRequirementByCountry: { ...(r.residencePermitRequirementByCountry || {}), [residence]: value },
      checkedAt: new Date().toISOString().slice(0,10)
    } : r));
  }

  function addRecord(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    if (!name || !/^https:\/\//i.test(newUrl.trim())) { setNotice("نام پلتفرم و پیوند رسمی HTTPS لازم است."); return; }
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now().toString(36);
    setRecords(current => [{...seed[0],id,platform:name,url:newUrl.trim(),checkedAt:""},...current]);
    setNewName(""); setNewUrl(""); setNotice("پلتفرم اضافه شد؛ تا ثبت شواهد، همه شرایط آن نامشخص است.");
  }

  return (
    <section className="panel kpi-panel" id="kyc-intelligence">
      <div className="panel-head"><div><span className="eyebrow">KYC & PAYMENT INTELLIGENCE</span><h2>هوش احراز هویت و برداشت درآمد</h2></div><span className="free-tag">فقط مسیر قانونی</span></div>
      <p className="hub-intro">برای هر پلتفرم، کشور محل حضور فیزیکی، الزام اقامت رسمی، کشور تابعیت و کشور حساب بانکی را جداگانه بررسی کن. حضور در ارمنستان به‌معنای داشتن اقامت ارمنستان نیست؛ این دو شرط مستقل‌اند. نوع KYC، پرداخت و ریسک بلوکه‌شدن را نیز ثبت و غربال کن. اطلاعات اولیه عمداً «نامشخص» هستند؛ تا وقتی منبع رسمی و تاریخ بررسی ثبت نشده، هیچ گزینه‌ای تأییدشده محسوب نمی‌شود.</p>
      <div className="kpi-toolbar">
        <label>کشور محل حضور فعلی
          <select value={residence} onChange={e=>setResidence(e.target.value)}>
            {COUNTRIES.map(c=><option value={c.code} key={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label>کشور تابعیت
          <select value={citizenship} onChange={e=>setCitizenship(e.target.value)}>
            {COUNTRIES.map(c=><option value={c.code} key={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label>کشور حساب بانکی / دریافت
          <select value={bankCountry} onChange={e=>setBankCountry(e.target.value)}>
            {COUNTRIES.map(c=><option value={c.code} key={c.code}>{c.name}</option>)}
          </select>
        </label>
        <div className="kpi-passport"><small>مدرک هویتی</small><strong>{citizenship === "IR" ? "پاسپورت ایرانی" : "تابعیت: "+countryName(citizenship)}</strong></div>
      </div>
      <div className="kpi-counts">
        <button type="button" className={filter==="all"?"selected":""} onClick={()=>setFilter("all")}><strong>{records.length}</strong><span>همه پلتفرم‌ها</span></button>
        <button type="button" className={filter==="ready"?"selected":""} onClick={()=>setFilter("ready")}><strong>{counts.ready}</strong><span>همه شروط ثبت‌شده</span></button>
        <button type="button" className={filter==="review"?"selected":""} onClick={()=>setFilter("review")}><strong>{counts.review}</strong><span>نیازمند بررسی</span></button>
        <button type="button" className={filter==="blocked"?"selected":""} onClick={()=>setFilter("blocked")}><strong>{counts.blocked}</strong><span>نامناسب / مسدود</span></button>
      </div>
      <div className="kpi-add">
        <form onSubmit={addRecord}>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="نام سایت جدید" aria-label="نام سایت جدید"/>
          <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="پیوند رسمی HTTPS" aria-label="پیوند رسمی سایت"/>
          <button type="submit">افزودن پلتفرم</button>
        </form>
        {notice && <p role="status">{notice}</p>}
      </div>
      <div className="kpi-list">
        {visible.map(item => {
          const state = readiness(item,residence,citizenship,bankCountry);
          const presenceAccess = item.currentPresenceAccessByCountry?.[residence] ?? item.currentPresenceAccess ?? "unknown";
          const permitRequirement = item.residencePermitRequirementByCountry?.[residence] ?? item.residencePermitRequirement ?? "unknown";
          const passportAcceptance = item.passportAcceptanceByCitizenship?.[citizenship] ?? (citizenship === "IR" ? item.iranianPassport : "unknown");
          const payoutCountryAccess = item.payoutCountryAccessByCountry?.[bankCountry] ?? "unknown";
          return <article className="kpi-card" key={item.id}>
            <div className="kpi-card-head"><div><strong>{item.platform}</strong><a href={item.url} target="_blank" rel="noreferrer">سایت رسمی ↗</a></div>
              <span className={"kpi-state "+state}>{state==="ready"?"همه شروط ثبت‌شده":state==="blocked"?"نامناسب / مسدود":"نیازمند بررسی"}</span>
            </div>
            <div className="kpi-fields">
              <label>KYC<select value={item.kyc} onChange={e=>update(item.id,{kyc:e.target.value as KycRecord["kyc"]})}>{Object.entries(labels.kyc).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>پذیرش مدرک تابعیت<select value={passportAcceptance} onChange={e=>updatePassportAcceptance(item.id,e.target.value as KycRecord["iranianPassport"])}>{Object.entries(labels.iranianPassport).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>دسترسی حضور در {countryName(residence)}<select value={presenceAccess} onChange={e=>updatePresenceAccess(item.id,e.target.value as "allowed" | "blocked" | "unknown")}>{Object.entries(labels.currentPresenceAccess).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>پشتیبانی کشور دریافت {countryName(bankCountry)}<select value={payoutCountryAccess} onChange={e=>update(item.id,{payoutCountryAccessByCountry:{...(item.payoutCountryAccessByCountry || {}),[bankCountry]:e.target.value as "allowed" | "blocked" | "unknown"}})}>{Object.entries(labels.payoutCountryAccess).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>نیاز به اقامت رسمی {countryName(residence)}<select value={permitRequirement} onChange={e=>updateResidencePermitRequirement(item.id,e.target.value as "required" | "not-required" | "unknown")}>{Object.entries(labels.residencePermitRequirement).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>روش برداشت<select value={item.payout} onChange={e=>update(item.id,{payout:e.target.value as KycRecord["payout"]})}>{Object.entries(labels.payout).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>هزینه ورود<select value={item.cost} onChange={e=>update(item.id,{cost:e.target.value as KycRecord["cost"]})}>{Object.entries(labels.cost).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>ارز پرداخت<input value={item.asset} onChange={e=>update(item.id,{asset:e.target.value})} placeholder="هر توکن پشتیبانی‌شده، مثلاً ETH یا SOL"/></label>
              <label>شبکه<input value={item.network} onChange={e=>update(item.id,{network:e.target.value})} placeholder="مثلاً Polygon"/></label>
              <label>حداقل برداشت<input value={item.minimum} onChange={e=>update(item.id,{minimum:e.target.value})} placeholder="مقدار و واحد"/></label>
              <label>کارمزد<input value={item.fee} onChange={e=>update(item.id,{fee:e.target.value})} placeholder="مقدار / درصد"/></label>
              <label className="wide">لینک مدرک رسمی<input value={item.evidenceUrl} onChange={e=>update(item.id,{evidenceUrl:e.target.value})} placeholder="https://... (شرایط KYC، کشور یا برداشت)"/></label>
              <label className="wide">خلاصه بند رسمی<input value={item.evidenceNote || ""} onChange={e=>update(item.id,{evidenceNote:e.target.value})} placeholder="حداقل ۳۰ نویسه از شرط رسمی مربوط به تابعیت، حضور یا اقامت"/></label>
              <label>تاریخ بررسی مدرک<input type="date" value={item.evidenceCheckedAt || ""} onChange={e=>update(item.id,{evidenceCheckedAt:e.target.value})}/></label>
            </div>
            <div className="kpi-card-foot"><span>آخرین تغییر: {item.checkedAt || "هنوز ثبت نشده"}</span><span>نتیجه برای حضور در {countryName(residence)}: {state==="ready"?"همه فیلدهای لازم ثبت شده":state==="blocked"?"حداقل یک مانع ثبت شده":"اطلاعات یا شواهد کافی نیست"}</span></div>
          </article>;
        })}
        {visible.length===0 && <div className="empty-state">موردی در این فیلتر نیست.</div>}
      </div>
      <p className="hub-footnote">نکته امنیتی: هویت جعلی، مدارک دستکاری‌شده، حساب اجاره‌ای، VPN برای پنهان‌کردن کشور یا دورزدن محدودیت‌ها استفاده نمی‌شود. وضعیت حضور فیزیکی و الزام اقامت رسمی دو فیلد مستقل‌اند؛ KYC مدرک هویتی یا زنده‌سنجی فقط وقتی قابل قبول است که پذیرش پاسپورت همان تابعیت تأیید شده باشد. برای وضعیت کامل، پذیرش تابعیت، حضور فیزیکی، الزام اقامت رسمی، کشور دریافت، پرداخت مستقیم رمزارزی، هزینه ورود، حداقل برداشت، کارمزد و لینک HTTPS با خلاصه و تاریخ تازه لازم است. این کنترل فقط کامل‌بودن داده‌های واردشده را می‌سنجد؛ محتوای لینک را خودکار نمی‌خواند و صحت ادعای ثبت‌شده را مستقلاً تأیید نمی‌کند. فهرست کشورها بر پایه کدهای ISO 3166-1 است و نام‌ها با زبان مرورگر نمایش داده می‌شوند. این نسخه اطلاعات را در حافظه همین مرورگر نگه می‌دارد؛ بررسی خودکار زنده شرایط سایت‌ها و همگام‌سازی ابری هنوز به منبع داده و اتصال سرور نیاز دارد. برای تأیید نهایی، لینک رسمی و تاریخ بررسی را ثبت کن.</p>
    </section>
  );
}
