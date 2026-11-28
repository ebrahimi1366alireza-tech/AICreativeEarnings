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
  { name: "Dealwork AI", stream: "فریلنسری، نوشتن، تحقیق، ترجمه و طراحی", payout: "موجودی کیف پول دلاری؛ شارژ USDC روی Polygon مستند شده، اما برداشت رمزارزی به کیف پول شخصی هنوز تأیید نشده", kycStatus: "نامشخص · شرایط KYC انسانی و پذیرش تابعیت ایرانی/اقامت ارمنستان تأیید نشده", fit: "تابلوی عمومی شغل‌ها بدون ورود؛ escrow و کارمزد ۱۰٪ اعلام شده", url: "https://api.dealwork.ai/explore", note: "صفحه عمومی و API جست‌وجوی کار وجود دارد؛ روش برداشت را داخل Wallet و پیش از انجام کار بررسی کن. هیچ حساب یا عامل خودکاری متصل نشده است." },
  { name: "Airaa", stream: "کمپین بازاریابی محتوا", payout: "USDC اعلام‌شده", fit: "نیازمند بررسی کشور و KYC", url: "https://airaa.com/", note: "شبکه، حداقل برداشت و مسیر پرداخت باید تأیید شود." },
  { name: "ClipRush.net", stream: "کلیپ‌سازی", payout: "نامشخص", fit: "اطلاعات نسخه .net تأیید نشده", url: "https://cliprush.net/", note: "با دامنه‌های دیگر ClipRush اشتباه نشود." },
  { name: "MoltJobs", stream: "کارهای AI و microtask", payout: "USDC روی Base", fit: "فقط تسک با escrow واقعی؛ کشور/KYC نامشخص", url: "https://moltjobs.com/", note: "کارمزد اعلام‌شده ۵٪؛ بدون وثیقه یا پرداخت اولیه." },
  { name: "HireForHumans", stream: "میکروتسک", payout: "USDC روی Polygon", fit: "waitlist / تابلوی کار زنده تأیید نشده", url: "https://hireforhumans.com/", note: "تا مشاهده تسک واقعی، فرصت فعال محسوب نشود." },
  { name: "PublicAI Trajector", stream: "داده و ارزیابی AI", payout: "USDT / USDC", fit: "نیازمند بررسی؛ داده خصوصی ارسال نشود", url: "https://publicai.io/", note: "شرایط مجوز داده نشست و حریم خصوصی پیش از مشارکت بررسی شود." },
  { name: "LaborX", stream: "فریلنسری، طراحی، محتوا و خدمات دیجیتال", payout: "USDC / USDT / DAI روی Ethereum و BNB Chain؛ escrow", kycStatus: "نامشخص · نیازمند تأیید برای تابعیت ایرانی و اقامت ارمنستان", fit: "نامزد قابل بررسی؛ پلتفرم ۱۰٪ کارمزد فریلنسر اعلام می‌کند", url: "https://laborx.com/", note: "شرایط رسمی پرداخت رمزارزی و escrow دارد؛ هیچ عضویت Premium لازم نیست تا برای کار درخواست بدهی." },
  { name: "CryptoTask", stream: "فریلنسری، طراحی، ویدئو، نوشتن و دستیار دیجیتال", payout: "رمزارز؛ جزئیات دارایی/شبکه باید هنگام قرارداد تأیید شود", kycStatus: "نامشخص · در صفحات رسمی بررسی‌شده توضیح روشنی پیدا نشد", fit: "نامزد قابل بررسی؛ کشور و تابعیت نیازمند تأیید", url: "https://www.cryptotask.org/en", note: "پلتفرم escrow و کارمزد حداکثر ۳٪ را اعلام می‌کند؛ پیش از قبول سفارش، نوع ارز و شبکه را کتبی مشخص کن." },
  { name: "Dework", stream: "DAO bounty، محتوا، طراحی و کارهای Web3", payout: "توکن DAO یا دارایی تعیین‌شده در هر bounty", kycStatus: "نامشخص · نیازمند تأیید", fit: "نامزد مشروط؛ پرداخت USDC تضمین‌شده نیست", url: "https://app.dework.xyz/bounties", note: "تابلوی bounty فعال دارد؛ فقط تسک‌هایی را انتخاب کن که جایزه، شبکه و روش پرداختشان روشن است." },
  { name: "Open Bounty", stream: "کارهای خرد واقعی، بررسی محلی و جمع‌آوری شواهد", payout: "USDC از طریق x402 روی Base آزمایشی", kycStatus: "نامشخص · نیازمند تأیید", fit: "فعلاً فقط آزمایشی؛ درآمد واقعی تأیید نشده", url: "https://openbounty.app/", note: "مستندات رسمی API صریحاً بازار را testnet معرفی می‌کنند. تا وقتی شبکه production و پرداخت واقعی تأیید نشده، این منبع فقط در کاتالوگ می‌ماند و به فید زنده اضافه نمی‌شود." },
  { name: "Web3.Career", stream: "منبع فرصت‌های شغلی و قراردادی با پرداخت رمزارزی", payout: "بسته به کارفرما؛ آگهی‌های دارای برچسب Pay in Crypto", kycStatus: "KYC پلتفرم نامشخص؛ احراز هویت کارفرما جداگانه", fit: "منبع سرنخ، نه پرداخت‌کننده یا escrow", url: "https://web3.career/pay-in-crypto-jobs", note: "فقط آگهی remote که کشور محل اقامت و پرداخت مستقیم کیف پول را صریحاً قبول کند ارزش پیگیری دارد." },
  { name: "CryptoJobs.com", stream: "منبع فرصت‌های Web3، محتوا، بازاریابی و پشتیبانی", payout: "تعیین‌شده توسط کارفرما؛ پرداخت رمزارزی تضمین نیست", kycStatus: "KYC پلتفرم نامشخص؛ بسته به کارفرما", fit: "منبع سرنخ شغلی، نه پلتفرم پرداخت", url: "https://www.cryptojobs.com/public/jobs", note: "آگهی‌ها باید جداگانه از نظر remote، پذیرش ارمنستان، تابعیت ایرانی و روش پرداخت بررسی شوند." },
  { name: "Worqen", stream: "فریلنسری با escrow رمزارزی", payout: "USDC / USDT / EURC / SOL روی Solana", kycStatus: "محدودیت قطعی: تابعیت ایرانی در شرایط رسمی ممنوع است", displayStatus: "محدودیت قطعی · برای حساب کاربر واجد شرایط نیست", fit: "رد برای شرایط فعلی؛ KYC اجباری و منع صریح اتباع ایران", url: "https://worqen.com/legal/terms", note: "صرفاً برای ثبت دلیل عدم‌سازگاری نگه داشته شده؛ ثبت‌نام یا تلاش برای دور زدن محدودیت انجام نشود." },
  { name: "Anoworks", stream: "کارهای خرد", payout: "TRX", fit: "نیازمند بررسی؛ تسک تعامل مصنوعی ممنوع", url: "https://anoworks.com/", note: "فقط کار واقعی و غیرگمراه‌کننده قابل قبول است." }
];

export default function PlatformReviewCatalog() {
  return (
    <section className="panel vetted-opportunities" id="platform-review-catalog">
      <div className="panel-head"><div><span className="eyebrow">PLATFORM COMPATIBILITY REVIEW</span><h2>فهرست سایت‌های بررسی‌شده برای شرایط حساب</h2></div><span className="free-tag">{platforms.length} پلتفرم · بررسی اولیه</span></div>
      <p className="hub-intro">این فهرست عمداً سایت‌هایی را هم نگه می‌دارد که شرایط احراز هویت، پذیرش پاسپورت ایرانی یا کشور محل اقامتشان هنوز روشن نیست. این موارد با برچسب مستقل «KYC نامشخص» نمایش داده می‌شوند و حذف خودکار نمی‌شوند. معیار بررسی: اقامت ارمنستان، تابعیت و پاسپورت ایرانی، KYC، پرداخت مستقیم رمزارزی، کارمزد و نبود سپرده یا اشتراک اجباری.</p>
      <div className="lead-grid">
        {platforms.map((item) => (
          <article className="saved-opportunity" key={item.name}>
            <div><strong>{item.name} · {item.stream}</strong><p>{item.payout}</p><p className="opportunity-meta">{item.fit}</p><p>{item.note}</p><a href={item.url} target="_blank" rel="noreferrer">منبع و شرایط رسمی ↗</a></div>
            <span className="status">{item.displayStatus ?? `KYC: ${item.kycStatus ?? "نامشخص · نیازمند تأیید"}`}</span>
          </article>
        ))}
      </div>
      <p className="hub-footnote">ثبت در این فهرست به معنی تأیید نهایی کشور، احراز هویت یا امکان برداشت نیست. هیچ VPN، اطلاعات نادرست، سپرده، خرید اجباری یا هزینه آزادسازی برداشت مجاز نیست. ثبت‌نام و تأیید هویت فقط با اجازه کاربر انجام می‌شود.</p>
    </section>
  );
}
