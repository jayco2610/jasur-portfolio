"use client";

import { useEffect, useState } from "react";

// Live "N probes blocked" badge. Renders nothing until /api/stats returns a
// real positive number (i.e. once Upstash is connected and probes exist).
export default function BlockedBadge() {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.blocked === "number" && d.blocked > 0) setN(d.blocked);
      })
      .catch(() => {});
  }, []);

  if (n == null) return null;

  return (
    <span className="font-mono text-[10px] text-emerald-300/70 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
      {n.toLocaleString()} prompt-injection {n === 1 ? "attempt" : "attempts"} blocked
    </span>
  );
}
