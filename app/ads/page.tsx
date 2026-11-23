import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Creative Earnings | فرصت‌های تولید محتوای دیجیتال",
  description: "ابزاری برای بررسی فرصت‌های فریلنسری و مدیریت فرایند تولید و تحویل محتوای دیجیتال با کمک هوش مصنوعی.",
  alternates: { canonical: "/ads" },
};

const steps = [
  ["۱", "بررسی فرصت‌ها", "اطلاعات سفارش‌ها و پلتفرم‌ها را پیش از اقدام بررسی و مقایسه کنید."],
  ["۲", "آماده‌سازی محتوا", "برای نگارش، طراحی تصویر و ویدئو از ابزارهای مناسب کمک بگیرید."],
  ["۳", "بازبینی و تحویل", "خروجی را از نظر کیفیت، شرایط سفارش و حقوق استفاده بررسی کنید."],
];

export default function AdsLandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0e14] text-[#eef2fa]" dir="rtl">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
          <a href="/ads" className="flex items-center gap-3 no-underline text-white">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 text-xl font-black">AI</span>
            <span><strong className="block text-sm tracking-wide">AI CREATIVE EARNINGS</strong><small className="text-xs text-slate-400">ابزار مدیریت کارهای خلاقانه</small></span>
          </a>
          <a href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">ورود به پنل</a>
        </header>

        <section className="grid items-center gap-12 py-16 md:grid-cols-[1.15fr_.85fr] md:py-24">
          <div>
            <span className="inline-flex rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs text-violet-200">ابزار برنامه‌ریزی و مدیریت تولید محتوا</span>
            <h1 className="mt-6 text-4xl font-black leading-[1.55] sm:text-5xl">ایده‌های خلاقانه را به <span className="text-violet-300">فرایند کاری</span> منظم تبدیل کنید.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">AI Creative Earnings به شما کمک می‌کند فرصت‌های فریلنسری مرتبط با محتوای دیجیتال را بررسی کنید، مراحل تولید را سازمان‌دهی کنید و فایل‌های نهایی را برای بازبینی و تحویل آماده نگه دارید.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/" className="rounded-xl bg-violet-500 px-6 py-3 font-bold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-400">مشاهده پنل پروژه <span aria-hidden="true">←</span></a>
              <a href="#how-it-works" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10">نحوه کار</a>
            </div>
            <p className="mt-5 text-xs leading-6 text-slate-500">این ابزار درآمد یا پذیرش سفارش را تضمین نمی‌کند. شرایط هر پلتفرم، کشور محل اقامت، هزینه‌ها و روش پرداخت باید پیش از ثبت‌نام یا انجام کار جداگانه بررسی شوند.</p>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="relative rounded-3xl border border-violet-300/20 bg-[#141b2a] p-6 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-5"><span className="text-sm font-bold">گردش کار محتوا</span><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">نمای کلی</span></div>
              {steps.map(([n, title, desc]) => <div key={n} className="mt-5 flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-400/15 font-bold text-violet-200">{n}</span><div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-400">{desc}</p></div></div>)}
              <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs leading-6 text-slate-400">تصمیم نهایی درباره ثبت‌نام، ارسال سفارش، انتشار محتوا و دریافت وجه با خود کاربر است.</p></div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-white/10 py-14">
          <div className="max-w-2xl"><p className="text-xs font-bold tracking-widest text-violet-300">HOW IT WORKS</p><h2 className="mt-3 text-2xl font-extrabold">یک مسیر روشن از فرصت تا تحویل</h2><p className="mt-3 leading-7 text-slate-400">ابزارها و منابع را کنار هم ببینید و پیش از قبول هر پروژه، جزئیات آن را بررسی کنید.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([n, title, desc]) => <article key={n} className="rounded-2xl border border-white/10 bg-[#121722] p-6"><span className="text-sm font-bold text-violet-300">{n}</span><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{desc}</p></article>)}
          </div>
        </section>

        <section className="rounded-3xl border border-violet-300/20 bg-gradient-to-l from-violet-950/50 to-[#141b2a] p-7 sm:p-10">
          <h2 className="text-2xl font-extrabold">برای آشنایی بیشتر، پنل پروژه را ببینید.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">در پنل، ابزارها و مراحل مدیریت فرصت‌ها و تولید محتوا در یک فضای کاری جمع شده‌اند.</p>
          <a href="/" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-violet-100">رفتن به AI Creative Earnings</a>
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-white/10 py-7 text-xs leading-6 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} AI Creative Earnings</span>
          <span>ابزار کمکی برای سازمان‌دهی کار؛ بدون تضمین درآمد یا نتیجه استخدام.</span>
        </footer>
      </div>
    </main>
  );
}
