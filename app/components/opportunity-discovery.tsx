"use client";

import { useMemo, useState } from "react";

export type DiscoveryLead = {
  id: string;
  title: string;
  platform: string;
  pay: string;
  status: string;
  stream: string;
  country: string;
  payout: string;
  network: string;
  minimum: string;
  fee: string;
  kyc: string;
  proofUrl: string;
  deposit: string;
  escrow: string;
  countryCheck: string;
  paymentAsset: string;
  score: number;
  decision: string;
  writingType?: string;
  contentLanguage?: string;
  wordCount?: string;
  deadline?: string;
  seoRequired?: string;
  commercialRights?: string;
};

type Props = { onAdd: (lead: DiscoveryLead) => void };
type LiveOpportunity = { id: string; title: string; company: string; url: string; sourceUrl?: string; location: string; types: string[]; salary: string; description: string; postedAt: string | null; score: number; contractType: boolean; source: string; stream?: string };
type DiscoveredOpportunity = LiveOpportunity & {
  sourceType?: "employment" | "freelance" | "request";
  budgetScope?: string;
  paymentNote?: string;
  actionNote?: string;
};

const sources = [
  {
    name: "LaborX · کانال رسمی اطلاع‌رسانی فرصت‌ها",
    detail: "کانال اطلاع‌رسانی LaborX که آگهی‌های پروژه‌ای مانند Article Writing و Content Writing را بازنشر می‌کند. بودجه‌های درج‌شده فقط ادعای آگهی‌اند؛ صفحه پروژه، هویت کارفرما، کشور مجاز، روش پرداخت و امانت‌داری را جداگانه بررسی کن.",
    url: "https://t.me/s/laborxWeb3Jobs",
    tag: "آگهی‌های نوشتن و مقاله"
  },
  {
    name: "LaborX · سفارش‌های فریلنسری رمزارزی",
    detail: "آگهی‌های کاری و پروژه‌ای با پرداخت رمزارزی. پیش از قبول، قرارداد و قفل‌شدن وجه در امانت‌داری را داخل همان سفارش بررسی کن.",
    url: "https://laborx.com/vacancies/crypto",
    tag: "سفارش و قرارداد"
  },
  {
    name: "LaborX · بازار پروژه‌ها و گیگ‌ها",
    detail: "برای یافتن سفارش‌های نوشتن، طراحی، تدوین و تولید محتوا. هر آگهی را از نظر کارفرما، بودجه و شرایط قرارداد جداگانه بررسی کن.",
    url: "https://laborx.com/",
    tag: "نوشتن · طراحی · ویدئو"
  },
  {
    name: "Subnano · درخواست‌های باز",
    detail: "درخواست‌های عمومی با بودجه پیشنهادی. بودجه رزرو یا تضمین نشده و پاسخ‌دادن الزاماً به پرداخت منجر نمی‌شود.",
    url: "https://subnano.ai/",
    tag: "درخواست محتوا و تحقیق"
  },
  {
    name: "Subnano · فروش محتوای سازنده",
    detail: "مسیر فروش مقاله، فایل و محتوای دیجیتال به‌ازای هر خرید. این مسیر سفارش استخدامی نیست و به داشتن خریدار وابسته است.",
    url: "https://subnano.ai/creators",
    tag: "فروش محتوا"
  }
];

function scoreLead(input: {
  sourceUrl: string;
  payout: string;
  countryCheck: string;
  deposit: string;
  escrow: string;
  paymentAsset: string;
  network: string;
  minimum: string;
  fee: string;
  kyc: string;
  stream: string;
}) {
  let score = 0;
  const hardReject: string[] = [];
  if (/^(https?:\/\/)?(www\.)?(laborx\.com|subnano\.ai)(\/|$)/i.test(input.sourceUrl)) score += 15;
  if (input.payout === "کیف پول مستقیم") score += 20;
  else if (input.payout === "رمزارز از طریق قرارداد") score += 15;
  else if (input.payout === "فیات یا کارت هدیه") hardReject.push("روش پرداخت با سیاست پروژه سازگار نیست");
  if (input.paymentAsset === "USDT") score += 10;
  else if (["USDC", "XNO"].includes(input.paymentAsset)) score += 6;
  if (input.countryCheck === "مجاز بودن کشور تأیید شده") score += 15;
  else if (input.countryCheck === "کشور مسدود است") hardReject.push("کشور محل اقامت پذیرفته نمی‌شود");
  else score -= 8;
  if (input.deposit === "بدون هزینه ثبت‌نام/اشتراک، سپرده یا خرید اجباری") score += 20;
  else if (["سپرده یا خرید اجباری دارد", "هزینه ثبت‌نام یا اشتراک اجباری دارد"].includes(input.deposit)) hardReject.push("هزینه ورود، اشتراک اجباری، سپرده یا خرید اجباری با شرط پروژه سازگار نیست");
  else score -= 10;
  if (input.escrow === "وجه در امانت قفل شده") score += 15;
  if (input.fee === "۰ تا ۱۰٪") score += 10;
  else if (input.fee === "بیشتر از ۱۰٪") score += 4;
  if (input.kyc === "نیازمند KYC") hardReject.push("احراز هویت اجباری با شرط پروژه سازگار نیست");
  if (input.kyc !== "بدون KYC") score -= 25;
  if (input.stream !== "نامشخص") score += 5;
  score = Math.max(0, Math.min(100, score));
  if (hardReject.length) return { score: 0, decision: "رد خودکار", reason: hardReject.join("؛ ") };
  const complianceVerified = input.kyc === "بدون KYC"
    && input.countryCheck === "مجاز بودن کشور تأیید شده"
    && input.payout === "کیف پول مستقیم"
    && input.deposit === "بدون هزینه ثبت‌نام/اشتراک، سپرده یا خرید اجباری"
    && input.paymentAsset !== "نامشخص"
    && input.paymentAsset !== "سایر رمزارزها"
    && Boolean(input.network.trim())
    && Boolean(input.minimum.trim())
    && input.fee !== "نامشخص";
  if (!complianceVerified) return { score: Math.min(score, 44), decision: "نیازمند بررسی", reason: "تا وقتی KYC، کشور مجاز، ارز و شبکه دقیق، حداقل برداشت، پرداخت مستقیم رمزارزی، کارمزد و نبود هزینه ثبت‌نام/اشتراک/سپرده مستند نشوند، این فرصت واجد شرایط نیست." };
  if (score >= 70) return { score, decision: "واجد شرایط اولیه", reason: "شرایط پایه ثبت شده؛ قرارداد، حداقل برداشت و پرداخت نهایی را پیش از شروع دوباره بررسی کن." };
  if (score >= 45) return { score, decision: "نیازمند بررسی", reason: "شواهد تکمیلی پرداخت یا شرایط قرارداد کافی نیست." };
  return { score, decision: "اولویت پایین", reason: "شواهد پرداخت، کشور یا هزینه‌ها کافی نیست." };
}

export default function OpportunityDiscovery({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("LaborX");
  const [stream, setStream] = useState("عکس و طراحی");
  const [pay, setPay] = useState("");
  const [country, setCountry] = useState("نامشخص");
  const [countryCheck, setCountryCheck] = useState("هنوز بررسی نشده");
  const [payout, setPayout] = useState("نامشخص");
  const [paymentAsset, setPaymentAsset] = useState("نامشخص");
  const [network, setNetwork] = useState("");
  const [fee, setFee] = useState("نامشخص");
  const [minimum, setMinimum] = useState("");
  const [kyc, setKyc] = useState("نامشخص");
  const [deposit, setDeposit] = useState("هنوز بررسی نشده");
  const [escrow, setEscrow] = useState("نامشخص");
  const [proofUrl, setProofUrl] = useState("");
  const [writingType, setWritingType] = useState("مقاله وبلاگی و آموزشی");
  const [contentLanguage, setContentLanguage] = useState("انگلیسی");
  const [wordCount, setWordCount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [seoRequired, setSeoRequired] = useState("نامشخص");
  const [commercialRights, setCommercialRights] = useState("باید از کارفرما تأیید شود");
  const [liveJobs, setLiveJobs] = useState<DiscoveredOpportunity[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState("");
  const [liveNotice, setLiveNotice] = useState("");
  const [liveFetchedAt, setLiveFetchedAt] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalBrief, setProposalBrief] = useState("");
  const [proposalBudget, setProposalBudget] = useState("");
  const [proposalDeadline, setProposalDeadline] = useState("");
  const [proposalText, setProposalText] = useState("");

  const assessment = useMemo(() => scoreLead({ sourceUrl: proofUrl, payout, countryCheck, deposit, escrow, paymentAsset, network, minimum, fee, kyc, stream }), [proofUrl, payout, countryCheck, deposit, escrow, paymentAsset, network, minimum, fee, kyc, stream]);

  async function discoverOpportunities() {
    setLiveLoading(true); setLiveError(""); setLiveNotice("");
    try {
      const response = await fetch("/api/opportunities/discover", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "دریافت آگهی‌ها ناموفق بود.");
      setLiveJobs(Array.isArray(payload.jobs) ? payload.jobs : []);
      setLiveFetchedAt(payload.fetchedAt || new Date().toISOString());
      setLiveNotice(payload.notice || "اطلاعات از منابع عمومی دریافت شد.");
      if (payload.warnings?.length) setLiveError(payload.warnings.join(" "));
    } catch (error) {
      setLiveError(error instanceof Error ? error.message : "خطای نامشخص در دریافت آگهی‌ها.");
    } finally { setLiveLoading(false); }
  }

  function buildProposal() {
    const titleText = proposalTitle.trim() || "your content project";
    const briefText = proposalBrief.trim();
    const budgetText = proposalBudget.trim();
    const deadlineText = proposalDeadline.trim();
    const briefLine = briefText
      ? `Based on your brief, I would first confirm the target audience, search intent, tone, and required sources, then prepare a clear outline before drafting.\n\nProject brief: ${briefText}\n\n`
      : "I would be happy to review the full brief and confirm the scope, audience, tone, and deliverables before starting.\n\n";
    const terms = [
      budgetText ? `Proposed budget: ${budgetText}` : "",
      deadlineText ? `Target deadline: ${deadlineText}` : ""
    ].filter(Boolean).join(" | ");
    setProposalText(
      `Hello,\n\nI’m interested in helping with ${titleText}. My workflow combines structured research, an organized outline, AI-assisted drafting where appropriate, and careful human review for clarity, consistency, and originality. I can prepare the agreed deliverable and make revisions based on your feedback.\n\n${briefLine}Before I begin, I’d confirm the final word count, source requirements, formatting, revision rounds, and usage rights so the scope is clear for both sides.\n\n${terms ? terms + "\n\n" : ""}If the scope matches your needs, I can review the complete instructions and confirm a realistic delivery plan.\n\nBest regards`
    );
  }

  function addLiveJob(job: LiveOpportunity) {
    onAdd({
      id: crypto.randomUUID(), title: job.title, platform: job.source, pay: job.salary,
      status: "نیازمند بررسی", stream: job.stream || "نامشخص",
      country: `محدوده آگهی: ${job.location}. پذیرش کشور محل اقامت هنوز تأیید نشده است.`,
      payout: "روش پرداخت باید در آگهی و قرارداد بررسی شود", network: "نامشخص",
      minimum: "نامشخص", fee: "نامشخص", kyc: "نامشخص", proofUrl: job.url,
      deposit: "هنوز بررسی نشده", escrow: "نامشخص", countryCheck: "هنوز بررسی نشده",
      paymentAsset: "نامشخص", score: job.score,
      decision: job.contractType ? "تطابق موضوعی و نوع قرارداد، نیازمند بررسی شرایط" : "آگهی دورکاری؛ نوع استخدام باید بررسی شود",
      ...(job.stream === "نوشتن و مقاله" ? { writingType: "آگهی نوشتاری دورکاری", contentLanguage: "طبق آگهی اصلی" } : {}),
      wordCount: "در آگهی مشخص نشده", deadline: "طبق آگهی اصلی",
      seoRequired: "طبق آگهی اصلی", commercialRights: "باید در قرارداد بررسی شود"
    });
    setLiveNotice("آگهی به فهرست فرصت‌ها اضافه شد؛ هنوز کشور، پرداخت و شرایط قرارداد تأیید نشده‌اند.");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !proofUrl.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      platform,
      pay: pay.trim() || "مبلغ نامشخص",
      status: assessment.decision === "رد خودکار" ? "رد شد" : "نیازمند بررسی",
      stream,
      country: country.trim() || "نامشخص",
      payout,
      network: [paymentAsset, network].filter(Boolean).join(" · "),
      minimum: minimum || "نامشخص",
      fee,
      kyc,
      proofUrl: proofUrl.trim(),
      deposit,
      escrow,
      countryCheck,
      paymentAsset,
      score: assessment.score,
      decision: assessment.decision,
      ...(stream === "نوشتن و مقاله" ? { writingType, contentLanguage, wordCount: wordCount.trim() || "نامشخص", deadline: deadline.trim() || "نامشخص", seoRequired, commercialRights } : {})
    });
    setTitle("");
    setPay("");
    setProofUrl("");
    setNetwork("");
    setMinimum("");
    setWordCount("");
    setDeadline("");
  }

  return (
    <section className="panel discovery-panel" id="discovery">
      <div className="panel-head">
        <div><span className="eyebrow">OPPORTUNITY DISCOVERY ENGINE · MVP</span><h2>موتور پیدا کردن و ارزیابی سفارش</h2></div>
        <span className="free-tag">منابع رایگان</span>
      </div>
      <p className="hub-intro">سفارش‌های پروژه‌ای تولید تصویر، طراحی گرافیکی و ویدئوی کوتاه با کمک هوش مصنوعی را از فیدهای عمومی جهانی پیدا و ارزیابی کن یا موردی را دستی ثبت کن. امتیاز موضوعی فقط میزان تطابق کار با مهارت‌ها را نشان می‌دهد و تأیید پرداخت نیست. تا وقتی نبود KYC، پذیرش کشور، پرداخت مستقیم به کیف پول، نبود سپرده و همه کارمزدها از منبع رسمی تأیید نشده‌اند، هیچ موردی واجد شرایط نیست.</p>
      <section className="live-discovery-block" aria-label="weekly income target and work priorities">
        <div className="panel-head discovery-form-head">
          <div><span className="eyebrow">WEEKLY EARNING PLAN</span><h3>هدف اولیه درآمد هفتگی</h3></div>
          <span className="free-tag">هدف برنامه‌ریزی، نه درآمد تضمینی</span>
        </div>
        <div className="lead-grid">
          <article className="saved-opportunity"><div><strong>۵۰ دلار در هفته</strong><p>هدف اولیه برای اعتبارسنجی بازار و گرفتن اولین سفارش‌های پرداخت‌شده؛ معادل تقریبی ۲۰۰ تا ۲۱۷ دلار در ماه.</p></div></article>
          <article className="saved-opportunity"><div><strong>۷۰٪ تمرکز اصلی</strong><p>تولید تصویر محصول، طراحی تبلیغاتی و محتوای بصری شبکه‌های اجتماعی با کمک AI.</p></div></article>
          <article className="saved-opportunity"><div><strong>۳۰٪ تمرکز مکمل</strong><p>ساخت و تدوین ویدئوهای کوتاه و موشن‌گرافیک، فقط با ابزار قابل‌دسترسی و هزینه و مجوز تجاری روشن.</p></div></article>
        </div>
        <p className="hub-footnote">تقسیم هدف آزمایشی: ۲۰ دلار طراحی و تصویر محصول، ۱۵ دلار محتوای بصری شبکه‌های اجتماعی و ۱۵ دلار ویدئوهای کوتاه. این اعداد سهمیه هدف‌اند، نه سفارش موجود یا درآمد ثبت‌شده. فرصت‌ها بر اساس امکان انجام توسط AI، بودجه واقعی، کشور مجاز، روش پرداخت و هزینه ورود رتبه‌بندی می‌شوند.</p>
      </section>
      <section className="live-discovery-block" aria-label="AI-assisted remote work">
        <div className="panel-head discovery-form-head">
          <div><span className="eyebrow">AI-ASSISTED REMOTE WORK</span><h3>میز کار دورکاری قابل انجام با هوش مصنوعی</h3></div>
          <span className="free-tag">قابل آماده‌سازی و تحویل</span>
        </div>
        <p className="hub-intro">این‌ها خدماتی هستند که دستیار هوش مصنوعی می‌تواند بخش اصلی‌شان را انجام دهد؛ هر سفارش باید با شرح کار و استاندارد مشتری تطبیق داده شود و قبل از ارسال نهایی بازبینی انسانی شود.</p>
        <div className="lead-grid">
          <article className="saved-opportunity"><div><strong>تصویر محصول و تبلیغات</strong><p>تصویر محصول، بنر و پوستر تبلیغاتی، کاور، thumbnail و اصلاح یا گسترش تصویر با کمک AI.</p><small>خروجی: فایل تصویری آماده انتشار پس از تأیید کیفیت و حقوق تجاری</small></div></article>
          <article className="saved-opportunity"><div><strong>طراحی گرافیکی و هویت بصری</strong><p>قالب پست و استوری، بنر فروش، کاور و مجموعه تصاویر هماهنگ برای کمپین و برند.</p><small>خروجی: PNG/JPG با ابعاد و فرمت توافق‌شده</small></div></article>
          <article className="saved-opportunity"><div><strong>تصویر و طراحی تبلیغاتی با AI</strong><p>ایده‌پردازی، ساخت تصویر محصول و شبکه اجتماعی، پوستر و بنر، اصلاح تصویر و آماده‌سازی خروجی در ابزارهای متصل و مجاز.</p><small>قابلیت اجرا: بسته به ابزار، سهمیه رایگان و حقوق تجاری</small></div></article>
          <article className="saved-opportunity"><div><strong>ویدئو و محتوای کوتاه</strong><p>ویدئوی تبلیغاتی کوتاه، ریلز، کلیپ محصول، تدوین، زیرنویس و موشن‌گرافیک با ابزارهای در دسترس.</p><small>قابلیت اجرا: تولید نهایی به دسترسی ابزار و محدودیت حساب بستگی دارد</small></div></article>
          <article className="saved-opportunity"><div><strong>بسته‌های محتوای بصری</strong><p>ترکیب تصویر، طراحی و ویدئو برای کمپین محصول یا صفحه شبکه اجتماعی، با خروجی‌های هماهنگ و آماده انتشار.</p><small>قابلیت اجرا: حقوق تجاری و هزینه تولید باید بررسی شود</small></div></article>
          <article className="saved-opportunity"><div><strong>ویرایش و آماده‌سازی خروجی</strong><p>حذف پس‌زمینه، اصلاح نور و رنگ، تغییر اندازه و نسبت تصویر و آماده‌سازی فایل برای وب و شبکه‌های اجتماعی.</p><small>خروجی: فایل نهایی مطابق مشخصات فنی مشتری</small></div></article>
        </div>
        <p className="hub-footnote">محدودیت‌ها: ثبت‌نام و احراز هویت، مصاحبه زنده، تماس تلفنی، تصمیم حقوقی، پذیرش قرارداد، ارسال نهایی از حساب کاربر و دریافت پول به تأیید و اقدام تو نیاز دارند. هیچ ابزار پولی یا تولید دارای هزینه بدون تأیید قبلی استفاده نمی‌شود؛ ارسال نهایی فقط پس از بازبینی و تأیید تو انجام می‌شود.</p>
      </section>
      <div className="live-discovery-block">
        <div className="panel-head discovery-form-head">
          <div><span className="eyebrow">LIVE PUBLIC LISTINGS</span><h3>جست‌وجوی زنده فرصت‌های درآمدی</h3></div>
          <button type="button" onClick={discoverOpportunities} disabled={liveLoading}>{liveLoading ? "در حال جست‌وجو..." : "جست‌وجوی فرصت‌های جدید"}</button>
        </div>
        <p className="hub-intro">جست‌وجوی جهانی سفارش‌های پروژه‌ای تصویر، طراحی و ویدئوی AI بدون محدودیت به کشور خاص. منابع زنده فعلی فقط LaborX و Subnano هستند؛ آگهی استخدامی حذف شده است. هیچ نتیجه‌ای تا زمان تأیید مستندِ «بدون KYC»، کشور مجاز، پرداخت مستقیم رمزارزی، نبود سپرده و کارمزد، واجد شرایط محسوب نمی‌شود.</p>
        {liveFetchedAt && <small>آخرین دریافت: {new Date(liveFetchedAt).toLocaleString("fa-IR")}</small>}
        {liveError && <p role="alert" className="discovery-assessment">{liveError}</p>}
        {liveNotice && <p className="discovery-assessment">{liveNotice}</p>}
        {liveJobs.length > 0 && <div className="lead-grid">
          {liveJobs.map(job => <article className="saved-opportunity" key={job.url}>
            <div><strong>{job.title}</strong><p>{job.company} · {job.location}</p><p>{job.description || "توضیحات در صفحه اصلی آگهی"}</p><p className="opportunity-meta">بودجه/حقوق اعلام‌شده: {job.salary} · نوع: {job.sourceType === "freelance" ? "پروژه فریلنسری" : job.sourceType === "request" ? "درخواست عمومی" : "استخدام دورکاری"} · امتیاز تطابق موضوعی: {job.score}/100</p><p className="discovery-assessment">وضعیت انطباق: <strong>تأییدنشده، فعلاً واجد شرایط نیست</strong> · وضعیت KYC، کشور مجاز، روش برداشت، کارمزد و سپرده باید از منبع رسمی بررسی شوند.</p>{job.budgetScope && <small>دامنه بودجه: {job.budgetScope}</small>}{job.postedAt && <small>تاریخ انتشار: {new Date(job.postedAt).toLocaleDateString("fa-IR")}</small>}{job.paymentNote && <p>{job.paymentNote}</p>}{job.actionNote && <p>{job.actionNote}</p>}<p><a href={job.url} target="_blank" rel="noreferrer">مشاهده صفحه اقدام یا آگهی ↗</a>{job.sourceUrl && job.sourceUrl !== job.url && <> · <a href={job.sourceUrl} target="_blank" rel="noreferrer">منبع اصلی {job.source} ↗</a></>}</p></div>
            <button type="button" onClick={() => addLiveJob(job)}>افزودن به فرصت‌ها</button>
          </article>)}
        </div>}
      </div>
      <section className="live-discovery-block" aria-label="proposal drafting assistant">
        <div className="panel-head discovery-form-head">
          <div><span className="eyebrow">PROPOSAL WORKBENCH</span><h3>آماده‌سازی پیشنهاد برای کارفرما</h3></div>
          <span className="free-tag">پیش‌نویس، بدون ارسال خودکار</span>
        </div>
        <p className="hub-intro">شرح سفارش را وارد کن تا یک پیشنهاد اولیه انگلیسی آماده شود. متن را قبل از ارسال بررسی کن و هیچ سابقه، نمونه‌کار یا مهارتی را که واقعاً نداری ادعا نکن.</p>
        <div className="opportunity-form">
          <input value={proposalTitle} onChange={e => setProposalTitle(e.target.value)} placeholder="عنوان دقیق پروژه" aria-label="عنوان پروژه برای پیشنهاد"/>
          <input value={proposalBudget} onChange={e => setProposalBudget(e.target.value)} placeholder="بودجه پیشنهادی (اختیاری)" aria-label="بودجه پیشنهادی"/>
          <input value={proposalDeadline} onChange={e => setProposalDeadline(e.target.value)} placeholder="زمان تحویل پیشنهادی (اختیاری)" aria-label="زمان تحویل"/>
          <textarea value={proposalBrief} onChange={e => setProposalBrief(e.target.value)} rows={4} placeholder="شرح سفارش تصویر یا ویدئو، سبک بصری، ابعاد، پلتفرم انتشار و شرایط کارفرما..." aria-label="شرح سفارش برای پیشنهاد"/>
          <button type="button" onClick={buildProposal} disabled={!proposalTitle.trim() && !proposalBrief.trim()}>ساخت پیش‌نویس پیشنهاد</button>
        </div>
        {proposalText && <div className="writing-order-fields">
          <textarea value={proposalText} onChange={e => setProposalText(e.target.value)} rows={14} aria-label="متن پیشنهاد آماده‌شده"/>
          <button type="button" onClick={() => navigator.clipboard?.writeText(proposalText)}>کپی متن پیشنهاد</button>
        </div>}
      </section>
      <div className="lead-grid">
        {sources.map(source => (
          <article className="saved-opportunity" key={source.name}>
            <div><strong>{source.name}</strong><p>{source.detail}</p><small>{source.tag}</small><p><a href={source.url} target="_blank" rel="noreferrer">باز کردن منبع رسمی ↗</a></p></div>
          </article>
        ))}
      </div>
      <div className="panel-head discovery-form-head">
        <div><span className="eyebrow">LEAD QUALIFICATION</span><h3>ثبت آگهی برای امتیازدهی</h3></div>
        <span className="status">{assessment.decision} · {assessment.score}/100</span>
      </div>
      <form className="opportunity-form" onSubmit={submit}>
        <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="عنوان دقیق سفارش" aria-label="عنوان دقیق سفارش"/>
        <select value={platform} onChange={e => setPlatform(e.target.value)} aria-label="منبع آگهی"><option>LaborX</option><option>Subnano</option><option>سایر منابع رسمی</option></select>
        <select value={stream} onChange={e => setStream(e.target.value)} aria-label="نوع کار"><option>عکس و طراحی</option><option>ویدئو</option><option>نامشخص</option></select>
        <input value={pay} onChange={e => setPay(e.target.value)} placeholder="بودجه و واحد پرداخت" aria-label="بودجه"/>
        <input value={country} onChange={e => setCountry(e.target.value)} placeholder="کشورهای مجاز یا محدودیت‌ها" aria-label="محدودیت کشور"/>
        <select value={countryCheck} onChange={e => setCountryCheck(e.target.value)} aria-label="بررسی کشور"><option>هنوز بررسی نشده</option><option>مجاز بودن کشور تأیید شده</option><option>کشور مسدود است</option></select>
        <select value={payout} onChange={e => setPayout(e.target.value)} aria-label="روش پرداخت"><option>نامشخص</option><option>کیف پول مستقیم</option><option>رمزارز از طریق قرارداد</option><option>فیات یا کارت هدیه</option></select>
        <select value={paymentAsset} onChange={e => setPaymentAsset(e.target.value)} aria-label="ارز پرداخت"><option>نامشخص</option><option>USDT</option><option>USDC</option><option>XNO</option><option>سایر رمزارزها</option></select>
        <input value={network} onChange={e => setNetwork(e.target.value)} placeholder="شبکه دقیق پرداخت" aria-label="شبکه"/>
        <select value={deposit} onChange={e => setDeposit(e.target.value)} aria-label="هزینه ورود، اشتراک و سپرده"><option>هنوز بررسی نشده</option><option>بدون هزینه ثبت‌نام/اشتراک، سپرده یا خرید اجباری</option><option>هزینه ثبت‌نام یا اشتراک اجباری دارد</option><option>سپرده یا خرید اجباری دارد</option></select>
        <select value={escrow} onChange={e => setEscrow(e.target.value)} aria-label="وضعیت امانت‌داری"><option>نامشخص</option><option>وجه در امانت قفل شده</option><option>بدون امانت‌داری</option></select>
        <select value={fee} onChange={e => setFee(e.target.value)} aria-label="کارمزد پلتفرم و برداشت"><option>نامشخص</option><option>۰ تا ۱۰٪</option><option>بیشتر از ۱۰٪</option></select>
        <input value={minimum} onChange={e => setMinimum(e.target.value)} placeholder="حداقل برداشت" aria-label="حداقل برداشت"/>
        <select value={kyc} onChange={e => setKyc(e.target.value)} aria-label="احراز هویت"><option>نامشخص</option><option>بدون KYC</option><option>نیازمند KYC</option></select>
        {stream === "نوشتن و مقاله" && (
          <div className="writing-order-fields">
            <div className="writing-fields-heading"><strong>مشخصات اختصاصی سفارش متن و مقاله</strong><small>این اطلاعات برای تخمین زمان، قیمت و آماده‌سازی تحویل ثبت می‌شوند.</small></div>
            <select value={writingType} onChange={e => setWritingType(e.target.value)} aria-label="نوع محتوای نوشتاری">
              <option>مقاله وبلاگی و آموزشی</option><option>مقاله تخصصی و پژوهشی</option><option>محتوای سئو و کلمات کلیدی</option><option>توضیحات محصول و فروشگاهی</option><option>صفحه فرود و متن تبلیغاتی</option><option>بازنویسی و ویرایش</option><option>خلاصه‌سازی و تحقیق</option><option>ترجمه و بومی‌سازی</option>
            </select>
            <select value={contentLanguage} onChange={e => setContentLanguage(e.target.value)} aria-label="زبان محتوا">
              <option>انگلیسی</option><option>فارسی</option><option>ترکی</option><option>عربی</option><option>آلمانی</option><option>سایر زبان‌ها</option>
            </select>
            <input value={wordCount} onChange={e => setWordCount(e.target.value)} placeholder="تعداد کلمات یا حجم محتوا" aria-label="تعداد کلمات"/>
            <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="مهلت تحویل و منطقه زمانی" aria-label="مهلت تحویل"/>
            <select value={seoRequired} onChange={e => setSeoRequired(e.target.value)} aria-label="نیاز سئو"><option>نامشخص</option><option>سئو و کلمات کلیدی لازم است</option><option>بدون نیاز سئو</option></select>
            <select value={commercialRights} onChange={e => setCommercialRights(e.target.value)} aria-label="حقوق تجاری محتوا"><option>باید از کارفرما تأیید شود</option><option>حقوق تجاری و مالکیت مشخص است</option><option>استفاده تجاری ممنوع است</option></select>
          </div>
        )}
        <input value={proofUrl} onChange={e => setProofUrl(e.target.value)} type="url" required placeholder="لینک مستقیم همان سفارش یا منبع رسمی" aria-label="لینک مستقیم سفارش"/>
        <button type="submit">ثبت در رادار فرصت‌ها</button>
      </form>
      <div className="discovery-assessment" role="status">
        <strong>امتیاز فعلی: {assessment.score}/100 · {assessment.decision}</strong>
        <p>{assessment.reason}</p>
        <small>رد خودکار در صورت KYC اجباری، پرداخت غیررمزارزی، کشور مسدود یا هر هزینه ورود/اشتراک/سپرده اجباری. کشف زنده فقط از منابع عمومی انجام می‌شود؛ شرایط هر سفارش باید دستی و با سند رسمی تأیید شود.</small>
      </div>
    </section>
  );
}
