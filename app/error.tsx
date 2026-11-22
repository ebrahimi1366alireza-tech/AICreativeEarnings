"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep diagnostics in the browser console without exposing internals to visitors.
    console.error("AI Creative Earnings page error:", error);
  }, [error]);

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#0b0b12",
        color: "#f7f5ff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "28px",
          border: "1px solid #343044",
          borderRadius: "18px",
          background: "#15131f",
          textAlign: "right",
        }}
      >
        <p style={{ color: "#b9a4ff", marginTop: 0 }}>AI CREATIVE EARNINGS</p>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>
          مشکلی در بارگذاری این بخش پیش آمد
        </h1>
        <p style={{ color: "#c8c3d6", lineHeight: 1.9 }}>
          اطلاعات ذخیره‌شده شما عمداً پاک یا بازنویسی نشده‌اند. می‌توانید
          بارگذاری این صفحه را دوباره امتحان کنید. اگر خطا ادامه داشت، صفحه را
          دوباره بارگذاری کنید و شناسه خطا را برای بررسی نگه دارید.
        </p>
        {error.digest ? (
          <p style={{ color: "#a9a2b8", fontSize: "0.85rem" }}>
            شناسه خطا: <code>{error.digest}</code>
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "12px",
            padding: "12px 18px",
            border: 0,
            borderRadius: "10px",
            background: "#8b6cff",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          تلاش دوباره
        </button>
      </section>
    </main>
  );
}
