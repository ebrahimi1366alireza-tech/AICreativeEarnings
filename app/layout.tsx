import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Creative Earnings | مدیریت پروژه‌های تولید محتوا",
  description: "مدیریت پنج مسیر درآمدی تولید محتوا، موسیقی، داوری، نظرسنجی و تولید تصویر و ویدئو با پرداخت رمزارزی"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
