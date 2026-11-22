import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Creative Earnings | مدیریت پروژه‌های تولید محتوا",
  description: "مدیریت فرصت‌های پولی ساخت تصویر و ویدئو با ابزارهای هوش مصنوعی"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
