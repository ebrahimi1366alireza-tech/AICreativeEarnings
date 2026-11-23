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

const sources = [
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
  if (input.deposit === "بدون سپرده و خرید اجباری") score += 20;
  else if (input.deposit === "سپرده یا خرید اجباری دارد") hardReject.push("سپرده یا خرید اجباری ممنوع است");
  else score -= 10;
  if (input.escrow === "وجه در امانت قفل شده") score += 15;
  if (input.fee === "۰ تا ۱۰٪") score += 10;
  else if (input.fee === "بیشتر از ۱۰٪") score += 4;
  if (input.kyc !== "نامشخص") score += 5;
  if (input.stream !== "نامشخص") score += 5;
  score = Math.max(0, Math.min(100, score));
  if (hardReject.length) return { score: 0, decision: "رد خودکار", reason: hardReject.join("؛ ") };
  if (score >= 70) return { score, decision: "اولویت بالا", reason: "برای بررسی نهایی قرارداد و حساب مناسب است" };
  if (score >= 45) return { score, decision: "نیازمند بررسی", reason: "چند شرط مهم هنوز تأیید نشده است" };
  return { score, decision: "اولویت پایین", reason: "شواهد پرداخت، کشور یا هزینه‌ها کافی نیست" };
}

export default function OpportunityDiscovery({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("LaborX");
  const [stream, setStream] = useState("نوشتن و مقاله");
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
  const assessment = useMemo(() => scoreLead({ sourceUrl: proofUrl, payout, countryCheck, deposit, escrow, paymentAsset, fee, kyc, stream }), [proofUrl, payout, countryCheck, deposit, escrow, paymentAsset, fee, kyc, stream]);

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
      <p className="hub-intro">منابع رسمی را باز کن، سفارش واقعی را پیدا کن و لینک همان آگهی را وارد کن. موتور بر اساس پرداخت رمزارزی، کشور، سپرده، کارمزد و امانت‌داری امتیاز اولیه می‌دهد. امتیاز بالا به معنی تضمین درآمد یا تأیید قطعی نیست.</p>
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
        <select value={stream} onChange={e => setStream(e.target.value)} aria-label="نوع کار"><option>نوشتن و مقاله</option><option>موسیقی و صدا</option><option>رأی‌گیری آهنگ</option><option>نظرسنجی و تحقیقات بازار</option><option>عکس و ویدئو</option><option>نامشخص</option></select>
        <input value={pay} onChange={e => setPay(e.target.value)} placeholder="بودجه و واحد پرداخت" aria-label="بودجه"/>
        <input value={country} onChange={e => setCountry(e.target.value)} placeholder="کشورهای مجاز یا محدودیت‌ها" aria-label="محدودیت کشور"/>
        <select value={countryCheck} onChange={e => setCountryCheck(e.target.value)} aria-label="بررسی کشور"><option>هنوز بررسی نشده</option><option>مجاز بودن کشور تأیید شده</option><option>کشور مسدود است</option></select>
        <select value={payout} onChange={e => setPayout(e.target.value)} aria-label="روش پرداخت"><option>نامشخص</option><option>کیف پول مستقیم</option><option>رمزارز از طریق قرارداد</option><option>فیات یا کارت هدیه</option></select>
        <select value={paymentAsset} onChange={e => setPaymentAsset(e.target.value)} aria-label="ارز پرداخت"><option>نامشخص</option><option>USDT</option><option>USDC</option><option>XNO</option><option>سایر رمزارزها</option></select>
        <input value={network} onChange={e => setNetwork(e.target.value)} placeholder="شبکه دقیق پرداخت" aria-label="شبکه"/>
        <select value={deposit} onChange={e => setDeposit(e.target.value)} aria-label="سپرده و هزینه ورود"><option>هنوز بررسی نشده</option><option>بدون سپرده و خرید اجباری</option><option>سپرده یا خرید اجباری دارد</option></select>
        <select value={escrow} onChange={e => setEscrow(e.target.value)} aria-label="وضعیت امانت‌داری"><option>نامشخص</option><option>وجه در امانت قفل شده</option><option>بدون امانت‌داری</option></select>
        <select value={fee} onChange={e => setFee(e.target.value)} aria-label="کارمزد"><option>نامشخص</option><option>۰ تا ۱۰٪</option><option>بیشتر از ۱۰٪</option></select>
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
        <small>رد خودکار در صورت پرداخت غیررمزارزی، کشور مسدود یا سپرده/خرید اجباری. هنوز اتصال خودکار به API بازارها فعال نیست؛ این نسخه منابع رسمی و ارزیابی اولیه را یک‌جا می‌کند.</small>
      </div>
    </section>
  );
}
