"use client";

import { useEffect, useState } from "react";

// Live security badge.
// - widget (default): hidden until /api/stats returns a real positive number.
// - hero: always visible ("Prompt-injection hardened"), appends the live count
//   once real probes have been blocked. No faked numbers.
export default function BlockedBadge({ hero = false }: { hero?: boolean }) {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.blocked === "number") setN(d.blocked);
      })
      .catch(() => {});
  }, []);

  // Widget variant stays hidden until there is a real positive count.
  if (!hero && (n == null || n <= 0)) return null;

  const count = n ?? 0;
  const label = hero
    ? count > 0
      ? `Prompt-injection hardened · ${count.toLocaleString()} blocked`
      : "Prompt-injection hardened"
    : `${count.toLocaleString()} prompt-injection ${count === 1 ? "attempt" : "attempts"} blocked`;

  return (
    <span className="font-mono text-[10px] text-emerald-300/70 inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
      {label}
    </span>
  );
}
