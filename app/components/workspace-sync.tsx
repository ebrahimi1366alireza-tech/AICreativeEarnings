"use client";

import { useEffect } from "react";

const keys = [
  "creativeops-opportunities-v1",
  "creativeops-deliveries-v1",
  "creativeops-income-v1",
  "creativeops-wallet-v1",
  "creativeops-connections-v1"
];

function readLocal() {
  const data: Record<string, unknown> = {};
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try { data[key] = JSON.parse(raw); } catch { data[key] = raw; }
    }
  }
  return data;
}

function hasData(data: Record<string, unknown>) {
  return Object.keys(data).length > 0;
}

function writeLocal(data: Record<string, unknown>) {
  for (const key of keys) {
    if (!(key in data)) continue;
    localStorage.setItem(key, JSON.stringify(data[key]));
  }
}

export default function WorkspaceSync() {
  useEffect(() => {
    let stopped = false;
    let connected = false;
    let initialized = false;
    let lastSnapshot = "";

    async function syncOnce() {
      if (stopped) return;
      try {
        const status = await fetch("/api/auth/status", { cache: "no-store" });
        const auth = await status.json();
        if (!auth.connected) {
          connected = false;
          initialized = false;
          lastSnapshot = "";
          return;
        }
        if (!connected || !initialized) {
          const response = await fetch("/api/workspace", { cache: "no-store" });
          if (!response.ok) return;
          const result = await response.json();
          const remote = result.data as Record<string, unknown> | null;
          if (remote && hasData(remote)) {
            writeLocal(remote);
            lastSnapshot = JSON.stringify(remote);
          } else {
            const local = readLocal();
            const save = await fetch("/api/workspace", {
              method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: local })
            });
            if (!save.ok) return;
            lastSnapshot = JSON.stringify(local);
          }
          connected = true;
          initialized = true;
          return;
        }
        const local = readLocal();
        const snapshot = JSON.stringify(local);
        if (snapshot !== lastSnapshot) {
          const response = await fetch("/api/workspace", {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: local })
          });
          if (response.ok) lastSnapshot = snapshot;
        }
      } catch {
        // Keep local work available; retry on the next interval.
      }
    }

    void syncOnce();
    const timer = window.setInterval(() => { void syncOnce(); }, 5000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, []);

  return null;
}
