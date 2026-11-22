"use client";

import { useEffect, useState } from "react";
import AccountConnections from "./components/account-connections";

const workflow = [
  { number: "۰۱", title: "کشف فرصت‌ها", detail: "پیدا کردن سفارش‌های واقعی و بررسی اعتبار کارفرما", state: "در صف راه‌اندازی" },
  { number: "۰۲", title: "بررسی شرایط", detail: "کنترل کشور مجاز، روش پرداخت، حق استفاده تجاری و زمان تحویل", state: "در صف راه‌اندازی" },
  { number: "۰۳", title: "تولید محتوا", detail: "انتخاب ابزار رایگان مناسب و ساخت تصویر یا ویدئو", state: "آماده طراحی" },
  { number: "۰۴", title: "کنترل کیفیت", detail: "بازبینی خروجی، اصلاح و آماده‌سازی فایل نهایی", state: "آماده طراحی" },
  { number: "۰۵", title: "تحویل و درآمد", detail: "ثبت تحویل، پیگیری دستمزد و ثبت درآمد رمزارزی دریافتی", state: "در صف راه‌اندازی" }
];

const tools = [
    { name: "Adobe Express", note: "پلن رایگان ۰ دلار؛ ویرایش پایه و تعداد محدودی تولید روزانه تصویر و ویدئوی ۵ ثانیه‌ای.", status: "برای بنر و مونتاژ تبلیغ؛ مجوز تجاری ویژگی‌های مولد را جداگانه بررسی کن", mark: "ADOBE", url: "https://www.adobe.com/express/pricing" },
  { name: "Canva Free", note: "تا ۲۰ استفاده از ابزارهای AI در ماه در پلن رایگان؛ سهمیه در اول هر ماه UTC بازنشانی می‌شود.", status: "برای بنر، پست و کاتالوگ؛ Canva AI استفاده تجاری را مجاز می‌داند اما خروجی ممکن است منحصربه‌فرد نباشد", mark: "CANVA", url: "https://www.canva.com/pricing/" },
  { name: "Dreamina", note: "اعتبار رایگان روزانه برای برخی گردش‌کارهای تصویر؛ تعداد اعتبار به مدل و تنظیمات بستگی دارد.", status: "برای تست تصویر؛ مجوز تجاری، واترمارک و دسترسی منطقه‌ای را پیش از تحویل مشتری تأیید کن", mark: "DREAMINA", url: "https://dreamina.capcut.com/" },
  { name: "CapCut", note: "تدوین پایه رایگان؛ امکانات AI و قالب‌ها ممکن است پولی یا منطقه‌ای باشند.", status: "فقط برای مونتاژ با دارایی‌های دارای مجوز تجاری؛ شرایط عمومی بسیاری از محتواها را غیرتجاری می‌داند", mark: "CAPCUT", url: "https://www.capcut.com/" },
  { name: "Adobe Firefly Music & Audio", note: "تولید موسیقی پس‌زمینه و افکت صوتی با اعتبار روزانه محدود در حساب رایگان.", status: "Adobe استفاده تجاری از موسیقی و افکت‌های نسخه منتشرشده را مجاز اعلام می‌کند؛ سهمیه رایگان و شرایط هر قابلیت را بررسی کن", mark: "FIRE AUDIO", url: "https://www.adobe.com/products/firefly/features/ai-music-generator.html" },
  { name: "Google Flow", note: "بدون اشتراک ۵۰ اعتبار روزانه؛ در ساعات اوج ممکن است تولید ویدئو محدود شود، اما تصویر و بعضی قابلیت‌ها در دسترس می‌مانند.", status: "ارمنستان در فهرست رسمی کشورهای پشتیبانی‌شده است؛ امکانات هر حساب و سهمیه را داخل Google بررسی کن", mark: "FLOW", url: "https://labs.google/fx/tools/flow" }
];

type Opportunity = { id: string; title: string; platform: string; pay: string; status: string };
type Delivery = { id: string; title: string; client: string; due: string; status: string };
type Income = { id: string; source: string; amount: number; currency: string; received: boolean; date: string };

export default function Home() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("creativeops-opportunities-v1");
      if (saved) setOpportunities(JSON.parse(saved) as Opportunity[]);
      const savedDeliveries = localStorage.getItem("creativeops-deliveries-v1");
      if (savedDeliveries) setDeliveries(JSON.parse(savedDeliveries) as Delivery[]);
      const savedIncome = localStorage.getItem("creativeops-income-v1");
      if (savedIncome) setIncome(JSON.parse(savedIncome) as Income[]);
    } catch { /* ignore invalid local data */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem("creativeops-opportunities-v1", JSON.stringify(opportunities));
  }, [opportunities, loaded]);
  useEffect(() => { if (loaded) { localStorage.setItem("creativeops-deliveries-v1", JSON.stringify(deliveries)); localStorage.setItem("creativeops-income-v1", JSON.stringify(income)); } }, [deliveries, income, loaded]);
  function addDelivery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const title = String(form.get("deliveryTitle") || "").trim(); if (!title) return;
    setDeliveries(rows => [{ id: crypto.randomUUID(), title, client: String(form.get("client") || "نامشخص"), due: String(form.get("due") || ""), status: "در حال آماده‌سازی" }, ...rows]); event.currentTarget.reset();
  }
  function addIncome(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const source = String(form.get("incomeSource") || "").trim(); const amount = Number(form.get("amount")); if (!source || !Number.isFinite(amount) || amount <= 0) return;
    setIncome(rows => [{ id: crypto.randomUUID(), source, amount, currency: "USDT", received: form.get("received") === "on", date: new Date().toISOString().slice(0,10) }, ...rows]); event.currentTarget.reset();
  }
  function addOpportunity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return;
    setOpportunities(current => [{ id: crypto.randomUUID(), title, platform: String(form.get("platform") || "نامشخص"), pay: String(form.get("pay") || "نامشخص"), status: "جدید" }, ...current]);
    event.currentTarget.reset();
  }
  function updateStatus(id: string, status: string) {
    setOpportunities(current => current.map(item => item.id === id ? { ...item, status } : item));
  }
  function removeOpportunity(id: string) {
    setOpportunities(current => current.filter(item => item.id !== id));
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
          <div className="hero-copy"><span className="pill">شروع بدون سرمایه</span><h2>اول سفارش معتبر،<br/><em>بعد تولید هوشمند.</em></h2><p>پنج مسیر درآمدی را مدیریت می‌کنیم؛ هر فرصت پیش از اقدام از نظر اعتبار، کشور مجاز و پرداخت مستقیم رمزارزی بررسی می‌شود.</p><a className="hero-link" href="#workflow">مشاهده مسیر اجرا <span>←</span></a></div>
          <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="art-core">✳<small>AI</small></div><div className="float-card card-a">✦ تصویر</div><div className="float-card card-b">▶ ویدئو</div><div className="float-card card-c">↗ درآمد</div></div>
        </section>

        <div className="section-heading"><div><span className="eyebrow">PERFORMANCE</span><h2>نمای کلی عملکرد</h2></div><span className="muted">هنوز سفارش یا درآمدی ثبت نشده است</span></div>
        <section className="stats">
          <article className="stat-card"><span className="stat-icon purple">⌕</span><span className="stat-label">فرصت‌های بررسی‌شده</span><strong>{opportunities.length}</strong><small>فرصت‌های ذخیره‌شده در این مرورگر</small></article>
          <article className="stat-card"><span className="stat-icon blue">▧</span><span className="stat-label">محتوای تولیدشده</span><strong>{deliveries.length}</strong><small>سفارش‌های ثبت‌شده برای تولید</small></article>
          <article className="stat-card"><span className="stat-icon green">⇧</span><span className="stat-label">تحویل‌های موفق</span><strong>{deliveries.filter(item => item.status === "تحویل شد").length}</strong><small>تحویل‌های ثبت‌شده</small></article>
          <article className="stat-card"><span className="stat-icon amber">$</span><span className="stat-label">درآمد دریافت‌شده</span><strong>${income.filter(item => item.received && item.currency === "USDT").reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</strong><small>فقط رمزارز دریافت‌شده به USDT</small></article>
        </section>

        <section className="content-grid" id="workflow">
          <div className="panel workflow-panel"><div className="panel-head"><div><span className="eyebrow">PIPELINE</span><h2>مراحل اجرای سفارش</h2></div><span className="counter">۰ از ۵</span></div><div className="workflow-list">{workflow.map((item) => <div className="workflow-row" key={item.number}><div className="step-number">{item.number}</div><div className="step-copy"><strong>{item.title}</strong><p>{item.detail}</p></div><span className="status">{item.state}</span></div>)}</div></div>
          <div className="panel goal-panel" id="finance"><span className="eyebrow">WEEKLY TARGET</span><h2>هدف هفته اول</h2><div className="goal-value">50 USDT</div><p>هدف آزمایشی است، نه درآمد تضمین‌شده. درآمد فقط پس از دریافت واقعی ثبت می‌شود.</p><div className="progress-track"><span></span></div><div className="goal-foot"><span>درآمد ثبت‌شده</span><strong>${income.filter(item => item.received && item.currency === "USD").reduce((sum, item) => sum + item.amount, 0).toFixed(2)} / $50</strong></div><div className="goal-note">هزینه شروع موردنظر: <b>$0</b></div></div>
        </section>

        <section className="panel tools-panel" id="tools"><div className="panel-head"><div><span className="eyebrow">FREE AI TOOLKIT</span><h2>مدیریت ابزارهای تولید</h2></div><span className="free-tag">اولویت با رایگان‌ها</span></div><div className="tool-grid">{tools.map((tool) => <article className="tool-card" key={tool.mark}><div className="tool-mark">{tool.mark}</div><div><strong>{tool.name}</strong><p>{tool.note}</p><small>{tool.status}</small><a href={tool.url} target="_blank" rel="noreferrer" style={{display:"inline-block",marginTop:7,color:"#b9a4ff",fontSize:10,textDecoration:"none"}}>بازکردن ابزار ↗</a></div></article>)}</div><p className="footnote">این فهرست برای سفارش‌های تولید محتوا و تبلیغات دراپ‌شیپینگ مشترک است. سهمیه روزانه تضمین‌شده نیست؛ منطقه، محدودیت خروجی، واترمارک و مجوز تجاری باید داخل حساب و شرایط رسمی هر ابزار کنترل شود.</p></section>

        <AccountConnections />

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
            <div className="income-manager-stats"><div><small>مسیرهای درآمدی</small><strong>۵</strong></div><div><small>درآمد تأییدشده</small><strong>0 USDT</strong></div><div><small>هزینه ابزار</small><strong>$0</strong></div></div>
          </div>
          <p className="hub-footnote">این بخش فعلاً رابط و نقشه اجرایی است؛ هنوز به پلتفرم‌های نظرسنجی، بازار سفارش متن/موسیقی یا شبکه‌های تسک متصل نشده. هیچ درآمدی تضمین‌شده نیست. ثبت‌نام، احراز هویت و تأییدهای مالی فقط با دخالت و تأیید خودت انجام می‌شود؛ هیچ هزینه یا سپرده‌ای برای بازکردن تسک پرداخت نمی‌کنیم.</p>
        </section>



        <section className="panel vetted-opportunities" id="verified-opportunities">
          <div className="panel-head"><div><span className="eyebrow">CRYPTO-ONLY OPPORTUNITIES</span><h2>فرصت‌های درآمدی با برداشت رمزارزی</h2></div><span className="free-tag">بدون پرداخت اولیه</span></div>
          <p className="hub-intro">فقط پلتفرم‌هایی در این فهرست می‌مانند که روش برداشت رمزارزی را اعلام کرده‌اند. «جهانی» به معنی دسترسی در همه کشورها نیست؛ محدودیت کشور، احراز هویت، موجودی تسک و شرایط هر حساب باید پیش از شروع بررسی شود.</p>
          <div className="lead-grid"><div className="empty-state"><span>⌕</span><strong>هنوز فرصت تأییدشده‌ای وجود ندارد</strong><p>تا زمانی که برداشت مستقیم رمزارزی، حداقل برداشت، کارمزد و دسترسی کشور تأیید نشود، هیچ پلتفرمی به‌عنوان فرصت معتبر معرفی نمی‌شود.</p></div></div>
          <p className="hub-footnote">قانون ثابت پروژه: PayPal، Payoneer، Wise، کارت هدیه و برداشت بانکی پذیرفته نیست. هیچ Deposit، خرید، اشتراک یا هزینه‌ای برای بازکردن تسک پرداخت نمی‌شود. ابتدا کشور واقعی و روش برداشت داخل حساب را بررسی می‌کنیم، سپس یک برداشت کوچک آزمایشی می‌گیریم. هیچ محدودیت کشوری را با VPN یا اطلاعات نادرست دور نمی‌زنیم.</p>
        </section>

        <section className="bottom-grid"><div className="panel" id="opportunities"><span className="eyebrow">OPPORTUNITY RADAR</span><h2>فرصت‌های درآمدی</h2><form onSubmit={addOpportunity} className="opportunity-form">
              <input name="title" required placeholder="عنوان سفارش یا فرصت" aria-label="عنوان فرصت"/>
              <input name="platform" placeholder="پلتفرم / کارفرما" aria-label="پلتفرم"/>
              <input name="pay" placeholder="مبلغ و روش پرداخت" aria-label="مبلغ و روش پرداخت"/>
              <button type="submit">+ ثبت فرصت</button>
            </form>
            {opportunities.length === 0 ? <div className="empty-state"><span>⌕</span><strong>هنوز فرصتی ثبت نشده</strong><p>فرصت‌های واقعی را اینجا ثبت کن؛ اطلاعات در همین مرورگر ذخیره می‌شود.</p></div> :
              <div className="saved-opportunities">{opportunities.map(item => <article className="saved-opportunity" key={item.id}>
                <div><strong>{item.title}</strong><p>{item.platform} · {item.pay}</p></div>
                <select aria-label="وضعیت فرصت" value={item.status} onChange={e => updateStatus(item.id, e.target.value)}>
                  <option>جدید</option><option>در حال بررسی</option><option>درخواست ارسال شد</option><option>پذیرفته شد</option><option>رد شد</option><option>تحویل شد</option><option>پرداخت شد</option>
                </select>
                <button type="button" className="remove-opportunity" onClick={() => removeOpportunity(item.id)} aria-label="حذف فرصت">×</button>
              </article>)}</div>}</div><div className="panel" id="production"><span className="eyebrow">CREATION DESK</span><h2>میز تولید و پیگیری تحویل</h2>
          <form className="opportunity-form" onSubmit={addDelivery}><input name="deliveryTitle" required placeholder="عنوان سفارش / نوع محتوا" aria-label="عنوان سفارش"/><input name="client" placeholder="مشتری یا پلتفرم" aria-label="مشتری"/><input name="due" type="date" aria-label="مهلت تحویل"/><button type="submit">+ ثبت سفارش تولید</button></form>
          {deliveries.length === 0 ? <div className="empty-state"><span>✧</span><strong>هنوز سفارش تولیدی ثبت نشده</strong><p>سفارش پذیرفته‌شده را اینجا ثبت و تا تحویل پیگیری کن.</p></div> : <div className="saved-opportunities">{deliveries.map(item => <article className="saved-opportunity" key={item.id}><div><strong>{item.title}</strong><p>{item.client}{item.due ? " · مهلت: "+item.due : ""}</p></div><select aria-label="وضعیت تحویل" value={item.status} onChange={e => setDeliveries(rows => rows.map(row => row.id === item.id ? {...row,status:e.target.value} : row))}><option>در حال آماده‌سازی</option><option>در انتظار بازبینی</option><option>آماده تحویل</option><option>تحویل شد</option><option>لغو شد</option></select><button type="button" className="remove-opportunity" onClick={() => setDeliveries(rows => rows.filter(row => row.id !== item.id))} aria-label="حذف سفارش">×</button></article>)}</div>}
        </div></section>
        <section className="panel income-log"><div className="panel-head"><div><span className="eyebrow">PAYMENT TRACKER</span><h2>ثبت درآمد و پرداخت‌ها</h2></div><span className="free-tag">ثبت دستی و شفاف</span></div><p className="hub-intro">فقط پرداخت رمزارزی که واقعاً به کیف پول رسیده باشد ثبت می‌شود. پرداخت فیات در این دفتر پذیرفته نیست.</p>
          <form className="income-form" onSubmit={addIncome}><input name="incomeSource" required placeholder="منبع درآمد / سفارش" aria-label="منبع درآمد"/><input name="amount" type="number" min="0.01" step="0.01" required placeholder="مبلغ" aria-label="مبلغ"/><select name="currency" aria-label="واحد پول"><option value="USDT">USDT</option></select><label className="received-check"><input name="received" type="checkbox"/> واقعاً دریافت شده</label><button type="submit">+ ثبت درآمد</button></form>
          {income.length === 0 ? <div className="empty-state"><span>$</span><strong>هنوز پرداختی ثبت نشده</strong><p>درآمد واقعی را پس از دریافت ثبت کن.</p></div> : <div className="saved-opportunities">{income.map(item => <article className="saved-opportunity" key={item.id}><div><strong>{item.source}</strong><p>{item.date} · {item.amount.toFixed(2)} {item.currency}</p></div><label className="received-check"><input type="checkbox" checked={item.received} onChange={e => setIncome(rows => rows.map(row => row.id === item.id ? {...row,received:e.target.checked} : row))}/>{item.received ? "دریافت شده" : "در انتظار دریافت"}</label><button type="button" className="remove-opportunity" onClick={() => setIncome(rows => rows.filter(row => row.id !== item.id))} aria-label="حذف درآمد">×</button></article>)}</div>}
        </section>

        <footer id="deliveries"><span>CREATIVEOPS · نسخه ۰.۲.۰</span><span>ساخته‌شده برای گردش‌کار کم‌هزینه و شفاف</span></footer>
      </section>
    </main>
  );
}
