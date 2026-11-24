"use client";

import { useEffect, useState } from "react";
import AccountConnections from "./components/account-connections";
import CloudWorkspaceSync from "./components/cloud-workspace-sync";
import OpportunityDiscovery from "./components/opportunity-discovery";

const workflow = [
  { number: "۰۱", title: "کشف فرصت‌ها", detail: "جست‌وجوی زنده در فیدهای عمومی جهانی؛ آگهی‌ها هنوز سفارش تأییدشده نیستند", state: "فعال · بررسی اولیه" },
  { number: "۰۲", title: "بررسی شرایط", detail: "تأیید دستی KYC، کشور مجاز، پرداخت مستقیم رمزارزی، کارمزد و نبود سپرده", state: "نیازمند بررسی هر فرصت" },
  { number: "۰۳", title: "تولید محتوا", detail: "آماده‌سازی متن، تحقیق، طرح و سناریو با ابزارهای رایگان و مجاز", state: "آماده اجرا با تأیید ابزار" },
  { number: "۰۴", title: "کنترل کیفیت", detail: "بازبینی محتوا، حقوق تجاری، قالب و تطبیق با شرح سفارش", state: "آماده بازبینی" },
  { number: "۰۵", title: "تحویل و درآمد", detail: "ثبت تحویل و درآمد واقعی پس از پرداخت؛ ارسال و دریافت خودکار فعال نیست", state: "ثبت دستی · پرداخت تأییدنشده" }
];

const tools = [
  { name: "Dreamina", note: "ساخت تصویر و ویدئو با هوش مصنوعی؛ اعتبار رایگان، دسترسی منطقه‌ای و مجوز تجاری را داخل حساب بررسی کن.", status: "برای نمونه‌کار عکس و ویدئو", mark: "DREAMINA", url: "https://dreamina.capcut.com/" },
  { name: "Krea", note: "تولید و ویرایش تصویر و ویدئو؛ پلن رایگان فعلی ۱۰۰ واحد روزانه دارد. صفحه قیمت‌گذاری فعلی مجوز تجاری را نیز ذکر می‌کند؛ شرایط هر مدل و سرویس را پیش از تحویل تجاری بررسی کن. API جدا از اشتراک وب‌اپ و بر اساس هر تولید هزینه‌گذاری می‌شود.", status: "اتصال ابزار به ChatGPT فعال؛ وب‌اپ رایگان ۱۰۰ واحد روزانه؛ API ممکن است هزینه جدا داشته باشد", mark: "KREA", url: "https://www.krea.ai/" },
  { name: "Canva", note: "طراحی پوستر، تبلیغات، تصاویر محصول و محتوای شبکه‌های اجتماعی؛ امکانات AI رایگان محدود است.", status: "برای طراحی و آماده‌سازی فایل مشتری", mark: "CANVA", url: "https://www.canva.com/" },
  { name: "CapCut", note: "تدوین ویدئو، زیرنویس و صداگذاری؛ برخی قابلیت‌ها و دارایی‌ها پولی یا منطقه‌ای هستند.", status: "برای تدوین و خروجی نهایی ویدئو", mark: "CAPCUT", url: "https://www.capcut.com/" },
  { name: "ElevenLabs", note: "تولید صدا و موسیقی با هوش مصنوعی؛ سهمیه رایگان و مجوز استفاده تجاری به طرح و نوع خروجی بستگی دارد.", status: "پیش از سفارش پولی، مجوز تجاری را بررسی کن", mark: "ELEVENLABS", url: "https://elevenlabs.io/" },
  { name: "ChatGPT", note: "کمک در تحقیق، طرح مقاله، نگارش، بازنویسی، ویرایش و کنترل کیفیت محتوا.", status: "دستیار اصلی مسیر مقاله و متن", mark: "CHATGPT", url: "https://chatgpt.com/" },
  { name: "Google Docs", note: "نگارش، قالب‌بندی، بازبینی و آماده‌سازی نسخه نهایی برای تحویل به مشتری.", status: "برای تنظیم و تحویل مقاله", mark: "GOOGLE DOCS", url: "https://docs.google.com/" },
  { name: "Notion", note: "مدیریت اسناد و محتوای پروژه؛ بازبینی املا، دستور زبان و روانی متن انگلیسی را ChatGPT انجام می‌دهد.", status: "متصل به ChatGPT؛ مدیریت اسناد و بازبینی نگارش", mark: "NOTION", url: "https://www.notion.so/" }
];

type Opportunity = { id: string; title: string; platform: string; pay: string; status: string; stream?: string; country?: string; payout?: string; network?: string; minimum?: string; fee?: string; kyc?: string; proofUrl?: string; writingType?: string; contentLanguage?: string; wordCount?: string; deadline?: string; seoRequired?: string; commercialRights?: string };
type Delivery = { id: string; title: string; client: string; due: string; status: string };
type Income = { id: string; source: string; amount: number; currency: string; received: boolean; date: string };

const DEFAULT_WALLET_ADDRESS = "";
const LEGACY_PLACEHOLDER_WALLET_ADDRESS = "0x9f53b26aec605212f239c33e1017c5d2d188eb4c";
const INITIAL_OPPORTUNITIES: Opportunity[] = [
  { id: "laborx-2026", title: "سفارش‌های فریلنسری نوشتن و طراحی با پرداخت رمزارزی", platform: "LaborX", pay: "مبلغ توافقی در قرارداد و سفارش", status: "نیازمند بررسی", stream: "نوشتن و مقاله / عکس و ویدئو", country: "پذیرش کشور محل اقامت و محدودیت‌های قانونی باید پیش از ثبت‌نام بررسی شود؛ ادعای جهانی بودن جای بررسی حساب را نمی‌گیرد", payout: "پرداخت رمزارزی از مسیر قرارداد و امانت‌داری پلتفرم؛ مقصد و شرایط برداشت داخل حساب تأیید شود", network: "Ethereum و BNB Chain؛ از جمله USDT و USDC", minimum: "در منبع رسمی بررسی‌شده مشخص نشده", fee: "۱۰٪ کارمزد فریلنسر برای هر سفارش؛ Premium برای نرخ پایه اجباری نیست", kyc: "در منبع رسمی بررسی‌شده مشخص نشده", proofUrl: "https://laborx.com/vacancies/crypto" },
  { id: "subnano-2026", title: "فروش مقاله و محتوای دیجیتال", platform: "Subnano", pay: "فروش تکی؛ درآمد فقط با خرید واقعی محتوا یا انعام", status: "نیازمند بررسی", stream: "نوشتن و مقاله / فایل و محتوای دیجیتال", country: "دسترسی و شرایط پذیرش کشور محل اقامت هنوز باید در زمان ساخت حساب بررسی شود", payout: "سهم سازنده پس از تأیید هر پرداخت به‌صورت خودکار ارسال می‌شود؛ موجودی برای برداشت تجمیع نمی‌شود", network: "Nano (XNO) یا USDC بومی روی Base", minimum: "حداقل موجودی/نوبت برداشت ندارد؛ فروش به‌ازای هر پرداخت", fee: "۷.۵٪ فروش Nano؛ ۱۵٪ فروش USDC", kyc: "ورود با ایمیل یا کیف پول؛ الزام KYC در FAQ مشخص نشده", proofUrl: "https://subnano.ai/faq" }
];

export default function Home() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [walletAddress, setWalletAddress] = useState(DEFAULT_WALLET_ADDRESS);
  const [walletNetwork, setWalletNetwork] = useState("EVM - انتخاب شبکه هنگام برداشت");
  const [walletNotice, setWalletNotice] = useState("");
  const receivedUsdt = income.filter(item => item.received && item.currency === "USDT").reduce((sum, item) => sum + item.amount, 0);
  const goalProgress = Math.min(100, Math.max(0, receivedUsdt / 50 * 100));
  useEffect(() => {
    try {
      const saved = localStorage.getItem("creativeops-opportunities-v1");
      const seededMarker = localStorage.getItem("creativeops-initial-leads-seeded-v1");
      if (saved) {
        const existing = JSON.parse(saved) as Opportunity[];
        if (!seededMarker) {
          const existingIds = new Set(existing.map(item => item.id));
          setOpportunities([...existing, ...INITIAL_OPPORTUNITIES.filter(item => !existingIds.has(item.id))]);
          localStorage.setItem("creativeops-initial-leads-seeded-v1", "1");
        } else {
          setOpportunities(existing);
        }
      } else {
        setOpportunities(INITIAL_OPPORTUNITIES);
        localStorage.setItem("creativeops-initial-leads-seeded-v1", "1");
      }
      const savedDeliveries = localStorage.getItem("creativeops-deliveries-v1");
      if (savedDeliveries) setDeliveries(JSON.parse(savedDeliveries) as Delivery[]);
      const savedIncome = localStorage.getItem("creativeops-income-v1");
      if (savedIncome) setIncome(JSON.parse(savedIncome) as Income[]);
    } catch { /* ignore invalid local data */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) { localStorage.setItem("creativeops-opportunities-v1", JSON.stringify(opportunities)); window.dispatchEvent(new Event("creativeops-workspace-changed")); }
  }, [opportunities, loaded]);
  useEffect(() => { if (loaded) { localStorage.setItem("creativeops-deliveries-v1", JSON.stringify(deliveries)); localStorage.setItem("creativeops-income-v1", JSON.stringify(income)); window.dispatchEvent(new Event("creativeops-workspace-changed")); } }, [deliveries, income, loaded]);
  useEffect(() => {
    if (!loaded) return;
    const savedWallet = localStorage.getItem("creativeops-wallet-v1");
    if (savedWallet) {
      try {
        const parsed = JSON.parse(savedWallet) as { address?: unknown; network?: unknown };
        const storedAddress = typeof parsed.address === "string" ? parsed.address : "";
        if (storedAddress === LEGACY_PLACEHOLDER_WALLET_ADDRESS) {
          setWalletAddress("");
          localStorage.setItem("creativeops-wallet-v1", JSON.stringify({ address: "", network: typeof parsed.network === "string" ? parsed.network : "EVM - انتخاب شبکه هنگام برداشت" }));
        } else {
          setWalletAddress(storedAddress);
        }
        if (typeof parsed.network === "string") setWalletNetwork(parsed.network);
      } catch { /* ignore invalid wallet data */ }
    } else {
      localStorage.setItem("creativeops-wallet-v1", JSON.stringify({ address: DEFAULT_WALLET_ADDRESS, network: "EVM - انتخاب شبکه هنگام برداشت" }));
    }
  }, [loaded]);
  function saveWallet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = walletAddress.trim();
    if (address && !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setWalletNotice("آدرس واردشده معتبر نیست؛ آدرس EVM باید با 0x شروع شود و ۴۰ رقم هگزادسیمال داشته باشد.");
      return;
    }
    localStorage.setItem("creativeops-wallet-v1", JSON.stringify({ address, network: walletNetwork }));
    window.dispatchEvent(new Event("creativeops-workspace-changed"));
    setWalletAddress(address);
    setWalletNotice(address ? "آدرس عمومی در همین مرورگر ذخیره شد. این کار به معنی تأیید AML یا انجام تراکنش نیست." : "آدرس کیف پول از این دستگاه پاک شد.");
  }
  async function copyWallet() {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setWalletNotice("آدرس کیف پول کپی شد.");
    } catch {
      setWalletNotice("کپی خودکار در این مرورگر در دسترس نیست؛ آدرس را دستی انتخاب و کپی کن.");
    }
  }
  function addDelivery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const title = String(form.get("deliveryTitle") || "").trim(); if (!title) return;
    setDeliveries(rows => [{ id: crypto.randomUUID(), title, client: String(form.get("client") || "نامشخص"), due: String(form.get("due") || ""), status: "در حال آماده‌سازی" }, ...rows]); event.currentTarget.reset();
  }
  function addIncome(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const source = String(form.get("incomeSource") || "").trim(); const amount = Number(form.get("amount")); const currency = String(form.get("currency") || "USDT"); if (!source || !Number.isFinite(amount) || amount <= 0 || !["USDT", "USDC", "XNO"].includes(currency)) return;
    setIncome(rows => [{ id: crypto.randomUUID(), source, amount, currency, received: form.get("received") === "on", date: new Date().toISOString().slice(0,10) }, ...rows]); event.currentTarget.reset();
  }
  function addOpportunity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return;
    setOpportunities(current => [{ id: crypto.randomUUID(), title, platform: String(form.get("platform") || "نامشخص"), pay: String(form.get("pay") || "نامشخص"), status: "نیازمند بررسی", stream: String(form.get("stream") || "نامشخص"), country: String(form.get("country") || "نامشخص"), payout: String(form.get("payout") || "نامشخص"), network: String(form.get("network") || "نامشخص"), minimum: String(form.get("minimum") || "نامشخص"), fee: String(form.get("fee") || "نامشخص"), kyc: String(form.get("kyc") || "نامشخص"), proofUrl: String(form.get("proofUrl") || "").trim() }, ...current]);
    event.currentTarget.reset();
  }
  function updateStatus(id: string, status: string) {
    setOpportunities(current => current.map(item => item.id === id ? { ...item, status } : item));
  }
  function removeOpportunity(id: string) {
    setOpportunities(current => current.filter(item => item.id !== id));
  }

  const [backupNotice, setBackupNotice] = useState("");
  const [hasPreImportBackup, setHasPreImportBackup] = useState(false);
  useEffect(() => {
    setHasPreImportBackup(Boolean(localStorage.getItem("creativeops-pre-import-backup-v1")));
  }, []);

  function exportBackup() {
    const backup = {
      app: "AI Creative Earnings",
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      opportunities,
      deliveries,
      income,
      wallet: { address: walletAddress, network: walletNetwork }
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-creative-earnings-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBackupNotice("فایل پشتیبان ساخته شد. آن را در جای امن نگه دار.");
  }

  function downloadPreImportBackup() {
    const raw = localStorage.getItem("creativeops-pre-import-backup-v1");
    if (!raw) return;
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-creative-earnings-before-import-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object") throw new Error("invalid");
      const data = parsed as { app?: unknown; schemaVersion?: unknown; opportunities?: unknown; deliveries?: unknown; income?: unknown; wallet?: unknown };
      const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
      const validOpportunities = Array.isArray(data.opportunities) && data.opportunities.every(item => isRecord(item) && typeof item.id === "string" && typeof item.title === "string" && typeof item.status === "string");
      const validDeliveries = Array.isArray(data.deliveries) && data.deliveries.every(item => isRecord(item) && typeof item.id === "string" && typeof item.title === "string" && typeof item.status === "string");
      const validIncome = Array.isArray(data.income) && data.income.every(item => isRecord(item) && typeof item.id === "string" && typeof item.source === "string" && typeof item.amount === "number" && Number.isFinite(item.amount) && typeof item.received === "boolean");
      const validWallet = data.wallet === undefined || (isRecord(data.wallet) && typeof data.wallet.address === "string" && (data.wallet.address === "" || /^0x[a-fA-F0-9]{40}$/.test(data.wallet.address)) && typeof data.wallet.network === "string");
      if (data.app !== "AI Creative Earnings" || data.schemaVersion !== 1 || !validOpportunities || !validDeliveries || !validIncome || !validWallet) throw new Error("invalid");
      if (!window.confirm("اطلاعات فعلی جایگزین اطلاعات داخل فایل پشتیبان شود؟ قبل از ادامه، از داده‌های فعلی خروجی بگیر.")) {
        event.target.value = "";
        return;
      }
      const currentBackup = {
        app: "AI Creative Earnings",
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        backupReason: "automatic-before-import",
        opportunities,
        deliveries,
        income,
        wallet: { address: walletAddress, network: walletNetwork }
      };
      localStorage.setItem("creativeops-pre-import-backup-v1", JSON.stringify(currentBackup, null, 2));
      setHasPreImportBackup(true);
      setOpportunities(data.opportunities as Opportunity[]);
      setDeliveries(data.deliveries as Delivery[]);
      setIncome(data.income as Income[]);
      if (data.wallet && typeof data.wallet === "object" && "address" in data.wallet && "network" in data.wallet) {
        const restoredWallet = data.wallet as { address: string; network: string };
        setWalletAddress(restoredWallet.address);
        setWalletNetwork(restoredWallet.network);
        localStorage.setItem("creativeops-wallet-v1", JSON.stringify(restoredWallet));
        window.dispatchEvent(new Event("creativeops-workspace-changed"));
      }
      setBackupNotice("اطلاعات فایل پشتیبان با موفقیت در این دستگاه بازیابی شد.");
    } catch {
      setBackupNotice("فایل معتبر نیست یا با نسخه پشتیبان این برنامه سازگار نیست.");
    } finally {
      event.target.value = "";
    }
  }
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">✳</span><div><strong>CreativeOps</strong><small>AI EARNINGS STUDIO</small></div></div>
        <div className="side-label">فضای کاری</div>
        <a className="nav-item active" href="#overview"><span>▦</span> نمای کلی</a>
        <a className="nav-item" href="#opportunities"><span>⌕</span> فرصت‌های درآمدی</a>
        <a className="nav-item" href="#production"><span>▧</span> استودیو تولید</a>
        <a className="nav-item" href="#income-hub"><span>✳</span> مرکز درآمد چندگانه</a>
        <a className="nav-item" href="#tools"><span>◈</span> ابزارهای هوش مصنوعی</a>
        <a className="nav-item" href="#accounts"><span>◎</span> اتصال حساب‌ها</a>
        <a className="nav-item" href="#deliveries"><span>⇧</span> تحویل‌ها</a>
        <a className="nav-item" href="#finance"><span>＄</span> درآمدها</a>
        <div className="sidebar-bottom"><div className="avatar">AI</div><div><strong>مدیریت پروژه</strong><small>نسخه آزمایشی شخصی</small></div></div>
      </aside>

      <section className="main" id="overview">
        <header className="topbar"><div><div className="eyebrow">WORKSPACE / OVERVIEW</div><h1>استودیوی درآمد خلاق</h1><p>از پیدا کردن سفارش تا آماده‌سازی خروجی، همه‌چیز در یک جا.</p></div><div className="top-actions"><span className="live-dot">● محیط آزمایشی</span><div className="date-chip">۲۳ نوامبر ۲۰۲۶</div></div></header>

        <section className="hero">
          <div className="hero-copy"><span className="pill">شروع بدون سرمایه</span><h2>اول سفارش معتبر،<br/><em>بعد تولید هوشمند.</em></h2><p>پنج مسیر درآمدی را مدیریت می‌کنیم؛ هر فرصت پیش از اقدام از نظر اعتبار، کشور مجاز و پرداخت مستقیم رمزارزی بررسی می‌شود. برای مقاله از ChatGPT و Google Docs استفاده می‌کنیم؛ مدیریت اسناد در Notion انجام می‌شود و بازبینی نگارش انگلیسی را ChatGPT انجام می‌دهد.</p><a className="hero-link" href="#workflow">مشاهده مسیر اجرا <span>←</span></a></div>
          <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="art-core">✳<small>AI</small></div><div className="float-card card-a">✦ تصویر</div><div className="float-card card-b">▶ ویدئو</div><div className="float-card card-c">↗ درآمد</div></div>
        </section>

        <div className="section-heading"><div><span className="eyebrow">PERFORMANCE</span><h2>نمای کلی عملکرد</h2></div><span className="muted">هنوز سفارش یا درآمدی ثبت نشده است</span></div>
        <section className="stats">
          <article className="stat-card"><span className="stat-icon purple">⌕</span><span className="stat-label">فرصت‌های ثبت‌شده</span><strong>{opportunities.length}</strong><small>فرصت‌های ذخیره‌شده در این مرورگر</small></article>
          <article className="stat-card"><span className="stat-icon blue">▧</span><span className="stat-label">سفارش‌های تولید ثبت‌شده</span><strong>{deliveries.length}</strong><small>سفارش‌های ثبت‌شده برای تولید</small></article>
          <article className="stat-card"><span className="stat-icon green">⇧</span><span className="stat-label">تحویل‌های موفق</span><strong>{deliveries.filter(item => item.status === "تحویل شد").length}</strong><small>تحویل‌های ثبت‌شده</small></article>
          <article className="stat-card"><span className="stat-icon amber">₮</span><span className="stat-label">درآمد رمزارزی دریافت‌شده</span><strong>{receivedUsdt.toFixed(2)} USDT</strong><small>فقط رمزارز دریافت‌شده به USDT</small></article>
        </section>

        <section className="content-grid" id="workflow">
          <div className="panel workflow-panel"><div className="panel-head"><div><span className="eyebrow">PIPELINE</span><h2>مراحل اجرای سفارش</h2></div><span className="counter">۰ از ۵</span></div><div className="workflow-list">{workflow.map((item) => <div className="workflow-row" key={item.number}><div className="step-number">{item.number}</div><div className="step-copy"><strong>{item.title}</strong><p>{item.detail}</p></div><span className="status">{item.state}</span></div>)}</div></div>
          <div className="panel goal-panel" id="finance"><span className="eyebrow">WEEKLY TARGET</span><h2>هدف هفته اول</h2><div className="goal-value">50 USDT</div><p>هدف آزمایشی است، نه درآمد تضمین‌شده. درآمد فقط پس از دریافت واقعی ثبت می‌شود.</p><div className="progress-track"><span style={{ width: `${goalProgress}%` }}></span></div><div className="goal-foot"><span>درآمد ثبت‌شده</span><strong>{receivedUsdt.toFixed(2)} / 50 USDT</strong></div><div className="goal-note">هزینه شروع موردنظر: <b>0</b></div></div>
        </section>

        <section className="panel tools-panel" id="tools"><div className="panel-head"><div><span className="eyebrow">PROJECT CREATIVE TOOLKIT</span><h2>ابزارهای پروژه و دسترسی‌ها</h2></div><span className="free-tag">اولویت با رایگان‌ها</span></div><div className="tool-grid">{tools.map((tool) => <article className="tool-card" key={tool.mark}><div className="tool-mark">{tool.mark}</div><div><strong>{tool.name}</strong><p>{tool.note}</p><small>{tool.status}</small><a href={tool.url} target="_blank" rel="noreferrer" style={{display:"inline-block",marginTop:7,color:"#b9a4ff",fontSize:10,textDecoration:"none"}}>بازکردن ابزار ↗</a></div></article>)}</div><p className="footnote">این ابزارها جعبه‌ابزار فعلی پروژه‌اند؛ Krea از طریق اتصال ChatGPT در دسترس است و بقیه ابزارها بر اساس دسترسی حساب کاربر استفاده می‌شوند. این فهرست به معنی اتصال به بازار سفارش یا تضمین درآمد نیست. سهمیه، دسترسی منطقه‌ای، واترمارک و مجوز تجاری را پیش از استفاده بررسی کن.</p></section>

        <AccountConnections />
        <CloudWorkspaceSync />

        <section className="panel income-hub" id="income-hub">
          <div className="panel-head"><div><span className="eyebrow">MULTI-STREAM INCOME</span><h2>مرکز درآمد چندگانه · AI Income Hub</h2><p className="hub-intro">پروژه مستقل AI Creative Earnings؛ هیچ بخش ایردراپ یا تسک رمزارزی AIRDROP AI در این داشبورد ادغام نمی‌شود.</p></div><span className="free-tag">شروع با هزینه صفر</span></div>
          <p className="hub-intro">پنج مسیر مستقل درآمدی: نگارش متن و مقاله، ساخت موسیقی، رأی‌گیری و داوری آهنگ، نظرسنجی و تحقیقات بازار، و تولید عکس و ویدئو. این برنامه کاملاً جدا از AIRDROP AI است؛ اطلاعات، کیف پول‌ها و گزارش‌های ایردراپ وارد این پروژه نمی‌شوند. هر فرصت پیش از شروع از نظر اعتبار، کشور مجاز، زمان، حداقل برداشت و روش پرداخت بررسی می‌شود.</p>
          <div className="crypto-only-policy"><strong>قانون برداشت: فقط رمزارز</strong><p>فقط فرصت‌هایی پذیرفته می‌شوند که برداشت مستقیم رمزارزی به کیف پول شخصی را پشتیبانی کنند. اولویت با USDT و شبکه کم‌کارمزدِ پشتیبانی‌شده است. PayPal، حواله بانکی و روش‌های فیات پذیرفته نیستند. روش برداشت، شبکه، کارمزد، حداقل برداشت و محدودیت کشور باید پیش از شروع تأیید شود.</p></div>
          <div className="income-module-grid">
            <article className="income-module">
              <div className="module-icon writing">✎</div><div className="module-kicker">01 · AI WRITING</div><h3>تولید متن و مقاله</h3>
              <p>مقاله، توضیحات محصول، محتوای وبلاگ، متن تبلیغاتی و ویرایش سفارش‌های مشتری.</p>
              <ul><li>سفارش‌های نگارش و ویرایش</li><li>محتوای فروشگاهی و سئو</li><li>بازبینی کیفیت و اصالت متن</li></ul>
              <span className="module-status">مرحله فعلی: آماده طراحی گردش‌کار</span>
              <a href="#opportunities">ثبت فرصت نگارش ←</a>
            </article>
            <article className="income-module">
              <div className="module-icon music">♫</div><div className="module-kicker">02 · AI MUSIC</div><h3>موسیقی و تولید صدا</h3>
              <p>ساخت موسیقی اختصاصی، افکت صوتی، صدای پس‌زمینه و فایل صوتی تبلیغاتی.</p>
              <ul><li>موسیقی تبلیغاتی و سینمایی</li><li>افکت صوتی و صداگذاری</li><li>کنترل مجوز تجاری و حقوق خروجی</li></ul>
              <span className="module-status">مرحله فعلی: بررسی ابزارهای رایگان و مجوزها</span>
              <a href="#opportunities">ثبت فرصت صوتی ←</a>
            </article>
            <article className="income-module">
              <div className="module-icon music">♫</div><div className="module-kicker">03 · MUSIC VOTING</div><h3>رأی‌گیری و داوری آهنگ</h3>
              <p>شرکت در رأی‌گیری‌های موسیقی، انتخاب آثار، مسابقات شنیداری و داوری آهنگ؛ فقط در برنامه‌هایی که پاداش واقعی و قوانین روشن دارند.</p>
              <ul><li>رأی‌گیری یا امتیازدهی به قطعات</li><li>مسابقات و چالش‌های انتخاب موسیقی</li><li>بررسی روش پرداخت و منع رأی جعلی</li></ul>
              <span className="module-status">مرحله فعلی: نیازمند شناسایی پلتفرم‌های معتبر</span>
              <a href="#opportunities">ثبت فرصت رأی‌گیری آهنگ ←</a>
            </article>
            <article className="income-module">
              <div className="module-icon survey">☷</div><div className="module-kicker">04 · PAID SURVEYS</div><h3>نظرسنجی و تحقیقات بازار</h3>
              <p>شرکت در نظرسنجی‌های عمومی پولی، تست محصول و تحقیقات بازار؛ جدا از رأی‌گیری‌های تخصصی موسیقی.</p>
              <ul><li>بررسی واجد شرایط بودن کشور</li><li>ثبت زمان صرف‌شده و پاداش</li><li>کنترل حداقل برداشت و کارمزد</li></ul>
              <span className="module-status">مرحله فعلی: نیازمند فهرست پلتفرم‌های معتبر</span>
              <a href="#opportunities">ثبت نظرسنجی ←</a>
            </article>
            <article className="income-module">
              <div className="module-icon video">▧</div><div className="module-kicker">05 · AI VISUAL CONTENT</div><h3>ساخت عکس و ویدئو</h3>
              <p>تولید تصویر، ویدئوی کوتاه، تبلیغات محصول، محتوای شبکه‌های اجتماعی و تحویل فایل به سفارش‌دهنده یا بازار فروش محتوا.</p>
              <ul><li>تولید تصویر و طراحی تبلیغاتی</li><li>ساخت و تدوین ویدئوهای کوتاه</li><li>کنترل واترمارک و مجوز استفاده تجاری</li></ul>
              <span className="module-status">مرحله فعلی: ابزارها فهرست شده‌اند؛ اتصال سفارش و تحویل در حال توسعه</span>
              <a href="#production">رفتن به میز تولید ←</a>
            </article>
          </div>
          <div className="income-manager" id="income-manager">
            <div><span className="eyebrow">INCOME MANAGER</span><h3>مدیریت یکپارچه درآمد</h3><p>درآمد هر مسیر جداگانه ثبت می‌شود؛ فقط USDT دریافت‌شده به کیف پول در جمع کل می‌آید.</p></div>
            <div className="income-manager-stats"><div><small>مسیرهای درآمدی</small><strong>۵</strong></div><div><small>درآمد تأییدشده</small><strong>0 USDT</strong></div><div><small>هزینه ابزار</small><strong>0 USDT</strong></div></div>
          </div>
          <p className="hub-footnote">این بخش فعلاً رابط و نقشه اجرایی است؛ هنوز به پلتفرم‌های نظرسنجی، بازار سفارش متن/موسیقی یا شبکه‌های تسک متصل نشده. هیچ درآمدی تضمین‌شده نیست. ثبت‌نام، احراز هویت و تأییدهای مالی فقط با دخالت و تأیید خودت انجام می‌شود؛ هیچ هزینه یا سپرده‌ای برای بازکردن تسک پرداخت نمی‌کنیم.</p>
        </section>



        <OpportunityDiscovery onAdd={(lead) => setOpportunities(current => [{ ...lead }, ...current])} />

        <section className="panel vetted-opportunities" id="verified-opportunities">
          <div className="panel-head"><div><span className="eyebrow">CRYPTO PAYMENT EVIDENCE</span><h2>پلتفرم‌های دارای مستندات پرداخت رمزارزی</h2></div><span className="free-tag">بدون سپرده اولیه</span></div>
          <p className="hub-intro">این‌ها فرصت قطعی یا درآمد تضمین‌شده نیستند؛ فقط روش پرداخت و کارمزدشان در منبع رسمی مستند شده است. دسترسی کشور، احراز هویت و امکان استفاده از حساب باید پیش از صرف وقت بررسی شود.</p>
          <div className="lead-grid">
            <article className="saved-opportunity"><div><strong>Subnano · فروش محتوای دیجیتال</strong><p>پرداخت سازنده به‌ازای هر فروش تأییدشده به کیف پول Nano یا آدرس Base برای USDC ارسال می‌شود. حداقل موجودی برداشت ندارد.</p><p className="opportunity-meta">کارمزد: ۷.۵٪ برای Nano و ۱۵٪ برای USDC · محدودیت کشور و KYC: نیازمند بررسی حساب</p><a href="https://subnano.ai/faq" target="_blank" rel="noreferrer">FAQ رسمی و شرایط پرداخت ↗</a></div><span className="status">نیازمند بررسی حساب</span></article>
            <article className="saved-opportunity"><div><strong>LaborX · سفارش‌های فریلنسری</strong><p>پرداخت رمزارزی از طریق قراردادهای پلتفرم؛ Ethereum و BNB Chain و استیبل‌کوین‌هایی مانند USDT و USDC پشتیبانی می‌شوند.</p><p className="opportunity-meta">کارمزد پایه فریلنسر: ۱۰٪ · کشور، KYC و جزئیات برداشت: نیازمند بررسی حساب</p><a href="https://laborx.com/vacancies/crypto" target="_blank" rel="noreferrer">صفحه رسمی پرداخت‌های رمزارزی ↗</a></div><span className="status">نیازمند بررسی حساب</span></article>
          </div>
          <p className="hub-footnote">قانون ثابت پروژه: PayPal، Payoneer، Wise، کارت هدیه و برداشت بانکی پذیرفته نیست. هیچ Deposit، خرید، اشتراک یا هزینه‌ای برای بازکردن تسک پرداخت نمی‌شود. هیچ محدودیت کشوری را با VPN یا اطلاعات نادرست دور نمی‌زنیم. پیش از ثبت‌نام یا تولید محتوا، شرایط واقعی حساب و کشور محل اقامت بررسی می‌شود.</p>
        </section>

        <section className="bottom-grid"><div className="panel" id="opportunities"><span className="eyebrow">OPPORTUNITY RADAR</span><h2>فرصت‌های درآمدی</h2><form onSubmit={addOpportunity} className="opportunity-form">
              <input name="title" required placeholder="عنوان فرصت / سفارش" aria-label="عنوان فرصت"/>
              <input name="platform" placeholder="نام پلتفرم / کارفرما" aria-label="پلتفرم"/>
              <input name="pay" placeholder="مبلغ و واحد پاداش" aria-label="مبلغ و پاداش"/>
              <select name="stream" aria-label="مسیر درآمدی"><option value="نوشتن و مقاله">نوشتن و مقاله</option><option value="موسیقی و صدا">موسیقی و صدا</option><option value="رأی‌گیری آهنگ">رأی‌گیری آهنگ</option><option value="نظرسنجی">نظرسنجی و تحقیقات بازار</option><option value="عکس و ویدئو">عکس و ویدئو</option></select>
              <input name="country" placeholder="کشورهای مجاز / محدودیت کشور" aria-label="کشورهای مجاز"/>
              <select name="payout" aria-label="روش پرداخت"><option value="نامشخص">روش پرداخت نامشخص</option><option value="مستقیم به کیف پول">مستقیم به کیف پول</option><option value="فقط صرافی">فقط حساب صرافی</option><option value="غیررمزارزی">غیررمزارزی</option></select>
              <input name="network" placeholder="شبکه برداشت (مثلاً TRC20)" aria-label="شبکه برداشت"/>
              <input name="minimum" placeholder="حداقل برداشت" aria-label="حداقل برداشت"/>
              <input name="fee" placeholder="کارمزد برداشت" aria-label="کارمزد"/>
              <select name="kyc" aria-label="احراز هویت"><option value="نامشخص">وضعیت KYC نامشخص</option><option value="بدون KYC">بدون KYC</option><option value="نیازمند KYC">نیازمند KYC</option></select>
              <input name="proofUrl" type="url" placeholder="لینک رسمی شرایط پرداخت / منبع" aria-label="لینک منبع رسمی"/>
              <button type="submit">+ ثبت برای بررسی</button>
            </form>
            {opportunities.length === 0 ? <div className="empty-state"><span>⌕</span><strong>هنوز فرصتی ثبت نشده</strong><p>فرصت‌ها را دستی ثبت کن؛ این فهرست به‌معنی تأیید اعتبار یا پرداخت نیست و فقط در همین مرورگر ذخیره می‌شود.</p></div> :
              <div className="saved-opportunities">{opportunities.map(item => <article className="saved-opportunity" key={item.id}>
                <div><strong>{item.title}</strong><p>{item.platform} · {item.pay}</p><p className="opportunity-meta">{item.stream || "مسیر نامشخص"} · کشور: {item.country || "نامشخص"} · برداشت: {item.payout || "نامشخص"} · شبکه: {item.network || "نامشخص"}</p><p className="opportunity-meta">حداقل برداشت: {item.minimum || "نامشخص"} · کارمزد: {item.fee || "نامشخص"} · احراز هویت: {item.kyc || "نامشخص"}</p>{item.stream === "نوشتن و مقاله" && <p className="opportunity-meta">نوع متن: {item.writingType || "نامشخص"} · زبان: {item.contentLanguage || "نامشخص"} · حجم: {item.wordCount || "نامشخص"} · مهلت: {item.deadline || "نامشخص"} · سئو: {item.seoRequired || "نامشخص"} · حقوق تجاری: {item.commercialRights || "نامشخص"}</p>}{item.proofUrl ? <a href={item.proofUrl} target="_blank" rel="noreferrer">مشاهده منبع رسمی ↗</a> : <small>لینک منبع رسمی ثبت نشده</small>}</div>
                <select aria-label="وضعیت بررسی فرصت" value={item.status} onChange={e => updateStatus(item.id, e.target.value)}>
                  <option>نیازمند بررسی</option><option>در حال بررسی</option><option>رد شد</option><option>درخواست ارسال شد</option><option>پذیرفته شد</option><option>تحویل شد</option><option>پرداخت شد</option>
                </select>
                <button type="button" className="remove-opportunity" onClick={() => removeOpportunity(item.id)} aria-label="حذف فرصت">×</button>
              </article>)}</div>}</div><div className="panel" id="production"><span className="eyebrow">CREATION DESK</span><h2>میز تولید و پیگیری تحویل</h2>
          <form className="opportunity-form" onSubmit={addDelivery}><input name="deliveryTitle" required placeholder="عنوان سفارش / نوع محتوا" aria-label="عنوان سفارش"/><input name="client" placeholder="مشتری یا پلتفرم" aria-label="مشتری"/><input name="due" type="date" aria-label="مهلت تحویل"/><button type="submit">+ ثبت سفارش تولید</button></form>
          {deliveries.length === 0 ? <div className="empty-state"><span>✧</span><strong>هنوز سفارش تولیدی ثبت نشده</strong><p>سفارش پذیرفته‌شده را دستی ثبت و تا تحویل پیگیری کن؛ اطلاعات فقط در همین مرورگر ذخیره می‌شود.</p></div> : <div className="saved-opportunities">{deliveries.map(item => <article className="saved-opportunity" key={item.id}><div><strong>{item.title}</strong><p>{item.client}{item.due ? " · مهلت: "+item.due : ""}</p></div><select aria-label="وضعیت تحویل" value={item.status} onChange={e => setDeliveries(rows => rows.map(row => row.id === item.id ? {...row,status:e.target.value} : row))}><option>در حال آماده‌سازی</option><option>در انتظار بازبینی</option><option>آماده تحویل</option><option>تحویل شد</option><option>لغو شد</option></select><button type="button" className="remove-opportunity" onClick={() => setDeliveries(rows => rows.filter(row => row.id !== item.id))} aria-label="حذف سفارش">×</button></article>)}</div>}
        </div></section>
        <section className="panel income-log"><div className="panel-head"><div><span className="eyebrow">PAYMENT TRACKER</span><h2>ثبت درآمد و پرداخت‌ها</h2></div><span className="free-tag">ثبت دستی و شفاف</span></div><p className="hub-intro">فقط پرداخت رمزارزی که واقعاً به کیف پول رسیده باشد ثبت می‌شود. پرداخت فیات در این دفتر پذیرفته نیست. اطلاعات این دفتر فقط در همین مرورگر و دستگاه ذخیره می‌شود.</p>
          <form className="income-form" onSubmit={addIncome}><input name="incomeSource" required placeholder="منبع درآمد / سفارش" aria-label="منبع درآمد"/><input name="amount" type="number" min="0.01" step="0.01" required placeholder="مبلغ" aria-label="مبلغ"/><select name="currency" aria-label="واحد پول"><option value="USDT">USDT</option><option value="USDC">USDC</option><option value="XNO">Nano (XNO)</option></select><label className="received-check"><input name="received" type="checkbox"/> واقعاً دریافت شده</label><button type="submit">+ ثبت درآمد</button></form>
          {income.length === 0 ? <div className="empty-state"><span>₮</span><strong>هنوز پرداختی ثبت نشده</strong><p>درآمد واقعی را پس از دریافت ثبت کن.</p></div> : <div className="saved-opportunities">{income.map(item => <article className="saved-opportunity" key={item.id}><div><strong>{item.source}</strong><p>{item.date} · {item.amount.toFixed(2)} {item.currency}</p></div><label className="received-check"><input type="checkbox" checked={item.received} onChange={e => setIncome(rows => rows.map(row => row.id === item.id ? {...row,received:e.target.checked} : row))}/>{item.received ? "دریافت شده" : "در انتظار دریافت"}</label><button type="button" className="remove-opportunity" onClick={() => setIncome(rows => rows.filter(row => row.id !== item.id))} aria-label="حذف درآمد">×</button></article>)}</div>}
        </section>

        <section className="panel wallet-panel" id="wallet">
          <div className="panel-head"><div><span className="eyebrow">PAYOUT DESTINATION</span><h2>کیف پول دریافت درآمد</h2></div><span className="free-tag">ذخیره محلی</span></div>
          <p className="hub-intro">این بخش فقط مقصد دریافت را نگه می‌دارد و خودش پرداخت یا اتصال کیف پول انجام نمی‌دهد. آدرس EVM می‌تواند روی چند شبکه استفاده شود؛ هنگام برداشت باید همان شبکه‌ای را انتخاب کنی که پلتفرم پرداخت پشتیبانی می‌کند.</p>
          <form className="opportunity-form" onSubmit={saveWallet}>
            <input name="walletAddress" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="آدرس عمومی EVM با 0x" aria-label="آدرس عمومی کیف پول" autoComplete="off" spellCheck={false}/>
            <select aria-label="شبکه کیف پول" value={walletNetwork} onChange={e => setWalletNetwork(e.target.value)}>
              <option>EVM - انتخاب شبکه هنگام برداشت</option>
              <option>Ethereum</option><option>BNB Smart Chain (BEP20)</option><option>Polygon</option><option>Arbitrum One</option><option>Base</option>
            </select>
            <button type="submit">ذخیره آدرس در این دستگاه</button>
            <button type="button" onClick={copyWallet} disabled={!walletAddress}>کپی آدرس</button>
          </form>
          <p className="backup-notice" role="status">{walletNotice || "هشدار: اعتبار قالب آدرس به معنی تأیید AML، نبود فلگ یا امن‌بودن همه شبکه‌ها نیست. پیش از دریافت وجه، شبکه و وضعیت آدرس را در سرویس پرداخت بررسی کن."}</p>
        </section>

        <section className="panel backup-panel" id="backup">
          <div className="panel-head"><div><span className="eyebrow">DATA SAFETY</span><h2>پشتیبان‌گیری و بازیابی اطلاعات</h2></div><span className="free-tag">بدون هزینه</span></div>
          <p className="hub-intro">از فرصت‌ها، سفارش‌های تولید و درآمدهای ثبت‌شده یک فایل پشتیبان JSON بساز. برای انتقال اطلاعات به گوشی یا مرورگر دیگر، فایل را همان‌جا بازیابی کن. این قابلیت جایگزین فضای ابری نیست و اطلاعات را خودکار همگام‌سازی نمی‌کند.</p>
          <div className="backup-actions">
            <button type="button" onClick={exportBackup}>دانلود فایل پشتیبان</button>
            {hasPreImportBackup && <button type="button" onClick={downloadPreImportBackup}>دانلود نسخه خودکار قبل از بازیابی</button>}
            <label className="backup-import">بازیابی از فایل پشتیبان
              <input type="file" accept="application/json,.json" onChange={importBackup}/>
            </label>
          </div>
          <p className="backup-notice" role="status">{backupNotice || "فایل پشتیبان شامل فرصت‌ها، سفارش‌ها، دفتر درآمد و آدرس عمومی کیف پول است؛ اطلاعات ورود Google و کلیدهای خصوصی هرگز ذخیره نمی‌شوند."}</p>
        </section>

        <footer id="deliveries"><span>CREATIVEOPS · نسخه ۰.۲.۰</span><span>ساخته‌شده برای گردش‌کار کم‌هزینه و شفاف</span></footer>
      </section>
    </main>
  );
}
