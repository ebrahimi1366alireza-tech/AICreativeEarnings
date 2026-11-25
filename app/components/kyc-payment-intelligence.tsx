"use client";

import { useEffect, useMemo, useState } from "react";

type KycRecord = {
  id: string;
  platform: string;
  url: string;
  kyc: "none" | "id" | "address" | "selfie" | "unknown";
  iranianPassport: "accepted" | "rejected" | "unknown";
  countryAccess: "allowed" | "blocked" | "unknown";
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
  ["Taskmarket","https://taskmarket.xyz/"],["MoltJobs","https://moltjobs.com/"],
  ["Getly","https://getly.ai/"],["Gibwork","https://gib.work/"],
  ["BasedAgents","https://basedagents.xyz/"],["Monero.Jobs","https://monero.jobs/"],
  ["XMRBazaar","https://xmrbazaar.com/"],["make.fun","https://make.fun/"],
  ["AgentHansa","https://agenthansa.com/"],["t2000","https://t2000.ai/"],
  ["Agentizable","https://agentizable.com/"],["Upwork","https://www.upwork.com/"],
  ["Fiverr","https://www.fiverr.com/"]
].map(([platform,url]) => ({
  id: platform.toLowerCase().replace(/[^a-z0-9]+/g,"-"), platform, url,
  kyc:"unknown" as const, iranianPassport:"unknown" as const,
  countryAccess:"unknown" as const, payout:"unknown" as const, cost:"unknown" as const,
  asset:"", network:"", minimum:"نامشخص", fee:"نامشخص", evidenceUrl:"", checkedAt:""
}));

const labels = {
  kyc: { none:"بدون KYC", id:"مدرک هویتی / پاسپورت", address:"مدرک آدرس / مالیات", selfie:"سلفی / زنده‌سنجی", unknown:"نامشخص" },
  iranianPassport: { accepted:"پذیرفته می‌شود", rejected:"پذیرفته نمی‌شود", unknown:"بررسی نشده" },
  countryAccess: { allowed:"کشور محل اقامت مجاز", blocked:"کشور محل اقامت مسدود", unknown:"نامشخص" },
  payout: { "direct-crypto":"مستقیم به کیف پول", "platform-wallet":"موجودی داخلی پلتفرم", fiat:"فقط فیات", unknown:"نامشخص" },
  cost: { free:"رایگان، بدون سپرده", fee:"هزینه / اشتراک اجباری", deposit:"سپرده / وثیقه اجباری", unknown:"نامشخص" }
};

type Filter = "all" | "ready" | "review" | "blocked";

function readiness(item: KycRecord) {
  if (item.iranianPassport === "rejected" || item.countryAccess === "blocked" || item.payout === "fiat" || item.cost === "fee" || item.cost === "deposit") return "blocked";
  if (item.kyc === "none" && item.iranianPassport === "accepted" && item.countryAccess === "allowed" &&
      item.payout === "direct-crypto" && item.cost === "free" && item.asset.trim() &&
      item.network.trim() && item.minimum.trim() && item.fee.trim() && item.evidenceUrl.startsWith("https://")) return "ready";
  return "review";
}

export default function KycPaymentIntelligence() {
  const [records,setRecords] = useState<KycRecord[]>(seed);
  const [loaded,setLoaded] = useState(false);
  const [filter,setFilter] = useState<Filter>("all");
  const [residence,setResidence] = useState("ارمنستان");
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
    const savedResidence = localStorage.getItem("creativeops-kyc-residence-v1");
    if (savedResidence) setResidence(savedResidence);
    setLoaded(true);
  },[]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("creativeops-kyc-intelligence-v1",JSON.stringify(records));
      localStorage.setItem("creativeops-kyc-residence-v1",residence);
    }
  },[records,residence,loaded]);

  const counts = useMemo(() => records.reduce((a,r) => { a[readiness(r)]++; return a; },{ready:0,review:0,blocked:0}),[records]);
  const visible = records.filter(r => filter === "all" || readiness(r) === filter);

  function update(id:string, patch:Partial<KycRecord>) {
    setRecords(current => current.map(r => r.id === id ? {...r,...patch,checkedAt:new Date().toISOString().slice(0,10)} : r));
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
      <p className="hub-intro">برای هر پلتفرم، پذیرش پاسپورت ایرانی، دسترسی کشور محل اقامت، نوع KYC، پرداخت رمزارزی، هزینه ورود و ریسک بلوکه‌شدن را ثبت و غربال کن. اطلاعات اولیه عمداً «نامشخص» هستند؛ تا وقتی منبع رسمی و تاریخ بررسی ثبت نشده، هیچ گزینه‌ای تأییدشده محسوب نمی‌شود.</p>
      <div className="kpi-toolbar">
        <label>کشور محل اقامت
          <select value={residence} onChange={e=>setResidence(e.target.value)}>
            {["ارمنستان","ایران","امارات","قطر","عمان","کشور دیگر"].map(x=><option key={x}>{x}</option>)}
          </select>
        </label>
        <div className="kpi-passport"><small>مدرک مورد بررسی</small><strong>پاسپورت ایرانی</strong></div>
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
          const state = readiness(item);
          return <article className="kpi-card" key={item.id}>
            <div className="kpi-card-head"><div><strong>{item.platform}</strong><a href={item.url} target="_blank" rel="noreferrer">سایت رسمی ↗</a></div>
              <span className={"kpi-state "+state}>{state==="ready"?"واجد شرایط مستند":state==="blocked"?"نامناسب / مسدود":"نیازمند بررسی"}</span>
            </div>
            <div className="kpi-fields">
              <label>KYC<select value={item.kyc} onChange={e=>update(item.id,{kyc:e.target.value as KycRecord["kyc"]})}>{Object.entries(labels.kyc).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>پاسپورت ایرانی<select value={item.iranianPassport} onChange={e=>update(item.id,{iranianPassport:e.target.value as KycRecord["iranianPassport"]})}>{Object.entries(labels.iranianPassport).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>دسترسی {residence}<select value={item.countryAccess} onChange={e=>update(item.id,{countryAccess:e.target.value as KycRecord["countryAccess"]})}>{Object.entries(labels.countryAccess).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>روش برداشت<select value={item.payout} onChange={e=>update(item.id,{payout:e.target.value as KycRecord["payout"]})}>{Object.entries(labels.payout).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>هزینه ورود<select value={item.cost} onChange={e=>update(item.id,{cost:e.target.value as KycRecord["cost"]})}>{Object.entries(labels.cost).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
              <label>ارز پرداخت<input value={item.asset} onChange={e=>update(item.id,{asset:e.target.value})} placeholder="مثلاً USDT"/></label>
              <label>شبکه<input value={item.network} onChange={e=>update(item.id,{network:e.target.value})} placeholder="مثلاً Polygon"/></label>
              <label>حداقل برداشت<input value={item.minimum} onChange={e=>update(item.id,{minimum:e.target.value})} placeholder="مقدار و واحد"/></label>
              <label>کارمزد<input value={item.fee} onChange={e=>update(item.id,{fee:e.target.value})} placeholder="مقدار / درصد"/></label>
              <label className="wide">لینک مدرک رسمی<input value={item.evidenceUrl} onChange={e=>update(item.id,{evidenceUrl:e.target.value})} placeholder="https://... (شرایط KYC، کشور یا برداشت)"/></label>
            </div>
            <div className="kpi-card-foot"><span>آخرین ثبت: {item.checkedAt || "هنوز بررسی نشده"}</span><span>نتیجه برای {residence}: {state==="ready"?"همه شروط ثبت شده":state==="blocked"?"حداقل یک مانع ثبت شده":"شواهد کافی نیست"}</span></div>
          </article>;
        })}
        {visible.length===0 && <div className="empty-state">موردی در این فیلتر نیست.</div>}
      </div>
      <p className="hub-footnote">نکته امنیتی: هویت جعلی، مدارک دستکاری‌شده، حساب اجاره‌ای، VPN برای پنهان‌کردن کشور یا دورزدن محدودیت‌ها استفاده نمی‌شود. این نسخه اطلاعات را در حافظه همین مرورگر نگه می‌دارد؛ بررسی خودکار زنده شرایط سایت‌ها و همگام‌سازی ابری هنوز به منبع داده و اتصال سرور نیاز دارد. برای تأیید نهایی، لینک رسمی و تاریخ بررسی را ثبت کن.</p>
    </section>
  );
}
