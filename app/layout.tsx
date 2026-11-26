import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Creative Earnings | مدیریت پروژه‌های تولید محتوا",
  description: "مدیریت شش مسیر درآمدی تولید محتوا، موسیقی، داوری، نظرسنجی، تولید تصویر و ویدئو و میکروتسک‌های مرورگری با پرداخت رمزارزی"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
