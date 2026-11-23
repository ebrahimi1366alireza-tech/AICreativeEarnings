"use client";

import { useEffect, useState } from "react";

type Workspace = {
  opportunities: unknown[];
  deliveries: unknown[];
  income: unknown[];
  wallet: { address: string; network: string };
};

const KEYS = {
  opportunities: "creativeops-opportunities-v1",
  deliveries: "creativeops-deliveries-v1",
  income: "creativeops-income-v1",
  wallet: "creativeops-wallet-v1"
};

function readLocal(): Workspace {
  const read = (key: string) => {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : null; }
    catch { return null; }
  };
  return {
    opportunities: read(KEYS.opportunities) ?? [],
    deliveries: read(KEYS.deliveries) ?? [],
    income: read(KEYS.income) ?? [],
    wallet: read(KEYS.wallet) ?? { address: "", network: "EVM - انتخاب شبکه هنگام برداشت" }
  };
}

function writeLocal(data: Workspace) {
  localStorage.setItem(KEYS.opportunities, JSON.stringify(data.opportunities));
  localStorage.setItem(KEYS.deliveries, JSON.stringify(data.deliveries));
  localStorage.setItem(KEYS.income, JSON.stringify(data.income));
  localStorage.setItem(KEYS.wallet, JSON.stringify(data.wallet));
}

export default function CloudWorkspaceSync() {
  const [status, setStatus] = useState("همگام‌سازی ابری پس از ورود فعال می‌شود.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    async function pushLocal() {
      const authResponse = await fetch("/api/auth/status", { cache: "no-store" });
      const auth = await authResponse.json();
      if (!auth.connected) { setStatus("برای ذخیره ابری و همگام‌سازی بین دستگاه‌ها وارد حساب کاربری شو."); return; }
      const response = await fetch("/api/workspace/sync", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readLocal())
      });
      if (!response.ok) throw new Error("ذخیره ابری انجام نشد.");
    }

    async function syncNow() {
      if (stopped) return;
      setBusy(true);
      try {
        const authResponse = await fetch("/api/auth/status", { cache: "no-store" });
        const auth = await authResponse.json();
        if (!auth.connected) {
          setStatus("برای همگام‌سازی بین دستگاه‌ها وارد حساب کاربری شو.");
          return;
        }
        const response = await fetch("/api/workspace/sync", { cache: "no-store" });
        if (!response.ok) throw new Error("دریافت اطلاعات ابری ناموفق بود.");
        const remote = await response.json();
        const data = remote.data as Workspace | null;
        const hasRemote = Boolean(data && (
          data.opportunities?.length || data.deliveries?.length || data.income?.length ||
          (data.wallet?.address && data.wallet.address.length > 0)
        ));
        if (hasRemote) {
          const marker = remote.updatedAt || "remote";
          if (localStorage.getItem("creativeops-cloud-version-v1") !== marker) {
            writeLocal(data!);
            localStorage.setItem("creativeops-cloud-version-v1", marker);
            setStatus("اطلاعات حساب از فضای ابری بازیابی شد.");
            window.location.reload();
            return;
          }
          setStatus("اطلاعات این حساب با فضای ابری همگام است.");
        } else {
          await pushLocal();
          setStatus("اطلاعات این دستگاه در فضای ابری ذخیره شد.");
        }
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "خطا در همگام‌سازی.");
      } finally {
        if (!stopped) setBusy(false);
      }
    }

    function scheduleSync() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { void pushLocal().then(() => setStatus("تغییرات در فضای ابری ذخیره شد.")).catch(() => setStatus("ذخیره ابری ناموفق بود؛ فایل پشتیبان محلی را نگه دار.")); }, 900);
    }

    const handleAuthChanged = () => { void syncNow(); };
    const handleManualSync = () => { void syncNow(); };
    window.addEventListener("creativeops-workspace-changed", scheduleSync);
    window.addEventListener("creativeops-auth-changed", handleAuthChanged);
    window.addEventListener("creativeops-cloud-sync-requested", handleManualSync);
    void syncNow();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("creativeops-workspace-changed", scheduleSync);
      window.removeEventListener("creativeops-auth-changed", handleAuthChanged);
      window.removeEventListener("creativeops-cloud-sync-requested", handleManualSync);
    };
  }, []);

  return (
    <div className="cloud-sync-note" role="status" aria-live="polite">
      <span>{status}</span>
      <button type="button" onClick={() => window.dispatchEvent(new Event("creativeops-cloud-sync-requested"))} disabled={busy}>
        {busy ? "در حال بررسی..." : "همگام‌سازی اکنون"}
      </button>
    </div>
  );
}
