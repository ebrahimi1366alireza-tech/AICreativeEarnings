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
  countryAccessByResidence?: Record<string, "allowed" | "blocked" | "unknown">;
  payout: "direct-crypto" | "platform-wallet" | "fiat" | "unknown";
  cost: "free" | "fee" | "deposit" | "unknown";
  asset: string;
  network: string;
  minimum: string;
  fee: string;
  evidenceUrl: string;
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
  ["Frantic","https://gofrantic.com/"]
].map(([platform,url]) => ({
  id: platform.toLowerCase().replace(/[^a-z0-9]+/g,"-"), platform, url,
  kyc:"unknown" as const, iranianPassport:"unknown" as const,
  countryAccess:"unknown" as const, payout:"unknown" as const, cost:"unknown" as const,
  asset:"", network:"", minimum:"نامشخص", fee:"نامشخص", evidenceUrl:"", checkedAt:""
}));

// ISO 3166-1 alpha-2 country/territory codes. Names are localized by the browser.
const COUNTRY_CODES = `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW`.split(" ");
const regionNames = new Intl.DisplayNames(["fa"], { type: "region" });
const COUNTRIES = COUNTRY_CODES.map(code => ({ code, name: regionNames.of(code) || code }))
  .sort((a,b) => a.name.localeCompare(b.name, "fa"));
const countryName = (code:string) => COUNTRIES.find(c => c.code === code)?.name || code;

const labels = {
  kyc: { none:"بدون KYC", id:"مدرک هویتی / پاسپورت", address:"مدرک آدرس / مالیات", selfie:"سلفی / زنده‌سنجی", unknown:"نامشخص" },
  iranianPassport: { accepted:"پذیرفته می‌شود", rejected:"پذیرفته نمی‌شود", unknown:"بررسی نشده" },
  countryAccess: { allowed:"کشور محل اقامت مجاز", blocked:"کشور محل اقامت مسدود", unknown:"نامشخص" },
  payout: { "direct-crypto":"مستقیم به کیف پول", "platform-wallet":"موجودی داخلی پلتفرم", fiat:"فقط فیات", unknown:"نامشخص" },
  cost: { free:"رایگان، بدون سپرده", fee:"هزینه / اشتراک اجباری", deposit:"سپرده / وثیقه اجباری", unknown:"نامشخص" }
};

type Filter = "all" | "ready" | "review" | "blocked";

function readiness(item: KycRecord, residence: string, citizenship: string) {
  const countryAccess = item.countryAccessByResidence?.[residence] ?? item.countryAccess;
  const passportAcceptance = item.passportAcceptanceByCitizenship?.[citizenship] ?? (citizenship === "IR" ? item.iranianPassport : "unknown");
  if (passportAcceptance === "rejected" || countryAccess === "blocked" || item.payout === "fiat" || item.cost === "fee" || item.cost === "deposit") return "blocked";
  if (["none", "selfie"].includes(item.kyc) && passportAcceptance === "accepted" && countryAccess === "allowed" &&
      item.payout === "direct-crypto" && item.cost === "free" && item.asset.trim() &&
      item.network.trim() && item.minimum.trim() && item.fee.trim() && item.evidenceUrl.startsWith("https://")) return "ready";
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

  const counts = useMemo(() => records.reduce((a,r) => { a[readiness(r,residence,citizenship)]++; return a; },{ready:0,review:0,blocked:0}),[records,residence,citizenship]);
  const visible = records.filter(r => filter === "all" || readiness(r,residence,citizenship) === filter);

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

  function updateResidenceAccess(id:string, value:KycRecord["countryAccess"]) {
    setRecords(current => current.map(r => r.id === id ? {
      ...r,
      countryAccessByResidence: { ...(r.countryAccessByResidence || {}), [residence]: value },
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
      <p className="hub-intro">برای هر پلتفرم، کشور محل اقامت، کشور تابعیت و کشور حساب بانکی را جداگانه بررسی کن. فهرست شامل کشورهای جهان است؛ پذیرش پاسپورت، دسترسی منطقه‌ای، نوع KYC، پرداخت و ریسک بلوکه‌شدن را ثبت و غربال کن. سلفی/زنده‌سنجی به‌تنهایی قابل قبول است؛ مدرک هویتی، پاسپورت، آدرس و مالیات باید جداگانه بررسی شوند. اطلاعات اولیه عمداً «نامشخص» هستند؛ تا وقتی منبع رسمی و تاریخ بررسی ثبت نشده، هیچ گزینه‌ای تأییدشده محسوب نمی‌شود.</p>
      <div className="kpi-toolbar">
        <label>کشور محل اقامت
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
        <button type="button" className={filter==="ready"?"selected":""} onClick={()=>setFilter("ready")}><strong>{counts.ready}</strong><span>واجد شرایط مستند</span></button>
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
          const state = readiness(item,residence,citizenship);
          const residenceAccess = item.countryAccessByResidence?.[residence] ?? item.countryAccess;
          const passportAcceptance = item.passportAcceptanceByCitizenship?.[citizenship] ?? (citizenship === "IR" ? item.iranianPassport : "unknown");
          return <article className="kpi-card" key={item.id}>
            <div className="kpi-card-head"><div><strong>{item.platform}</strong><a href={item.url} target="_blank" rel="noreferrer">سایت رسمی ↗</a></div>
              <span className={"kpi-state "+state}>{state==="ready"?"واجد شرایط مستند":state==="blocked"?"نامناسب / مسدود":"نیازمند بررسی"}</span>
            </div>
            <div className="kpi-fields">
              <label>KYC<select value={item.kyc} onChange={e=>update(item.id,{kyc:e.target.value as KycRecord["kyc"]})}>{Object.entries(labels.kyc).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>پذیرش مدرک تابعیت<select value={passportAcceptance} onChange={e=>updatePassportAcceptance(item.id,e.target.value as KycRecord["iranianPassport"])}>{Object.entries(labels.iranianPassport).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>دسترسی {countryName(residence)}<select value={residenceAccess} onChange={e=>updateResidenceAccess(item.id,e.target.value as KycRecord["countryAccess"])}>{Object.entries(labels.countryAccess).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>روش برداشت<select value={item.payout} onChange={e=>update(item.id,{payout:e.target.value as KycRecord["payout"]})}>{Object.entries(labels.payout).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>هزینه ورود<select value={item.cost} onChange={e=>update(item.id,{cost:e.target.value as KycRecord["cost"]})}>{Object.entries(labels.cost).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>ارز پرداخت<input value={item.asset} onChange={e=>update(item.id,{asset:e.target.value})} placeholder="هر توکن پشتیبانی‌شده، مثلاً ETH یا SOL"/></label>
              <label>شبکه<input value={item.network} onChange={e=>update(item.id,{network:e.target.value})} placeholder="مثلاً Polygon"/></label>
              <label>حداقل برداشت<input value={item.minimum} onChange={e=>update(item.id,{minimum:e.target.value})} placeholder="مقدار و واحد"/></label>
              <label>کارمزد<input value={item.fee} onChange={e=>update(item.id,{fee:e.target.value})} placeholder="مقدار / درصد"/></label>
              <label className="wide">لینک مدرک رسمی<input value={item.evidenceUrl} onChange={e=>update(item.id,{evidenceUrl:e.target.value})} placeholder="https://... (شرایط KYC، کشور یا برداشت)"/></label>
            </div>
            <div className="kpi-card-foot"><span>آخرین ثبت: {item.checkedAt || "هنوز بررسی نشده"}</span><span>نتیجه برای {countryName(residence)}: {state==="ready"?"همه شروط ثبت شده":state==="blocked"?"حداقل یک مانع ثبت شده":"شواهد کافی نیست"}</span></div>
          </article>;
        })}
        {visible.length===0 && <div className="empty-state">موردی در این فیلتر نیست.</div>}
      </div>
      <p className="hub-footnote">نکته امنیتی: هویت جعلی، مدارک دستکاری‌شده، حساب اجاره‌ای، VPN برای پنهان‌کردن کشور یا دورزدن محدودیت‌ها استفاده نمی‌شود. فهرست کشورها بر پایه کدهای ISO 3166-1 است و نام‌ها با زبان مرورگر نمایش داده می‌شوند. این نسخه اطلاعات را در حافظه همین مرورگر نگه می‌دارد؛ بررسی خودکار زنده شرایط سایت‌ها و همگام‌سازی ابری هنوز به منبع داده و اتصال سرور نیاز دارد. برای تأیید نهایی، لینک رسمی و تاریخ بررسی را ثبت کن.</p>
    </section>
  );
}
