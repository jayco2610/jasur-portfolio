"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

const statusColors: Record<string, string> = {
  live: "bg-emerald-500/15 text-emerald-400",
  shipped: "bg-blue-500/15 text-blue-400",
  "in progress": "bg-[#7C3AED]/15 text-[#a78bfa]",
  "в работе": "bg-emerald-500/15 text-emerald-400",
  "запущен": "bg-blue-500/15 text-blue-400",
};

export default function ProjectsPage() {
  const { lang } = useLanguage();
  const p = t[lang].projects;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">{p.label}</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-2">{p.title}</h1>
      <p className="text-white/40 text-sm mb-14">{p.subtitle}</p>

      <div className="space-y-5">
        {p.projects.map((proj) => (
          <div key={proj.name} className="p-6 bg-[#111111] border border-[#1f1f1f] rounded-lg hover:border-[#7C3AED]/20 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-mono text-sm font-bold text-white">{proj.name}</h2>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${statusColors[proj.status] ?? "bg-white/5 text-white/40"}`}>
                  {proj.status}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-white/30 hover:text-white transition-colors">
                    GitHub →
                  </a>
                )}
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-[#a78bfa] hover:text-white transition-colors">
                    Live →
                  </a>
                )}
              </div>
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-4">{proj.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {proj.stack.map((s) => (
                <span key={s} className="font-mono text-[10px] px-2.5 py-1 rounded bg-white/5 border border-white/5 text-white/40">
                  {s}
                </span>
              ))}
            </div>

            <ul className="space-y-1">
              {proj.metrics.map((m) => (
                <li key={m} className="font-mono text-[10px] text-white/30 flex items-center gap-2">
                  <span className="text-[#7C3AED]">+</span>{m}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Open Source */}
      <div className="mt-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-2">{p.openSource}</p>
        <p className="text-white/40 text-sm mb-8">{p.openSourceDesc}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {p.repos.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
              className="p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg hover:border-[#7C3AED]/30 transition-colors group">
              <p className="font-mono text-xs font-bold text-white/80 group-hover:text-white transition-colors mb-2">{r.name}</p>
              <p className="text-white/40 text-xs leading-relaxed">{r.description}</p>
            </a>
          ))}
        </div>
        <div className="mt-5">
          <a href="https://github.com/jayco2610" target="_blank" rel="noopener noreferrer"
            className="font-mono text-sm text-[#a78bfa] hover:text-white transition-colors">
            {p.allRepos}
          </a>
        </div>
      </div>
    </div>
  );
}
