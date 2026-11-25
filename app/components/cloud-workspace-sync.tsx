"use client";

import { useEffect, useState } from "react";

type AuthStatus = { connected: boolean; profile: { email: string; name?: string } | null };
type Workspace = {
  opportunities: unknown[];
  deliveries: unknown[];
  income: unknown[];
  wallet: { address: string; network: string };
  kycRecords?: unknown[];
  kycResidence?: string;
  kycCitizenship?: string;
  kycBankCountry?: string;
};

const OWNER_KEY = "creativeops-cloud-owner-v1";
const RESTORE_BACKUP_KEY = "creativeops-cloud-restore-backup-v1";
const KEYS = {
  opportunities: "creativeops-opportunities-v1",
  deliveries: "creativeops-deliveries-v1",
  income: "creativeops-income-v1",
  wallet: "creativeops-wallet-v1"
};

function readLocal(): Workspace {
  const readText = (key: string, fallback: string) => localStorage.getItem(key) ?? fallback;
  const read = (key: string) => {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : null; }
    catch { return null; }
  };
  return {
    opportunities: read(KEYS.opportunities) ?? [],
    deliveries: read(KEYS.deliveries) ?? [],
    income: read(KEYS.income) ?? [],
    wallet: read(KEYS.wallet) ?? { address: "", network: "انتخاب شبکه هنگام برداشت" },
    kycRecords: read("creativeops-kyc-intelligence-v1") ?? [],
    kycResidence: readText("creativeops-kyc-residence-v2", "AM"),
    kycCitizenship: readText("creativeops-kyc-citizenship-v1", "IR"),
    kycBankCountry: readText("creativeops-kyc-bank-country-v1", "AM")
  };
}

function writeLocal(data: Workspace) {
  localStorage.setItem(KEYS.opportunities, JSON.stringify(data.opportunities));
  localStorage.setItem(KEYS.deliveries, JSON.stringify(data.deliveries));
  localStorage.setItem(KEYS.income, JSON.stringify(data.income));
  localStorage.setItem(KEYS.wallet, JSON.stringify(data.wallet));
  if (Array.isArray(data.kycRecords)) localStorage.setItem("creativeops-kyc-intelligence-v1", JSON.stringify(data.kycRecords));
  if (typeof data.kycResidence === "string") localStorage.setItem("creativeops-kyc-residence-v2", data.kycResidence);
  if (typeof data.kycCitizenship === "string") localStorage.setItem("creativeops-kyc-citizenship-v1", data.kycCitizenship);
  if (typeof data.kycBankCountry === "string") localStorage.setItem("creativeops-kyc-bank-country-v1", data.kycBankCountry);
}

export default function CloudWorkspaceSync() {
  const [status, setStatus] = useState("همگام‌سازی ابری پس از ورود فعال می‌شود.");
  const [busy, setBusy] = useState(false);
  const [hasRestoreBackup, setHasRestoreBackup] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    setHasRestoreBackup(Boolean(localStorage.getItem(RESTORE_BACKUP_KEY)));

    function preserveLocalBeforeRestore(email: string) {
      const local = readLocal();
      const hasLocal = local.opportunities.length > 0 ||
        local.deliveries.length > 0 ||
        local.income.length > 0 ||
        Boolean(local.wallet.address) ||
        Boolean(local.kycRecords?.length) ||
        local.kycResidence !== "AM" ||
        local.kycCitizenship !== "IR" ||
        local.kycBankCountry !== "AM";
      if (!hasLocal) return;
      localStorage.setItem(RESTORE_BACKUP_KEY, JSON.stringify({
        app: "AI Creative Earnings",
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        account: email,
        ...local
      }));
      setHasRestoreBackup(true);
    }

    async function pushLocal(): Promise<boolean> {
      const authResponse = await fetch("/api/auth/status", { cache: "no-store" });
      const auth = await authResponse.json() as AuthStatus;
      if (!auth.connected || !auth.profile?.email) {
        setStatus("برای ذخیره ابری و همگام‌سازی بین دستگاه‌ها وارد حساب کاربری شو.");
        return false;
      }
      const email = auth.profile.email.toLowerCase();
      const owner = localStorage.getItem(OWNER_KEY);
      if (owner && owner !== email) {
        setStatus("این مرورگر قبلاً برای حساب دیگری استفاده شده است. برای جلوگیری از انتقال یا بازنویسی اطلاعات بین حساب‌ها، همگام‌سازی خودکار متوقف شد؛ ابتدا از اطلاعات محلی فایل پشتیبان بگیر.");
        return false;
      }
      const response = await fetch("/api/workspace/sync", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readLocal())
      });
      if (!response.ok) throw new Error("ذخیره ابری انجام نشد.");
      localStorage.setItem(OWNER_KEY, email);
      return true;
    }

    async function syncNow() {
      if (stopped) return;
      setBusy(true);
      try {
        const authResponse = await fetch("/api/auth/status", { cache: "no-store" });
        const auth = await authResponse.json() as AuthStatus;
        if (!auth.connected || !auth.profile?.email) {
          setStatus("برای همگام‌سازی بین دستگاه‌ها وارد حساب کاربری شو.");
          return;
        }
        const email = auth.profile.email.toLowerCase();
        const owner = localStorage.getItem(OWNER_KEY);
        if (owner && owner !== email) {
          setStatus("این مرورگر قبلاً برای حساب دیگری استفاده شده است. برای جلوگیری از انتقال یا بازنویسی اطلاعات، همگام‌سازی متوقف شد؛ ابتدا از اطلاعات حساب قبلی پشتیبان بگیر و فضای محلی را جداگانه مدیریت کن.");
          return;
        }
        const response = await fetch("/api/workspace/sync", { cache: "no-store" });
        if (!response.ok) throw new Error("دریافت اطلاعات ابری ناموفق بود.");
        const remote = await response.json();
        const data = remote.data as Workspace | null;
        const hasRemote = Boolean(data && (
          data.opportunities?.length || data.deliveries?.length || data.income?.length ||
          data.kycRecords?.length || (data.wallet?.address && data.wallet.address.length > 0)
        ));
        if (hasRemote) {
          const marker = remote.updatedAt || "remote";
          if (localStorage.getItem("creativeops-cloud-version-v1") !== marker) {
            preserveLocalBeforeRestore(email);
            writeLocal(data!);
            localStorage.setItem("creativeops-cloud-version-v1", marker);
            localStorage.setItem(OWNER_KEY, email);
            setStatus("اطلاعات حساب از فضای ابری بازیابی شد.");
            window.location.reload();
            return;
          }
          localStorage.setItem(OWNER_KEY, email);
          setStatus("اطلاعات این حساب با فضای ابری همگام است.");
        } else {
          const saved = await pushLocal();
          if (saved) {
            setStatus("اطلاعات این دستگاه در فضای ابری ذخیره شد.");
          }
        }
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "خطا در همگام‌سازی.");
      } finally {
        if (!stopped) setBusy(false);
      }
    }

    function scheduleSync() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void pushLocal()
          .then(saved => { if (saved) setStatus("تغییرات در فضای ابری ذخیره شد."); })
          .catch(() => setStatus("ذخیره ابری ناموفق بود؛ فایل پشتیبان محلی را نگه دار."));
      }, 900);
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

  function downloadRestoreBackup() {
    const raw = localStorage.getItem(RESTORE_BACKUP_KEY);
    if (!raw) return;
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-creative-earnings-before-cloud-restore-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="cloud-sync-note" role="status" aria-live="polite">
      <span>{status}</span>
      <div className="cloud-sync-actions">
        {hasRestoreBackup && <button type="button" onClick={downloadRestoreBackup}>دانلود پشتیبان اطلاعات قبلی این دستگاه</button>}
        <button type="button" onClick={() => window.dispatchEvent(new Event("creativeops-cloud-sync-requested"))} disabled={busy}>
          {busy ? "در حال بررسی..." : "همگام‌سازی اکنون"}
        </button>
      </div>
    </div>
  );
}
