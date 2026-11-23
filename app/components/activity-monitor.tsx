"use client";

import { useEffect, useState } from "react";

type Activity = {
  id: string;
  actor: "assistant" | "user" | "system";
  category: string;
  title: string;
  detail: string | null;
  status: "running" | "completed" | "needs_action" | "failed";
  requires_user_action: boolean;
  action_label: string | null;
  action_url: string | null;
  created_at: string;
};

const statusText: Record<Activity["status"], string> = {
  running: "در حال انجام",
  completed: "انجام شد",
  needs_action: "نیازمند اقدام تو",
  failed: "ناموفق"
};

export default function ActivityMonitor() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<Activity[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let busy = false;
    const refresh = async () => {
      if (busy) return;
      busy = true;
      try {
        const response = await fetch("/api/activity", { cache: "no-store" });
        const data = await response.json();
        if (!active) return;
        if (response.status === 401) {
          setAuthRequired(true);
          setConfigured(false);
          setError(data.error || "برای دیدن فعالیت‌ها وارد حساب پروژه شو.");
        } else if (!response.ok) {
          setError(data.error || "اتصال گزارش فعالیت در دسترس نیست.");
        } else {
          setAuthRequired(false);
          setConfigured(Boolean(data.configured));
          setEvents(Array.isArray(data.events) ? data.events : []);
          setError("");
        }
      } catch {
        if (active) setError("ارتباط با سرور گزارش فعالیت برقرار نشد.");
      } finally {
        busy = false;
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const pending = events.filter(event => event.requires_user_action || event.status === "needs_action").length;
  return (
    <div className="activity-monitor">
      <button className="activity-toggle" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
        <span className="activity-pulse" /> فعالیت‌های دستیار
        {pending > 0 && <b className="activity-count">{pending}</b>}
      </button>
      {open && <section className="activity-drawer" aria-label="گزارش زنده فعالیت‌ها">
        <header className="activity-header">
          <div><strong>گزارش فعالیت پروژه</strong><small>به‌روزرسانی خودکار هر ۵ ثانیه</small></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="بستن">×</button>
        </header>
        {authRequired ? <div className="activity-empty">{error}<p>ورود به حساب پروژه برای مشاهده گزارش لازم است؛ این اتصال به معنی دسترسی Gmail نیست.</p></div>
          : configured === false ? <div className="activity-empty">پایگاه داده گزارش هنوز راه‌اندازی نشده است.<p>پس از افزودن متغیرهای Supabase در Vercel و اجرای فایل SQL، گزارش چنددستگاهی فعال می‌شود.</p></div>
          : error ? <div className="activity-empty">{error}</div>
          : events.length === 0 ? <div className="activity-empty">هنوز رویداد واقعی ثبت نشده است.<p>وقتی گردش‌کار متصل، فعالیتی را ثبت کند، اینجا نمایش داده می‌شود. هیچ فعالیتی به‌صورت نمایشی ساخته نمی‌شود.</p></div>
          : <div className="activity-list">{events.map(event => <article className="activity-event" key={event.id}>
            <div className="activity-event-top"><span>{event.actor === "assistant" ? "دستیار" : event.actor === "user" ? "کاربر" : "سیستم"} · {event.category}</span><time>{new Date(event.created_at).toLocaleString("fa-IR")}</time></div>
            <strong>{event.title}</strong>
            {event.detail && <p>{event.detail}</p>}
            <div className="activity-event-bottom"><span className={`activity-status ${event.status}`}>{statusText[event.status]}</span>
              {event.action_url && event.action_label && <a href={event.action_url} target="_blank" rel="noreferrer">{event.action_label} ↗</a>}
            </div>
          </article>)}</div>}
      </section>}
    </div>
  );
}
