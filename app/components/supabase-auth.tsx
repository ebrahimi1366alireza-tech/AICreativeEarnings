"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function SupabaseAuth() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (active) {
        setUser(error ? null : data.user);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function sendSignInLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: true
        }
      });
      if (error) throw error;
      setMessage("لینک ورود و تأیید به ایمیلت ارسال شد. صندوق ورودی و پوشه Spam را بررسی کن.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ارسال لینک ورود ناموفق بود.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : "از حساب خارج شدی.");
    setBusy(false);
  }

  return (
    <section className="panel connections-panel" id="supabase-account">
      <div className="panel-head">
        <div><span className="eyebrow">SUPABASE AUTH</span><h2>ورود و ساخت حساب پروژه</h2></div>
        <span className="free-tag">بدون رمز عبور</span>
      </div>
      {user ? (
        <div className="connection-card">
          <div className="connection-icon">✓</div>
          <div className="connection-body">
            <strong>حساب پروژه متصل است</strong>
            <p>{user.email}</p>
            <small>شناسه حساب برای دسترسی امن به داده‌های شخصی استفاده می‌شود.</small>
            <button type="button" onClick={signOut} disabled={busy}>خروج از حساب</button>
          </div>
        </div>
      ) : (
        <>
          <p className="connection-intro">با همان Gmail قبلی وارد شو. اگر حسابی وجود نداشته باشد، Supabase حساب جدید می‌سازد و لینک تأیید می‌فرستد. رمز Gmail یا کد ورود را در این سایت وارد نمی‌کنی.</p>
          <form className="opportunity-form" onSubmit={sendSignInLink}>
            <input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="آدرس Gmail قبلی" aria-label="ایمیل ورود" />
            <button type="submit" disabled={busy}>{busy ? "در حال ارسال..." : "ارسال لینک ورود / ثبت‌نام"}</button>
          </form>
        </>
      )}
      <p className="backup-notice" role="status">{message || "ورود از طریق لینک یک‌بارمصرف ایمیل انجام می‌شود؛ رمز عبور لازم نیست."}</p>
    </section>
  );
}
