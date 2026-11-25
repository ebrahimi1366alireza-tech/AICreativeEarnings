"use client";

import { useEffect, useState } from "react";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  createdAt: string;
};

const STORAGE_KEY = "creativeops-portfolio-v1";
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_ITEMS = 30;

export default function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");

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
            typeof item.createdAt === "string"
          ).slice(0, MAX_ITEMS));
        }
      }
    } catch {
      setNotice("اطلاعات گالری قابل خواندن نبود؛ فایل‌های اصلی دستگاه حذف نشده‌اند.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      setNotice("فضای ذخیره‌سازی مرورگر کافی نیست. چند تصویر بزرگ را حذف کن و دوباره تلاش کن.");
    }
  }, [items, loaded]);

  function addItem(event: React.FormEvent<HTMLFormElement>) {
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
    if (!file.type.startsWith("image/")) {
      setNotice("فقط فایل تصویری قابل افزودن است.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setNotice("حجم هر تصویر باید کمتر از ۴ مگابایت باشد.");
      return;
    }
    if (items.length >= MAX_ITEMS) {
      setNotice("گالری به سقف ۳۰ تصویر رسیده است. ابتدا یک مورد را حذف کن.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string" || !reader.result.startsWith("data:image/")) {
        setNotice("خواندن تصویر ناموفق بود.");
        return;
      }
      setItems(current => [{
        id: crypto.randomUUID(),
        title,
        category,
        image: reader.result as string,
        createdAt: new Date().toISOString()
      }, ...current]);
      setNotice("نمونه‌کار به گالری همین دستگاه اضافه شد.");
      form.reset();
    };
    reader.onerror = () => setNotice("مرورگر نتوانست فایل تصویر را بخواند.");
    reader.readAsDataURL(file);
  }

  function removeItem(id: string) {
    setItems(current => current.filter(item => item.id !== id));
    setNotice("نمونه‌کار از گالری این دستگاه حذف شد.");
  }

  return (
    <section className="panel portfolio-panel" id="portfolio">
      <div className="panel-head">
        <div><span className="eyebrow">MY CREATIVE PORTFOLIO</span><h2>گالری نمونه‌کارهای هوش مصنوعی</h2></div>
        <span className="free-tag">ذخیره محلی · بدون هزینه</span>
      </div>
      <p className="hub-intro">خروجی‌های واقعی ساخته‌شده با ابزارهای هوش مصنوعی را اینجا اضافه کن. دسته‌بندی‌ها برای نمونه‌کارهای غیرغذایی آماده شده‌اند. تصویر و عنوان فقط روی همین مرورگر ذخیره می‌شوند و به سرور یا مشتری ارسال نمی‌شوند.</p>
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
        <label className="portfolio-file">انتخاب تصویر <input name="image" type="file" accept="image/*" required /></label>
        <button type="submit">+ افزودن به گالری</button>
      </form>
      <p className="portfolio-notice" role="status">{notice || "حداکثر ۳۰ تصویر، هرکدام تا ۴ مگابایت. برای جلوگیری از نمونه‌کار ساختگی، فقط فایل‌هایی نمایش داده می‌شوند که خودت اضافه کنی."}</p>
      {!loaded ? <div className="empty-state">در حال بارگذاری گالری…</div> : items.length === 0 ? (
        <div className="empty-state"><span>✧</span><strong>هنوز نمونه‌کاری اضافه نشده</strong><p>اولین خروجی واقعی خودت را از تصویرساز یا ابزار طراحی انتخاب کن و به گالری اضافه کن. هیچ تصویر غذایی یا نمونه ساختگی به‌صورت پیش‌فرض نمایش داده نمی‌شود.</p></div>
      ) : (
        <div className="portfolio-grid">
          {items.map(item => (
            <article className="portfolio-card" key={item.id}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="portfolio-card-info">
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <button type="button" onClick={() => removeItem(item.id)} aria-label={`حذف ${item.title}`}>حذف نمونه‌کار</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
