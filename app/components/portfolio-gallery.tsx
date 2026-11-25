"use client";

import { useEffect, useState } from "react";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  createdAt: string;
  size: number;
  path?: string;
};

const STORAGE_KEY = "creativeops-portfolio-v1";
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 3 * 1024 * 1024;
const MAX_ITEMS = 20;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cloudMode, setCloudMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function refreshCloudGallery() {
    const response = await fetch("/api/portfolio", { cache: "no-store" });
    const data = await response.json() as { items?: PortfolioItem[]; error?: string };
    if (!response.ok) throw new Error(data.error || "خواندن گالری ابری ناموفق بود.");
    setItems(Array.isArray(data.items) ? data.items : []);
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item): item is PortfolioItem =>
            Boolean(item) && typeof item.id === "string" &&
            typeof item.title === "string" && typeof item.category === "string" &&
            typeof item.image === "string" && item.image.startsWith("data:image/") &&
            typeof item.createdAt === "string" &&
            (item.size === undefined || (typeof item.size === "number" && item.size > 0))
          ).slice(0, MAX_ITEMS));
        }
      }
    } catch {
      setNotice("اطلاعات گالری قابل خواندن نبود؛ فایل‌های اصلی دستگاه حذف نشده‌اند.");
    }
    setLoaded(true);

    let active = true;
    void fetch("/api/auth/status", { cache: "no-store" })
      .then(response => response.json())
      .then(async auth => {
        if (!active || !auth.connected) return;
        const response = await fetch("/api/portfolio", { cache: "no-store" });
        if (!response.ok) throw new Error("گالری ابری فعلاً در دسترس نیست؛ اطلاعات محلی دست‌نخورده باقی ماند.");
        const data = await response.json() as { items?: PortfolioItem[] };
        if (!active) return;
        setCloudMode(true);
        setItems(Array.isArray(data.items) ? data.items : []);
        setNotice("گالری به فضای ابری خصوصی حساب متصل شد.");
      })
      .catch(error => { if (active) setNotice(error instanceof Error ? error.message : "اتصال گالری ابری ناموفق بود."); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loaded || cloudMode) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      setNotice("فضای ذخیره‌سازی مرورگر کافی نیست. چند تصویر بزرگ را حذف کن و دوباره تلاش کن.");
    }
  }, [items, loaded, cloudMode]);

  async function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") || "").trim();
    const category = String(data.get("category") || "تبلیغات و محصول");
    const file = data.get("image");
    if (!title || !(file instanceof File) || file.size === 0) {
      setNotice("عنوان و فایل تصویر را انتخاب کن.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setNotice("فقط تصویر JPG، PNG، WebP یا GIF مجاز است.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setNotice("حجم هر تصویر باید حداکثر ۱.۵ مگابایت باشد.");
      return;
    }
    if (items.length >= MAX_ITEMS) {
      setNotice("گالری به سقف ۲۰ تصویر رسیده است. ابتدا یک مورد را حذف کن.");
      return;
    }
    if (!cloudMode) {
      const storedBytes = items.reduce((total, item) => total + (item.size || 0), 0);
      if (storedBytes + file.size > MAX_TOTAL_SIZE) {
        setNotice("برای جلوگیری از پرشدن حافظه مرورگر، مجموع حجم تصاویر باید کمتر از ۳ مگابایت بماند. چند تصویر را حذف یا کوچک کن.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string" || !reader.result.startsWith("data:image/")) {
          setNotice("خواندن تصویر ناموفق بود.");
          return;
        }
        setItems(current => [{
          id: crypto.randomUUID(), title, category, image: reader.result as string,
          createdAt: new Date().toISOString(), size: file.size
        }, ...current]);
        setNotice("نمونه‌کار فقط در همین دستگاه ذخیره شد. برای همگام‌سازی ابری وارد حساب شو.");
        form.reset();
      };
      reader.onerror = () => setNotice("مرورگر نتوانست فایل تصویر را بخواند.");
      reader.readAsDataURL(file);
      return;
    }

    setBusy(true);
    try {
      const upload = new FormData();
      upload.set("title", title);
      upload.set("category", category);
      upload.set("image", file);
      const response = await fetch("/api/portfolio", { method: "POST", body: upload });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "بارگذاری تصویر ناموفق بود.");
      await refreshCloudGallery();
      setNotice("نمونه‌کار در فضای ابری خصوصی حساب ذخیره شد.");
      form.reset();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "بارگذاری تصویر ناموفق بود.");
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(item: PortfolioItem) {
    if (item.path) {
      setBusy(true);
      try {
        const response = await fetch("/api/portfolio", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: item.path })
        });
        const result = await response.json() as { error?: string };
        if (!response.ok) throw new Error(result.error || "حذف نمونه‌کار ناموفق بود.");
        setItems(current => current.filter(row => row.id !== item.id));
        setNotice("نمونه‌کار از فضای ابری خصوصی حذف شد.");
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "حذف نمونه‌کار ناموفق بود.");
      } finally {
        setBusy(false);
      }
      return;
    }
    setItems(current => current.filter(row => row.id !== item.id));
    setNotice("نمونه‌کار از گالری این دستگاه حذف شد.");
  }

  return (
    <section className="panel portfolio-panel" id="portfolio">
      <div className="panel-head">
        <div><span className="eyebrow">MY CREATIVE PORTFOLIO</span><h2>گالری نمونه‌کارهای هوش مصنوعی</h2></div>
        <span className="free-tag">{cloudMode ? "فضای ابری خصوصی" : "ذخیره محلی"}</span>
      </div>
      <p className="hub-intro">خروجی‌های واقعی ساخته‌شده با ابزارهای هوش مصنوعی را اینجا اضافه کن. با ورود به حساب، تصاویر در فضای ابری خصوصی و جداگانه برای همان حساب ذخیره می‌شوند؛ بدون ورود، فقط روی همین دستگاه می‌مانند. هیچ تصویر عمومی نیست.</p>
      <form className="portfolio-form" onSubmit={addItem}>
        <input name="title" required maxLength={80} placeholder="عنوان نمونه‌کار" aria-label="عنوان نمونه‌کار" />
        <select name="category" aria-label="دسته‌بندی نمونه‌کار">
          <option>تبلیغات و محصول</option>
          <option>هویت بصری و برند</option>
          <option>پوستر و شبکه‌های اجتماعی</option>
          <option>محتوای سفر و گردشگری</option>
          <option>تصویرسازی و هنر دیجیتال</option>
          <option>ویدئو و موشن</option>
          <option>سایر</option>
        </select>
        <label className="portfolio-file">انتخاب تصویر <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></label>
        <button type="submit" disabled={busy}>{busy ? "در حال انجام..." : "+ افزودن به گالری"}</button>
      </form>
      <p className="portfolio-notice" role="status">{notice || "حداکثر ۲۰ تصویر، هرکدام تا ۱.۵ مگابایت. برای جلوگیری از نمونه‌کار ساختگی، فقط فایل‌هایی نمایش داده می‌شوند که خودت اضافه کنی."}</p>
      {!loaded ? <div className="empty-state">در حال بارگذاری گالری…</div> : items.length === 0 ? (
        <div className="empty-state"><span>✧</span><strong>هنوز نمونه‌کاری اضافه نشده</strong><p>اولین خروجی واقعی خودت را از تصویرساز یا ابزار طراحی انتخاب کن و به گالری اضافه کن. هیچ تصویر ساختگی به‌صورت پیش‌فرض نمایش داده نمی‌شود.</p></div>
      ) : (
        <div className="portfolio-grid">
          {items.map(item => (
            <article className="portfolio-card" key={item.id}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="portfolio-card-info">
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <button type="button" disabled={busy} onClick={() => void removeItem(item)} aria-label={`حذف ${item.title}`}>حذف نمونه‌کار</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
