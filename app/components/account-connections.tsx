"use client";

import { useEffect, useState } from "react";

type AuthStatus = { connected: boolean; profile: { email: string; name?: string } | null; emailAuthConfigured?: boolean };

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
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  async function refreshAuth() {
    setChecking(true);
    try {
      const response = await fetch("/api/auth/status", { cache: "no-store" });
      setAuth(await response.json() as AuthStatus);
      window.dispatchEvent(new Event("creativeops-auth-changed"));
    } catch { setAuth({ connected: false, profile: null }); window.dispatchEvent(new Event("creativeops-auth-changed")); }
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
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") !== "recovery") return;
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token") || "";
    const refreshToken = hash.get("refresh_token") || "";
    const tokenType = hash.get("type") || "";
    const expiresIn = Number(hash.get("expires_in") || 3600);
    window.history.replaceState({}, document.title, window.location.pathname);
    if (!accessToken || !refreshToken || tokenType !== "recovery") {
      setNotice("لینک بازیابی ناقص یا منقضی شده است؛ یک لینک تازه درخواست کن.");
      return;
    }
    setBusy(true);
    void fetch("/api/auth/email/recovery-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn, type: tokenType })
    }).then(async response => {
      const data = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "تأیید لینک بازیابی ناموفق بود.");
      setRecoveryMode(true);
      setNotice(data.message || "رمز جدید را وارد کن.");
    }).catch(error => setNotice(error instanceof Error ? error.message : "تأیید لینک بازیابی ناموفق بود."))
      .finally(() => setBusy(false));
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

  async function requestPasswordReset() {
    if (!email.trim()) { setNotice("ابتدا ایمیل حساب را وارد کن."); return; }
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/auth/email/recover", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "درخواست بازیابی ارسال نشد.");
      setNotice(data.message || "اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال می‌شود.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "خطای نامشخص");
    } finally { setBusy(false); }
  }

  async function submitRecoveryPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/auth/email/password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "تغییر رمز انجام نشد.");
      setRecoveryMode(false);
      setNewPassword("");
      setPassword("");
      setNotice(data.message || "رمز عبور تغییر کرد؛ اکنون با رمز جدید وارد شو.");
      await fetch("/api/auth/logout", { method: "POST" });
      await refreshAuth();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "خطای نامشخص در تغییر رمز.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshAuth();
    setPassword("");
    setNotice("از حساب خارج شدی.");
  }

  function saveWallet() {
    localStorage.setItem("creativeops-connections-v1", JSON.stringify({ wallet: wallet.trim() }));
    setSaved(true);
  }

  return (
    <section className="panel connections-panel" id="accounts">
      <div className="panel-head">
        <div><span className="eyebrow">ACCOUNT ACCESS</span><h2>حساب کاربری</h2></div>
        <span className="free-tag">رایگان برای شروع</span>
      </div>
      <p className="connection-intro">برای ورود و نگهداری نشست کاربری فقط از ایمیل و رمز عبور استفاده می‌شود. اطلاعات ورود از طریق Supabase Auth مدیریت می‌شود.</p>

      <div className="connection-grid">
        <div className="connection-card">
          <div className="connection-icon">✉</div>
          <div className="connection-body">
            <strong>ورود با ایمیل و رمز عبور</strong>
            {recoveryMode ? <>
              <form onSubmit={submitRecoveryPassword}>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="رمز عبور جدید (حداقل ۸ نویسه)" autoComplete="new-password" minLength={8} maxLength={128} required />
                <button type="submit" disabled={busy || newPassword.length < 8}>{busy ? "در حال ذخیره..." : "ثبت رمز جدید"}</button>
              </form>
            </> : auth.connected ? <>
              <p>وارد شده‌ای: {auth.profile?.email}</p>
              <button type="button" onClick={logout}>خروج از حساب</button>
            </> : <>
              <form onSubmit={submitEmail}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ایمیل" autoComplete="email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "login" ? "رمز عبور" : "رمز عبور (حداقل ۸ کاراکتر)"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required />
                <button type="submit" disabled={busy}>{busy ? "در حال انجام..." : mode === "login" ? "ورود" : "ساخت حساب"}</button>
              </form>
              <button type="button" className="text-action" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setNotice(""); }}>{mode === "login" ? "ساخت حساب جدید" : "قبلاً حساب ساخته‌ام، ورود"}</button>
              {mode === "login" && <button type="button" className="text-action" onClick={requestPasswordReset} disabled={busy}>فراموشی رمز عبور / ارسال لینک بازیابی</button>}
            </>}
            <small>{checking ? "در حال بررسی وضعیت حساب..." : auth.emailAuthConfigured ? "ورود ایمیلی فعال است." : "تنظیمات Supabase در سرور کامل نیست."}</small>
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
      <p className="connection-actions" role="status">{notice || (checking ? "در حال بررسی..." : "رمز عبور در برنامه ذخیره نمی‌شود و نشست ورود در کوکی امن نگهداری می‌شود.")}</p>
      <p className="connection-safety">امنیت: هیچ رمز Gmail، کد یک‌بارمصرف یا کلید خصوصی درخواست نمی‌شود. ورود فقط با ایمیل و رمز عبور انجام می‌شود.</p>
    </section>
  );
}
