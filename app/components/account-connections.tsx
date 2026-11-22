"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "creativeops-connections-v1";

type SavedConnections = { email: string; wallet: string };

export default function AccountConnections() {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value) {
        const parsed = JSON.parse(value) as SavedConnections;
        setEmail(parsed.email || "");
        setWallet(parsed.wallet || "");
      }
    } catch { /* ignore invalid local data */ }
  }, []);

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: email.trim(), wallet: wallet.trim() }));
    setSaved(true);
  }

  return (
    <section className="panel connections-panel" id="accounts">
      <div className="panel-head">
        <div><span className="eyebrow">ACCOUNT CONNECTIONS</span><h2>حساب‌ها و روش دریافت درآمد</h2></div>
        <span className="free-tag">بدون ساخت حساب جدید</span>
      </div>
      <p className="connection-intro">از همان Gmail قدیمی برای ورود به سرویس‌های تولید استفاده می‌کنیم. این بخش فقط مشخصات عمومی را در همین مرورگر نگه می‌دارد؛ ورود واقعی در سایت هر سرویس انجام می‌شود.</p>
      <div className="connection-grid">
        <div className="connection-card">
          <div className="connection-icon">G</div>
          <div className="connection-body">
            <strong>حساب Google / Gmail</strong>
            <p>همان حساب قدیمی را وارد کن و برای ورود به سرویس‌ها از دکمه زیر استفاده کن.</p>
            <input value={email} onChange={e => { setEmail(e.target.value); setSaved(false); }} type="email" placeholder="آدرس Gmail قدیمی" aria-label="آدرس Gmail قدیمی" />
            <a href="https://accounts.google.com/" target="_blank" rel="noreferrer">باز کردن ورود Google ↗</a>
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
        <button type="button" onClick={save}>ذخیره مشخصات در این دستگاه</button>
        <span role="status">{saved ? "مشخصات ذخیره شد؛ هنوز ورود خارجی تأیید نشده است." : "وضعیت ورود: هنوز به سرویس خارجی متصل نشده"}</span>
      </div>
      <p className="connection-safety">امنیت: این داشبورد رمز Gmail، کد یک‌بارمصرف، کلید خصوصی یا عبارت بازیابی نمی‌خواهد. اتصال OAuth واقعی پس از تنظیم شناسه رسمی Google در محیط امن سرور فعال می‌شود.</p>
    </section>
  );
}
