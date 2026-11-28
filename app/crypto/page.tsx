import Link from "next/link";

const modules = [
  { title: "تحلیل امنیت کیف پول", status: "در مرحله طراحی", detail: "بررسی مجوزها، تراکنش‌های پیشنهادی و الگوهای پرخطر؛ بدون دریافت کلید خصوصی یا عبارت بازیابی." },
  { title: "تحلیل قرارداد هوشمند", status: "در مرحله طراحی", detail: "شروع با قراردادهای EVM و تحلیل ایستا روی کد یا آدرس عمومی؛ هر نتیجه نیازمند بازبینی انسانی است." },
  { title: "هوش فرصت‌های Web3", status: "متصل به مسیر فرصت‌ها", detail: "ثبت فرصت‌های باگ‌بانتی و خدمات امنیتی مجاز همراه با بررسی محدوده، شرایط کشور، KYC و پرداخت." },
  { title: "گزارش و پیگیری", status: "در مرحله طراحی", detail: "ثبت شواهد، شدت، وضعیت بررسی و گزارش مسئولانه؛ هیچ گزارشی خودکار ارسال نمی‌شود." }
];

export default function CryptoAiPage() {
  return (
    <main className="shell">
      <section className="main" style={{ maxWidth: 1120, margin: "0 auto", width: "100%" }}>
        <header className="topbar">
          <div><div className="eyebrow">AI CREATIVE EARNINGS / CRYPTO AI</div><h1>مرکز هوش مصنوعی کریپتو</h1><p>یک ماژول داخلی برای امنیت Web3 و فرصت‌های درآمدی مجاز؛ نه یک اپلیکیشن جداگانه.</p></div>
          <Link className="hero-link" href="/">بازگشت به داشبورد ←</Link>
        </header>
        <section className="hero" style={{ marginTop: 22 }}>
          <div className="hero-copy"><span className="pill">ماژول داخلی · توسعه مرحله‌ای</span><h2>امنیت بیشتر،<br/><em>فرصت‌های معتبرتر.</em></h2><p>این بخش از زیرساخت مشترک حساب کاربری و فضای کاری AI Creative Earnings استفاده می‌کند. اولویت با بررسی امن و فقط‌خواندنی است؛ هیچ اسکن زنده بدون مجوز و هیچ تراکنشی بدون تأیید مستقیم کاربر انجام نمی‌شود.</p></div>
          <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="art-core">◇<small>WEB3</small></div><div className="float-card card-a">◈ امنیت</div><div className="float-card card-b">⌕ تحلیل</div><div className="float-card card-c">↗ فرصت</div></div>
        </section>
        <div className="section-heading"><div><span className="eyebrow">CRYPTO AI MODULES</span><h2>قابلیت‌های ماژول</h2></div><span className="muted">وضعیت واقعی توسعه</span></div>
        <section className="tool-grid">
          {modules.map((item) => <article className="tool-card" key={item.title}><div className="tool-mark">◇</div><div><strong>{item.title}</strong><p>{item.detail}</p><small>{item.status}</small></div></article>)}
        </section>
        <section className="panel" style={{ marginTop: 22 }}>
          <div className="panel-head"><div><span className="eyebrow">WALLET CONNECTIVITY</span><h2>اتصال کیف پول</h2></div><span className="free-tag">طراحی امن</span></div>
          <p className="hub-intro">هدف فنی: اتصال استاندارد و مستقل از مرورگر، با پشتیبانی تدریجی از کیف پول‌های سازگار با EVM و آزمایش سازگاری در Mises Browser اندروید. وجود افزونه یا Provider باید در خود مرورگر بررسی شود؛ پشتیبانی قطعی تا پایان آزمایش اعلام نمی‌شود.</p>
          <div className="tool-grid">
            <article className="tool-card"><div className="tool-mark">M</div><div><strong>Mises Browser</strong><p>محیط آزمایش اندروید برای شناسایی Provider و افزونه‌های کیف پول سازگار.</p><small>سازگاری نیازمند آزمایش</small></div></article>
            <article className="tool-card"><div className="tool-mark">EVM</div><div><strong>MetaMask و OKX Wallet</strong><p>هدف اتصال از مسیر استاندارد؛ اتصال واقعی و امضای پیام هنوز فعال نشده است.</p><small>در صف پیاده‌سازی</small></div></article>
          </div>
          <p className="footnote">هرگز Seed Phrase یا Private Key در اپ دریافت یا ذخیره نمی‌شود. اتصال کیف پول، امضای پیام و انتقال دارایی سه مجوز جدا هستند. هیچ برداشت یا امضای خودکاری وجود نخواهد داشت.</p>
        </section>
        <section className="panel" style={{ marginTop: 22 }}>
          <div className="panel-head"><div><span className="eyebrow">SAFETY GATES</span><h2>قواعد غیرقابل‌چشم‌پوشی</h2></div></div>
          <ul className="hub-intro" style={{ lineHeight: 2 }}>
            <li>فقط دارایی‌ها و قراردادهای داخل محدوده مجاز یا محیط محلی و تست‌نت بررسی می‌شوند.</li>
            <li>هیچ تست مخرب، سرقت دارایی، فیشینگ یا دور زدن احراز هویت انجام نمی‌شود.</li>
            <li>نتایج ابزارها فرضیه‌اند تا زمانی که شواهد و بازبینی انسانی آن‌ها را تأیید کند.</li>
            <li>ارسال گزارش، اتصال حساس، امضای کیف پول و هر تراکنش نیازمند تأیید صریح کاربر است.</li>
            <li>هیچ API یا سرویس پولی بدون تأیید قبلی فعال نمی‌شود.</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
