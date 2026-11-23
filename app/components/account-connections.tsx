"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "creativeops-connections-v1";
type SavedConnections = { email: string; wallet: string };
type AuthStatus = { connected: boolean; profile: { email: string; name?: string; picture?: string } | null; configured?: boolean };

export default function AccountConnections() {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [saved, setSaved] = useState(false);
  const [auth, setAuth] = useState<AuthStatus>({ connected: false, profile: null });
  const [checking, setChecking] = useState(true);

  async function refreshAuth() {
    setChecking(true);
    try {
      const response = await fetch("/api/auth/status", { cache: "no-store" });
      const data = await response.json() as AuthStatus;
      setAuth(data);
    } catch { setAuth({ connected: false, profile: null }); }
    finally { setChecking(false); }
  }

  useEffect(() => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value) {
        const parsed = JSON.parse(value) as SavedConnections;
        setEmail(parsed.email || "");
        setWallet(parsed.wallet || "");
      }
    } catch { /* ignore invalid local data */ }
    void refreshAuth();
  }, []);

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: email.trim(), wallet: wallet.trim() }));
    setSaved(true);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshAuth();
  }

  return (
    <section className="panel connections-panel" id="accounts">
      <div className="panel-head">
        <div><span className="eyebrow">ACCOUNT CONNECTIONS</span><h2>حساب‌ها و روش دریافت درآمد</h2></div>
        <span className="free-tag">همان Gmail قبلی</span>
      </div>
      <p className="connection-intro">ورود Google از مسیر OAuth رسمی انجام می‌شود. رمز و کد تأیید در اختیار این داشبورد قرار نمی‌گیرد. کیف پول فقط برای ثبت آدرس عمومی دریافت درآمد است.</p>
      <div className="connection-grid">
        <div className="connection-card">
          <div className="connection-icon">G</div>
          <div className="connection-body">
            <strong>حساب Google / Gmail</strong>
            <p>{auth.connected ? `متصل: ${auth.profile?.email || ""}` : auth.configured === false ? "اتصال Google هنوز از سمت سرور پیکربندی نشده است." : "برای اتصال، با همان حساب Gmail قدیمی وارد Google شو."}</p>
            {auth.connected ? (
              <button type="button" onClick={logout}>قطع اتصال Google</button>
            ) : auth.configured ? (
              <a href="/api/auth/google">اتصال امن با Google ↗</a>
            ) : (
              <span className="connection-unavailable">اتصال پس از تنظیم امن متغیرهای سرور فعال می‌شود.</span>
            )}
            <small>{checking ? "در حال بررسی وضعیت اتصال..." : auth.connected ? "ورود OAuth فعال است." : auth.configured ? "آماده ورود با Gmail قبلی." : "نیازمند تنظیم OAuth در Vercel؛ هیچ رمز یا کدی را اینجا وارد نکن."}</small>
          </div>
        </div>
        <div className="connection-card">
          <div className="connection-icon wallet-icon">₿</div>
          <div className="connection-body">
            <strong>کیف پول دریافت درآمد</strong>
            <p>فقط آدرس عمومی کیف پول؛ عبارت بازیابی و کلید خصوصی را هرگز وارد نکن.</p>
            <input value={wallet} onChange={e => { setWallet(e.target.value); setSaved(false); }} placeholder="آدرس عمومی کیف پول (اختیاری)" aria-label="آدرس عمومی کیف پول" />
            <a href="https://www.okx.com/web3" target="_blank" rel="noreferrer">باز کردن OKX Web3 ↗</a>
          </div>
        </div>
      </div>
      <div className="connection-actions">
        <button type="button" onClick={save}>ذخیره آدرس کیف پول در این دستگاه</button>
        <span role="status">{saved ? "آدرس عمومی در این مرورگر ذخیره شد." : "اطلاعات کیف پول فقط در همین دستگاه ذخیره می‌شود."}</span>
      </div>
      <p className="connection-safety">امنیت: رمز Gmail، کد یک‌بارمصرف، کلید خصوصی و عبارت بازیابی درخواست نمی‌شود. برای فعال شدن OAuth باید شناسه و کلید محرمانه Google فقط در Environment Variables سرور Vercel تنظیم شوند.</p>
    </section>
  );
}
