"use client";

import { useEffect, useState } from "react";

type Pending = { id: string; url: string; platform: string; kind: string; created_at: string; expires_at: string };

const OPENED_KEY = "creativeops-verification-opened-v1";
const kindLabels: Record<string,string> = {
  email_code: "تأیید ایمیل یا کد یک‌بارمصرف",
  human_verification: "تأیید انسانی یا تشخیص چهره",
  identity_check: "احراز هویت با مدرک",
  unknown: "مرحله تأیید"
};

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2,"0")).join("");
}

export default function SmartLoginVerification() {
  const [paired,setPaired] = useState(false);
  const [pairing,setPairing] = useState(false);
  const [secret,setSecret] = useState("");
  const [pending,setPending] = useState<Pending | null>(null);
  const [notice,setNotice] = useState("برای انتقال درخواست‌ها، ابتدا دستگاه را به عامل ثبت‌نام متصل کن.");

  useEffect(() => {
    setPaired(localStorage.getItem("creativeops-verification-paired-v1") === "1");
    let active = true;
    let busy = false;
    async function poll() {
      if (!active || busy || document.visibilityState !== "visible") return;
      busy = true;
      try {
        const response = await fetch("/api/verification/handoff", { cache: "no-store" });
        if (response.status === 401) {
          setNotice("برای دریافت درخواست‌های تأیید، باید در حساب AI Creative Earnings وارد شده باشی.");
          return;
        }
        if (!response.ok) throw new Error("ارتباط با صف تأیید برقرار نشد.");
        const data = await response.json() as { pending: Pending | null };
        if (!active) return;
        if (!data.pending) { setPending(null); return; }
        const item = data.pending;
        setPending(item);
        if (sessionStorage.getItem(OPENED_KEY) !== item.id) {
          sessionStorage.setItem(OPENED_KEY,item.id);
          setNotice("درخواست تأیید دریافت شد؛ همان صفحه در همین تب باز می‌شود.");
          window.location.assign(item.url);
        } else {
          setNotice("صفحه تأیید قبلاً باز شده است. پس از انجام آن، به این تب برگرد و پایان مرحله را ثبت کن.");
        }
      } catch {
        if (active) setNotice("اتصال صف تأیید موقتاً در دسترس نیست؛ صفحه هنگام فعال‌بودن دوباره بررسی می‌شود.");
      } finally { busy = false; }
    }
    const timer = window.setInterval(() => { void poll(); }, 1800);
    const onVisible = () => { if (document.visibilityState === "visible") void poll(); };
    document.addEventListener("visibilitychange",onVisible);
    void poll();
    return () => { active = false; window.clearInterval(timer); document.removeEventListener("visibilitychange",onVisible); };
  },[]);

  async function pairDevice() {
    setPairing(true); setNotice("");
    try {
      const token = randomToken();
      const tokenHash = await hashToken(token);
      const response = await fetch("/api/verification/pair", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tokenHash })
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "اتصال دستگاه انجام نشد.");
      setSecret(token);
      setPaired(true);
      localStorage.setItem("creativeops-verification-paired-v1","1");
      setNotice("دستگاه متصل شد. کلید زیر فقط یک بار نمایش داده می‌شود؛ آن را فقط در تنظیمات امن عامل ثبت‌نام وارد کن.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "اتصال دستگاه ناموفق بود.");
    } finally { setPairing(false); }
  }

  async function revokeDevice() {
    const response = await fetch("/api/verification/pair",{method:"DELETE"});
    if (!response.ok) { setNotice("لغو اتصال دستگاه ناموفق بود."); return; }
    localStorage.removeItem("creativeops-verification-paired-v1");
    setSecret(""); setPaired(false); setPending(null);
    setNotice("کلید اتصال قبلی لغو شد.");
  }

  async function complete() {
    if (!pending) return;
    const response = await fetch("/api/verification/handoff", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: pending.id })
    });
    if (!response.ok) { setNotice("ثبت پایان مرحله انجام نشد."); return; }
    sessionStorage.removeItem(OPENED_KEY);
    setPending(null);
    setNotice("مرحله تأیید توسط خودت انجام‌شده علامت‌گذاری شد.");
  }

  async function copySecret() {
    try { await navigator.clipboard.writeText(secret); setNotice("کلید اتصال کپی شد."); }
    catch { setNotice("کپی خودکار در دسترس نیست؛ کلید را دستی انتخاب کن."); }
  }

  return (
    <section className="panel" id="smart-login-verification" style={{marginTop:16}}>
      <div className="panel-head">
        <div><span className="eyebrow">SMART LOGIN & VERIFICATION</span><h2>بازکردن مستقیم مرحله تأیید روی گوشی</h2></div>
        <span className="free-tag">بدون دریافت کد یا تصویر</span>
      </div>
      <p className="hub-intro">
        این صفحه هنگام فعال‌بودن، صف درخواست‌های عامل ثبت‌نام را بررسی می‌کند. با رسیدن درخواست، نشانی دقیق صفحه HTTPS در همین تب باز می‌شود تا کد ایمیل، سلفی یا احراز هویت را شخصاً در سایت اصلی انجام بدهی.
      </p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",margin:"12px 0"}}>
        <strong style={{fontSize:12}}>{paired ? "این دستگاه به صف تأیید متصل است." : "اتصال امن دستگاه هنوز فعال نشده است."}</strong>
        {!paired ? <button type="button" onClick={pairDevice} disabled={pairing} style={{border:0,borderRadius:8,padding:"10px 14px",background:"#7656d9",color:"#fff",font:"inherit",fontSize:11}}>{pairing ? "در حال اتصال..." : "اتصال این گوشی"}</button> : <button type="button" onClick={revokeDevice} style={{border:"1px solid #69414a",borderRadius:8,padding:"9px 12px",background:"#2b1b22",color:"#f0b3bd",font:"inherit",fontSize:10}}>لغو اتصال</button>}
      </div>
      {secret && <div style={{padding:12,border:"1px solid #514078",borderRadius:9,background:"#1b1930",margin:"10px 0"}}>
        <strong style={{fontSize:11}}>کلید اتصال عامل، فقط همین بار نمایش داده می‌شود</strong>
        <code dir="ltr" style={{display:"block",overflowWrap:"anywhere",margin:"8px 0",fontSize:11,color:"#d8ccff"}}>{secret}</code>
        <button type="button" onClick={copySecret} style={{border:0,borderRadius:7,padding:"8px 11px",background:"#514078",color:"#fff",font:"inherit",fontSize:10}}>کپی کلید</button>
      </div>}
      {pending && <div style={{padding:12,border:"1px solid #806b3a",borderRadius:9,background:"#2a251a",margin:"12px 0"}}>
        <strong style={{fontSize:12}}>درخواست تأیید باز</strong>
        <p style={{fontSize:10,lineHeight:1.9,color:"#d9c99d",margin:"6px 0"}}>{pending.platform} · {kindLabels[pending.kind] || kindLabels.unknown}</p>
        <a href={pending.url} style={{color:"#d7c5ff",fontSize:10,overflowWrap:"anywhere"}}>بازکردن دوباره صفحه تأیید</a>
        <div><button type="button" onClick={complete} style={{marginTop:10,border:0,borderRadius:7,padding:"9px 12px",background:"#315541",color:"#d4f4e1",font:"inherit",fontSize:10}}>تأیید را انجام دادم، ادامه بده</button></div>
      </div>}
      <p role="status" aria-live="polite" style={{fontSize:10,lineHeight:1.9,color:"#aebbd0",margin:"10px 0"}}>{notice}</p>
      <p style={{fontSize:9,lineHeight:1.9,color:"#7f8da2",margin:0}}>
        نکته فنی: مرورگر اندروید اجازه نمی‌دهد یک وب‌سایت از پس‌زمینه، خودش مرورگر را به پیش‌زمینه بیاورد. برای بازشدن فوری، این داشبورد باید در همان مرورگر و روی صفحه فعال باشد. اتصال عامل به این API نیز لازم است؛ این نسخه به‌تنهایی صفحات سایت‌های دیگر را اسکن نمی‌کند. کد یک‌بارمصرف، رمز و تصویر چهره به این برنامه ارسال یا ذخیره نمی‌شوند.
      </p>
    </section>
  );
}
