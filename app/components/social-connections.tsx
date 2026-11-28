"use client";

import { useEffect, useMemo, useState } from "react";

type SocialService = {
  id: string; name: string; group: "social" | "community"; purpose: string; permissionNote: string; limitation: string;
};

const SERVICES: SocialService[] = [
  { id: "instagram", name: "Instagram", group: "social", purpose: "کمپین‌های سازنده، محتوای UGC و تسک‌های شبکه اجتماعی", permissionNote: "دسترسی حساب حرفه‌ای و داده‌های مجاز؛ هر مجوز باید جداگانه بررسی شود.", limitation: "API رسمی اجازه فالو/لایک عمومی و خودکار را نمی‌دهد." },
  { id: "youtube", name: "YouTube", group: "social", purpose: "کمپین ویدئو، بررسی کانال و فعالیت‌های سازنده", permissionNote: "فقط محدوده‌های OAuth موردنیاز همان تسک.", limitation: "اقداماتی مثل Subscribe از طریق API برای این کاربرد عمومی در دسترس نیست." },
  { id: "telegram", name: "Telegram", group: "community", purpose: "عضویت کانال و گروه، اطلاعیه‌ها و کامیونیتی", permissionNote: "اتصال ربات با ورود حساب شخصی متفاوت است؛ نوع اتصال دقیق باید مشخص شود.", limitation: "ربات تلگرام نماینده حساب شخصی کاربر نیست." },
  { id: "discord", name: "Discord", group: "community", purpose: "عضویت سرور، رویدادها و مأموریت‌های کامیونیتی", permissionNote: "مجوزهای OAuth یا نصب ربات باید محدود به نیاز تسک باشد.", limitation: "نصب ربات به معنی اتصال حساب شخصی یا اجازه هر نوع اقدام نیست." },
  { id: "x", name: "X (Twitter)", group: "social", purpose: "کمپین‌های سازنده، پست و فعالیت‌های اجتماعی", permissionNote: "فقط OAuth رسمی و مجوزهای واقعاً در دسترس.", limitation: "دسترسی API ممکن است محدود یا پولی باشد؛ هیچ هزینه‌ای خودکار پذیرفته نمی‌شود." },
  { id: "facebook", name: "Facebook", group: "social", purpose: "کمپین‌های صفحه، گروه و محتوای اجتماعی", permissionNote: "مجوزهای رسمی Meta و نوع حساب/صفحه باید بررسی شود.", limitation: "دسترسی‌ها و انتشار محتوا به نوع حساب و تأیید Meta وابسته است." },
  { id: "tiktok", name: "TikTok", group: "social", purpose: "کمپین ویدئوی کوتاه و همکاری سازندگان", permissionNote: "OAuth و مجوزهای رسمی متناسب با قابلیت موردنیاز.", limitation: "فالو، لایک و تعامل خودکار عمومی تضمین‌شده یا مجاز فرض نمی‌شود." },
  { id: "pinterest", name: "Pinterest", group: "social", purpose: "پین، محتوای تصویری و کمپین‌های سازنده", permissionNote: "دسترسی رسمی فقط برای قابلیت‌های تأییدشده.", limitation: "قابلیت‌های API و انتشار به مجوزهای حساب وابسته است." },
  { id: "reddit", name: "Reddit", group: "community", purpose: "انجمن‌ها، مأموریت‌های کامیونیتی و مشارکت واقعی", permissionNote: "OAuth با حداقل scope و رعایت قوانین هر subreddit.", limitation: "ارسال انبوه، رأی جعلی و تعامل دستکاری‌شده ممنوع است." },
  { id: "snapchat", name: "Snapchat", group: "social", purpose: "کمپین‌های محتوای کوتاه و سازندگان", permissionNote: "فقط قابلیت‌های مجاز در برنامه رسمی توسعه‌دهندگان.", limitation: "اتصال کامل حساب و اقدامات تعاملی عمومی تضمین‌شده نیست." },
  { id: "linkedin", name: "LinkedIn", group: "social", purpose: "محتوای حرفه‌ای، برند شخصی و کمپین‌های سازنده", permissionNote: "مجوزهای محدود و تأییدشده LinkedIn.", limitation: "بخش زیادی از APIها نیازمند تأیید دسترسی هستند." },
  { id: "whatsapp", name: "WhatsApp", group: "community", purpose: "اطلاع‌رسانی و ارتباطات مجاز کمپین", permissionNote: "WhatsApp Business Platform با حساب شخصی WhatsApp یکی نیست.", limitation: "اتصال Business API به معنی دسترسی به پیام‌های شخصی نیست." },
  { id: "slack", name: "Slack", group: "community", purpose: "عضویت workspace و همکاری پروژه‌ای", permissionNote: "OAuth یا نصب اپ با حداقل scope لازم.", limitation: "عضویت workspace و مجوزهای مدیر ممکن است لازم باشد." },
  { id: "twitch", name: "Twitch", group: "social", purpose: "کمپین استریم، کانال و تعامل سازنده", permissionNote: "OAuth رسمی برای داده‌ها و قابلیت‌های مجاز.", limitation: "برخی عملیات نیازمند نقش یا مجوز ویژه کانال است." },
  { id: "threads", name: "Threads", group: "social", purpose: "کمپین‌های متنی و محتوای سازنده", permissionNote: "مجوزهای رسمی Meta/Threads در صورت پشتیبانی.", limitation: "قابلیت‌های API با تعاملات داخل اپ یکسان نیست." },
  { id: "mastodon", name: "Mastodon", group: "social", purpose: "فعالیت اجتماعی و کامیونیتی‌های مستقل", permissionNote: "اتصال به سرور انتخابی کاربر با OAuth همان سرور.", limitation: "هر سرور قوانین، دامنه و سیاست دسترسی خودش را دارد." },
  { id: "bluesky", name: "Bluesky", group: "social", purpose: "محتوای اجتماعی و کمپین‌های سازنده", permissionNote: "روش احراز هویت امن و مجوزهای قابل پشتیبانی باید بررسی شود.", limitation: "رمز اصلی حساب نباید در اپ ذخیره شود؛ از روش‌های امن رسمی استفاده می‌شود." }
];

const STORAGE_KEY = "creativeops-social-connection-requests-v1";

export default function SocialConnections() {
  const [requested, setRequested] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "social" | "community">("all");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setRequested(saved.filter((id): id is string => typeof id === "string" && SERVICES.some(service => service.id === id)));
    } catch { setRequested([]); }
  }, []);

  const visible = useMemo(() => SERVICES.filter(service => filter === "all" || service.group === filter), [filter]);

  function toggleRequest(id: string) {
    setRequested(current => {
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="panel social-connections-panel" id="social-connections">
      <div className="panel-head">
        <div><span className="eyebrow">OPTIONAL SOCIAL ACCESS</span><h2>مرکز اتصال شبکه‌های اجتماعی و کامیونیتی</h2></div>
        <span className="free-tag">اتصال فقط هنگام نیاز تسک</span>
      </div>
      <p className="connection-intro">این فهرست ۱۷ سرویس را پوشش می‌دهد. وضعیت همه فعلاً «متصل نیست» است؛ هنوز OAuth یا اتصال واقعی برای این سرویس‌ها در اپ فعال نشده. می‌توانی نیاز به آماده‌سازی هر اتصال را در صف ثبت کنی. این کار حساب را متصل نمی‌کند و هیچ رمز یا مجوزی دریافت نمی‌شود.</p>
      <div className="social-connection-toolbar">
        <div className="social-filter" role="group" aria-label="فیلتر سرویس‌ها">
          <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>همه ({SERVICES.length})</button>
          <button type="button" className={filter === "social" ? "active" : ""} onClick={() => setFilter("social")}>شبکه اجتماعی</button>
          <button type="button" className={filter === "community" ? "active" : ""} onClick={() => setFilter("community")}>کامیونیتی</button>
        </div>
        <span className="social-queue-count">در صف آماده‌سازی: {requested.length}</span>
      </div>
      <div className="social-connection-grid">
        {visible.map(service => {
          const queued = requested.includes(service.id);
          return (
            <article className="social-connection-card" key={service.id}>
              <div className="social-card-top">
                <div><strong>{service.name}</strong><small>{service.group === "social" ? "شبکه اجتماعی" : "کامیونیتی و ارتباطات"}</small></div>
                <span className="social-not-connected">متصل نیست</span>
              </div>
              <p>{service.purpose}</p>
              <small><b>مجوز احتمالی:</b> {service.permissionNote}</small>
              <small className="social-limitation"><b>محدودیت:</b> {service.limitation}</small>
              <button type="button" className={queued ? "social-queued-button" : "social-request-button"} onClick={() => toggleRequest(service.id)}>
                {queued ? "حذف از صف آماده‌سازی" : "ثبت نیاز به آماده‌سازی اتصال"}
              </button>
            </article>
          );
        })}
      </div>
      <div className="social-connection-policy">
        <strong>قواعد امنیت و استفاده</strong>
        <ul>
          <li>اتصال فقط وقتی درخواست می‌شود که یک تسک مشخص واقعاً به آن نیاز داشته باشد.</li>
          <li>در نسخه اتصال واقعی، فقط OAuth یا روش رسمی سرویس با حداقل مجوز استفاده می‌شود؛ رمز عبور شبکه اجتماعی ذخیره نمی‌شود.</li>
          <li>هر اقدام مانند فالو، عضویت، لایک، ارسال پیام یا انتشار محتوا نیازمند تأیید جداگانه کاربر است.</li>
          <li>اگر API رسمی محدود، پولی یا غیرمجاز باشد، سرویس با همان محدودیت نمایش داده می‌شود؛ هیچ اشتراک یا API پولی خودکار فعال نمی‌شود.</li>
          <li>قطع اتصال، لغو مجوز و حذف امن توکن‌ها باید در نسخه OAuth واقعی پشتیبانی شود.</li>
        </ul>
      </div>
    </section>
  );
}
