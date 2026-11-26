"use client";

const platforms = [
  { name: "Subnano", stream: "فروش محتوای دیجیتال", payout: "Nano / USDC روی Base", fit: "نیازمند بررسی حساب", url: "https://subnano.ai/faq", note: "کارمزد فروش و شرایط کشور/KYC را پیش از انتشار بررسی کن." },
  { name: "Microworker.app", stream: "میکروتسک و تست وب", payout: "USDT / USDC", fit: "ارمنستان در فهرست مجاز؛ تابعیت و سابقه حساب نیازمند بررسی", url: "https://microworker.app/eligibility/", note: "حداقل برداشت اعلام‌شده ۵ دلار؛ استفاده از داخل ایران ممنوع است." },
  { name: "Loopuman", stream: "تحقیق، ترجمه و ارزیابی AI", payout: "USDT / USDC / USDm روی Celo", fit: "نیازمند تأیید KYC و کشور", url: "https://loopuman.com/browse-tasks", note: "سهم پلتفرم اعلام‌شده ۲۰٪ است." },
  { name: "SurveyTokens", stream: "نظرسنجی و تحقیقات بازار", payout: "IOTA", fit: "فقط مسیر IOTA برای بررسی؛ USDT به‌علت محدودیت پردازشگر تأیید نمی‌شود", url: "https://surveytokens.org/terms", note: "حداقل برداشت اعلام‌شده ۰٫۵۰ دلار؛ پذیرش ارمنستان و مدارک باید تأیید شود." },
  { name: "Taskmarket", stream: "نوشتن و طراحی", payout: "USDC / OUSD", fit: "نیازمند بررسی کشور و تسک", url: "https://taskmarket.dev/tasks", note: "تسک‌های نیازمند TAP Verified یا وثیقه کنار گذاشته شوند." },
  { name: "Monero.Jobs", stream: "پروژه‌های فریلنسری", payout: "XMR مستقیم", kycStatus: "بدون KYC اجباری اعلام‌شده؛ تأیید مستقل نشده", fit: "قابل بررسی؛ ریسک معامله مستقیم", url: "https://monero.jobs/jobs", note: "بدون KYC اجباری اعلام شده؛ اعتبار مشتری باید جداگانه سنجیده شود." },
  { name: "XmrBazaar", stream: "بازار همتا‌به‌همتا", payout: "XMR", fit: "قابل بررسی؛ ریسک طرف معامله", url: "https://xmrbazaar.com/", note: "پیش از شروع کار، سازوکار امانت و شرایط معامله را بررسی کن." },
  { name: "GIMI", stream: "کمپین محتوایی", payout: "USDC از شریک پرداخت", fit: "نیازمند بررسی KYC و پذیرش پاسپورت", url: "https://gimi.xyz/", note: "کارمزد و حداقل برداشت اعلام‌شده باید در حساب تأیید شود." },
  { name: "make.fun", stream: "مسابقات و bounty", payout: "USDC روی Solana", fit: "نیازمند بررسی محدودیت تحریم و کشور", url: "https://make.fun/", note: "کارمزد شبکه SOL ممکن است لازم شود؛ هیچ وثیقه‌ای نپرداز." },
  { name: "Superteam Earn", stream: "Bounty و پروژه‌های Solana", payout: "رمزارز، بسته به bounty", fit: "نیازمند بررسی KYC و پذیرش پاسپورت", url: "https://earn.superteam.fun/", note: "شرایط هر جایزه و پرداخت‌کننده جداگانه بررسی شود." },
  { name: "Human Protocol", stream: "برچسب‌گذاری و ارزیابی داده", payout: "HMT", fit: "نیازمند تأیید Civic و مدارک", url: "https://www.humanprotocol.org/", note: "پذیرش پاسپورت ایرانی و دسترسی ارمنستان نامشخص است." },
  { name: "ClipFlip", stream: "ویدئوی کوتاه و کلیپ‌سازی", payout: "رمزارز، جزئیات نامشخص", fit: "اطلاعات رسمی ناکافی", url: "https://clipflip.com/", note: "روش برداشت و کشورهای مجاز قبل از ثبت‌نام باید تأیید شود." },
  { name: "Airaa", stream: "کمپین بازاریابی محتوا", payout: "USDC اعلام‌شده", fit: "نیازمند بررسی کشور و KYC", url: "https://airaa.com/", note: "شبکه، حداقل برداشت و مسیر پرداخت باید تأیید شود." },
  { name: "ClipRush.net", stream: "کلیپ‌سازی", payout: "نامشخص", fit: "اطلاعات نسخه .net تأیید نشده", url: "https://cliprush.net/", note: "با دامنه‌های دیگر ClipRush اشتباه نشود." },
  { name: "MoltJobs", stream: "کارهای AI و microtask", payout: "USDC روی Base", fit: "فقط تسک با escrow واقعی؛ کشور/KYC نامشخص", url: "https://moltjobs.com/", note: "کارمزد اعلام‌شده ۵٪؛ بدون وثیقه یا پرداخت اولیه." },
  { name: "HireForHumans", stream: "میکروتسک", payout: "USDC روی Polygon", fit: "waitlist / تابلوی کار زنده تأیید نشده", url: "https://hireforhumans.com/", note: "تا مشاهده تسک واقعی، فرصت فعال محسوب نشود." },
  { name: "PublicAI Trajector", stream: "داده و ارزیابی AI", payout: "USDT / USDC", fit: "نیازمند بررسی؛ داده خصوصی ارسال نشود", url: "https://publicai.io/", note: "شرایط مجوز داده نشست و حریم خصوصی پیش از مشارکت بررسی شود." },
  { name: "Anoworks", stream: "کارهای خرد", payout: "TRX", fit: "نیازمند بررسی؛ تسک تعامل مصنوعی ممنوع", url: "https://anoworks.com/", note: "فقط کار واقعی و غیرگمراه‌کننده قابل قبول است." }
];

export default function PlatformReviewCatalog() {
  return (
    <section className="panel vetted-opportunities" id="platform-review-catalog">
      <div className="panel-head"><div><span className="eyebrow">PLATFORM COMPATIBILITY REVIEW</span><h2>فهرست سایت‌های بررسی‌شده برای شرایط حساب</h2></div><span className="free-tag">۱۸ پلتفرم · بررسی اولیه</span></div>
      <p className="hub-intro">این فهرست عمداً سایت‌هایی را هم نگه می‌دارد که شرایط احراز هویت، پذیرش پاسپورت ایرانی یا کشور محل اقامتشان هنوز روشن نیست. این موارد با برچسب مستقل «KYC نامشخص» نمایش داده می‌شوند و حذف خودکار نمی‌شوند. معیار بررسی: اقامت ارمنستان، تابعیت و پاسپورت ایرانی، KYC، پرداخت مستقیم رمزارزی، کارمزد و نبود سپرده یا اشتراک اجباری.</p>
      <div className="lead-grid">
        {platforms.map((item) => (
          <article className="saved-opportunity" key={item.name}>
            <div><strong>{item.name} · {item.stream}</strong><p>{item.payout}</p><p className="opportunity-meta">{item.fit}</p><p>{item.note}</p><a href={item.url} target="_blank" rel="noreferrer">منبع و شرایط رسمی ↗</a></div>
            <span className="status">KYC: {item.kycStatus ?? "نامشخص · نیازمند تأیید"}</span>
          </article>
        ))}
      </div>
      <p className="hub-footnote">ثبت در این فهرست به معنی تأیید نهایی کشور، احراز هویت یا امکان برداشت نیست. هیچ VPN، اطلاعات نادرست، سپرده، خرید اجباری یا هزینه آزادسازی برداشت مجاز نیست. ثبت‌نام و تأیید هویت فقط با اجازه کاربر انجام می‌شود.</p>
    </section>
  );
}
