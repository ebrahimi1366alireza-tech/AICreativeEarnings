"use client";

import { useEffect, useState } from "react";

type AuthStatus = {
  connected: boolean;
  profile: { email: string; name?: string } | null;
  configured?: boolean;
  gmailConnected?: boolean;
  emailAuthConfigured?: boolean;
};

export default function AccountConnections() {
  const [wallet, setWallet] = useState("");
  const [saved, setSaved] = useState(false);
  const [auth, setAuth] = useState<AuthStatus>({ connected: false, profile: null });
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function refreshAuth() {
    setChecking(true);
    try {
      const response = await fetch("/api/auth/status", { cache: "no-store" });
      setAuth(await response.json() as AuthStatus);
    } catch { setAuth({ connected: false, profile: null }); }
    finally { setChecking(false); }
  }

  useEffect(() => {
    try {
      const value = localStorage.getItem("creativeops-connections-v1");
      if (value) {
        const parsed = JSON.parse(value) as { wallet?: string };
        setWallet(parsed.wallet || "");
      }
    } catch { /* ignore invalid local data */ }
    void refreshAuth();
    const params = new URLSearchParams(window.location.search);
    if (params.has("google") || params.has("gmail")) {
      const state = params.get("gmail") || params.get("google");
      setNotice(state === "connected" ? (params.has("gmail") ? "Gmail با موفقیت متصل شد." : "ورود با Google موفق بود.") : "اتصال کامل نشد. تنظیمات OAuth و مجوزهای Google را بررسی کن.");
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    }
  }, []);

  async function submitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setNotice("");
    try {
      const response = await fetch(mode === "login" ? "/api/auth/email/login" : "/api/auth/email/signup", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password })
      });
      const data = await response.json() as { error?: string; message?: string; needsEmailConfirmation?: boolean };
      if (!response.ok) throw new Error(data.error || "ورود انجام نشد.");
      setNotice(data.message || "عملیات انجام شد.");
      if (!data.needsEmailConfirmation) await refreshAuth();
    } catch (error) { setNotice(error instanceof Error ? error.message : "خطای نامشخص"); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await fetch("/api/auth/gmail/disconnect", { method: "POST" }).catch(() => undefined);
    await refreshAuth();
    setNotice("از حساب خارج شدی.");
  }

  function saveWallet() {
    localStorage.setItem("creativeops-connections-v1", JSON.stringify({ wallet: wallet.trim() }));
    setSaved(true);
  }

  return (
    <section className="panel connections-panel" id="accounts">
      <div className="panel-head">
        <div><span className="eyebrow">ACCOUNT CONNECTIONS</span><h2>ورود و اتصال حساب‌ها</h2></div>
        <span className="free-tag">رایگان برای شروع</span>
      </div>
      <p className="connection-intro">سه قابلیت جدا: ورود با ایمیل، ورود با Google و اتصال اختیاری Gmail برای خواندن ایمیل‌ها. اتصال Gmail فقط با اجازه صریح خودت انجام می‌شود.</p>

      <div className="connection-grid">
        <div className="connection-card">
          <div className="connection-icon">✉</div>
          <div className="connection-body">
            <strong>ورود با ایمیل و رمز عبور</strong>
            {auth.connected ? <p>وارد شده‌ای: {auth.profile?.email}</p> : <>
              <form onSubmit={submitEmail}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ایمیل" autoComplete="email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور (حداقل ۸ کاراکتر برای ثبت‌نام)" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required />
                <button type="submit" disabled={busy}>{busy ? "در حال انجام..." : mode === "login" ? "ورود با ایمیل" : "ساخت حساب"}</button>
              </form>
              <button type="button" className="text-action" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setNotice(""); }}>{mode === "login" ? "ساخت حساب جدید" : "قبلاً حساب ساخته‌ام، ورود"}</button>
            </>}
            <small>{auth.emailAuthConfigured ? "مدیریت حساب از طریق Supabase Auth انجام می‌شود." : "تنظیمات Supabase در سرور کامل نیست."}</small>
          </div>
        </div>

        <div className="connection-card">
          <div className="connection-icon">G</div>
          <div className="connection-body">
            <strong>ورود با Google</strong>
            <p>{auth.connected ? "حساب متصل است: " + (auth.profile?.email || "") : "با همان Gmail قبلی وارد شو؛ رمز گوگل در این سایت وارد نمی‌شود."}</p>
            {auth.connected ? <button type="button" onClick={logout}>خروج از حساب</button> : auth.configured ? <a href="/api/auth/google">ورود امن با Google ↗</a> : <span className="connection-unavailable">پس از ثبت GOOGLE_CLIENT_SECRET در Vercel فعال می‌شود.</span>}
            <small>{checking ? "در حال بررسی..." : auth.configured ? "OAuth آماده پیکربندی نهایی" : "نیازمند تنظیم کلید OAuth در سرور"}</small>
          </div>
        </div>

        <div className="connection-card">
          <div className="connection-icon wallet-icon">＠</div>
          <div className="connection-body">
            <strong>اتصال جداگانه Gmail</strong>
            <p>{auth.gmailConnected ? "دسترسی خواندن ایمیل‌ها متصل است." : "برای نمایش حداکثر ۱۰ ایمیل اخیر، مجوز فقط‌خواندنی درخواست می‌شود."}</p>
            {auth.gmailConnected ? <><button type="button" onClick={async () => { const response = await fetch("/api/gmail/messages"); const data = await response.json(); setNotice(response.ok ? "اتصال Gmail فعال است؛ " + (data.messages?.length || 0) + " ایمیل اخیر قابل دریافت است." : data.error || "خطا در دریافت ایمیل‌ها."); }}>آزمایش دریافت ایمیل</button><button type="button" className="text-action" onClick={async () => { await fetch("/api/auth/gmail/disconnect", { method: "POST" }); await refreshAuth(); setNotice("دسترسی Gmail از این برنامه قطع شد."); }}>قطع اتصال Gmail</button></> : auth.connected ? <a href="/api/auth/gmail">اتصال Gmail با مجوز فقط‌خواندنی ↗</a> : <span className="connection-unavailable">ابتدا با ایمیل یا Google وارد شو.</span>}
            <small>مجوز Gmail فقط پس از تأیید در صفحه Google فعال می‌شود.</small>
          </div>
        </div>

        <div className="connection-card">
          <div className="connection-icon wallet-icon">₿</div>
          <div className="connection-body">
            <strong>کیف پول دریافت درآمد</strong>
            <p>فقط آدرس عمومی؛ عبارت بازیابی و کلید خصوصی را وارد نکن.</p>
            <input value={wallet} onChange={e => { setWallet(e.target.value); setSaved(false); }} placeholder="آدرس عمومی کیف پول (اختیاری)" aria-label="آدرس عمومی کیف پول" autoComplete="off" />
            <button type="button" onClick={saveWallet}>ذخیره آدرس در این دستگاه</button>
            <a href="https://www.okx.com/web3" target="_blank" rel="noreferrer">باز کردن OKX Web3 ↗</a>
            {saved && <small>آدرس در همین مرورگر ذخیره شد.</small>}
          </div>
        </div>
      </div>
      <p className="connection-actions" role="status">{notice || (checking ? "در حال بررسی وضعیت اتصال..." : "اطلاعات ورود در کوکی امن سرور نگهداری می‌شود؛ رمز و کلید خصوصی ذخیره محلی نمی‌شوند.")}</p>
      <p className="connection-safety">امنیت: رمز Gmail، کد یک‌بارمصرف و کلید خصوصی درخواست نمی‌شود. Gmail فقط با مجوز read-only متصل می‌شود. قطع اتصال در این برنامه، کوکی دسترسی را پاک و توکن Google را revoke می‌کند.</p>
    </section>
  );
}
