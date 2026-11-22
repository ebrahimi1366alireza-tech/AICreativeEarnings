"use client";

import { useEffect, useState } from "react";

const workflow = [
  { number: "۰۱", title: "کشف فرصت‌ها", detail: "پیدا کردن سفارش‌های واقعی و بررسی اعتبار کارفرما", state: "در صف راه‌اندازی" },
  { number: "۰۲", title: "بررسی شرایط", detail: "کنترل کشور مجاز، روش پرداخت، حق استفاده تجاری و زمان تحویل", state: "در صف راه‌اندازی" },
  { number: "۰۳", title: "تولید محتوا", detail: "انتخاب ابزار رایگان مناسب و ساخت تصویر یا ویدئو", state: "آماده طراحی" },
  { number: "۰۴", title: "کنترل کیفیت", detail: "بازبینی خروجی، اصلاح و آماده‌سازی فایل نهایی", state: "آماده طراحی" },
  { number: "۰۵", title: "تحویل و درآمد", detail: "ثبت تحویل، پیگیری دستمزد و ثبت درآمد دریافتی", state: "در صف راه‌اندازی" }
];

const tools = [
  { name: "ابزارهای تولید تصویر", note: "اعتبار رایگان روزانه یا ماهانه", status: "نیازمند بررسی سهمیه و مجوز تجاری", mark: "IMG" },
  { name: "ابزارهای تولید ویدئو", note: "اعتبار رایگان محدود", status: "نیازمند بررسی دسترسی منطقه‌ای", mark: "VID" },
  { name: "ابزارهای تدوین و ارتقای کیفیت", note: "نسخه رایگان یا متن‌باز", status: "در مرحله انتخاب", mark: "EDIT" }
];

type Opportunity = { id: string; title: string; platform: string; pay: string; status: string };

export default function Home() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("creativeops-opportunities-v1");
      if (saved) setOpportunities(JSON.parse(saved) as Opportunity[]);
    } catch { /* ignore invalid local data */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem("creativeops-opportunities-v1", JSON.stringify(opportunities));
  }, [opportunities, loaded]);
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
        <a className="nav-item" href="#tools"><span>◈</span> ابزارهای هوش مصنوعی</a>
        <a className="nav-item" href="#deliveries"><span>⇧</span> تحویل‌ها</a>
        <a className="nav-item" href="#finance"><span>＄</span> درآمدها</a>
        <div className="sidebar-bottom"><div className="avatar">AI</div><div><strong>مدیریت پروژه</strong><small>نسخه آزمایشی شخصی</small></div></div>
      </aside>

      <section className="main" id="overview">
        <header className="topbar"><div><div className="eyebrow">WORKSPACE / OVERVIEW</div><h1>استودیوی درآمد خلاق</h1><p>از پیدا کردن سفارش تا آماده‌سازی خروجی، همه‌چیز در یک جا.</p></div><div className="top-actions"><span className="live-dot">● محیط آزمایشی</span><div className="date-chip">۲۲ نوامبر ۲۰۲۶</div></div></header>

        <section className="hero">
          <div className="hero-copy"><span className="pill">شروع بدون سرمایه</span><h2>اول سفارش معتبر،<br/><em>بعد تولید هوشمند.</em></h2><p>سیستم را طوری می‌سازیم که ابتدا فرصت‌های واقعی و قابل پرداخت را پیدا کند؛ بعد با ابزارهای رایگان یا دارای اعتبار روزانه، خروجی مناسب سفارش را آماده کنیم.</p><a className="hero-link" href="#workflow">مشاهده مسیر اجرا <span>←</span></a></div>
          <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="art-core">✳<small>AI</small></div><div className="float-card card-a">✦ تصویر</div><div className="float-card card-b">▶ ویدئو</div><div className="float-card card-c">↗ درآمد</div></div>
        </section>

        <div className="section-heading"><div><span className="eyebrow">PERFORMANCE</span><h2>نمای کلی عملکرد</h2></div><span className="muted">هنوز سفارش یا درآمدی ثبت نشده است</span></div>
        <section className="stats">
          <article className="stat-card"><span className="stat-icon purple">⌕</span><span className="stat-label">فرصت‌های بررسی‌شده</span><strong>۰</strong><small>پس از اتصال منابع نمایش داده می‌شود</small></article>
          <article className="stat-card"><span className="stat-icon blue">▧</span><span className="stat-label">محتوای تولیدشده</span><strong>۰</strong><small>تصویر و ویدئوی تأییدشده</small></article>
          <article className="stat-card"><span className="stat-icon green">⇧</span><span className="stat-label">تحویل‌های موفق</span><strong>۰</strong><small>فقط تحویل‌های ثبت‌شده</small></article>
          <article className="stat-card"><span className="stat-icon amber">$</span><span className="stat-label">درآمد دریافت‌شده</span><strong>$0</strong><small>هدف آزمایشی هفته اول: $50</small></article>
        </section>

        <section className="content-grid" id="workflow">
          <div className="panel workflow-panel"><div className="panel-head"><div><span className="eyebrow">PIPELINE</span><h2>مراحل اجرای سفارش</h2></div><span className="counter">۰ از ۵</span></div><div className="workflow-list">{workflow.map((item) => <div className="workflow-row" key={item.number}><div className="step-number">{item.number}</div><div className="step-copy"><strong>{item.title}</strong><p>{item.detail}</p></div><span className="status">{item.state}</span></div>)}</div></div>
          <div className="panel goal-panel" id="finance"><span className="eyebrow">WEEKLY TARGET</span><h2>هدف هفته اول</h2><div className="goal-value">$50</div><p>هدف آزمایشی است، نه درآمد تضمین‌شده. درآمد فقط پس از دریافت واقعی ثبت می‌شود.</p><div className="progress-track"><span></span></div><div className="goal-foot"><span>درآمد ثبت‌شده</span><strong>$0 / $50</strong></div><div className="goal-note">هزینه شروع موردنظر: <b>$0</b></div></div>
        </section>

        <section className="panel tools-panel" id="tools"><div className="panel-head"><div><span className="eyebrow">FREE AI TOOLKIT</span><h2>مدیریت ابزارهای تولید</h2></div><span className="free-tag">اولویت با رایگان‌ها</span></div><div className="tool-grid">{tools.map((tool) => <article className="tool-card" key={tool.mark}><div className="tool-mark">{tool.mark}</div><div><strong>{tool.name}</strong><p>{tool.note}</p><small>{tool.status}</small></div></article>)}</div><p className="footnote">سهمیه رایگان، محدودیت کشور، مجوز استفاده تجاری و امکان خروجی بدون واترمارک باید پیش از استفاده برای هر سفارش تأیید شود.</p></section>

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
              </article>)}</div>}</div><div className="panel" id="production"><span className="eyebrow">CREATION DESK</span><h2>میز تولید محتوا</h2><div className="empty-state"><span>✧</span><strong>آماده اتصال ابزارها</strong><p>تولید فقط بر اساس سفارش و مجوز استفاده مشخص انجام می‌شود.</p></div></div></section>

        <footer id="deliveries"><span>CREATIVEOPS · نسخه ۰.۱.۰</span><span>ساخته‌شده برای گردش‌کار کم‌هزینه و شفاف</span></footer>
      </section>
    </main>
  );
}
