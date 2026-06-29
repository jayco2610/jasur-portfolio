"use client";

import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import BlockedBadge from "@/components/BlockedBadge";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

export default function Home() {
  const { lang } = useLanguage();
  const h = t[lang].home;

  return (
    <div>
      <HeroSection />

      {/* Projects */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-10">
            {h.selectedWork}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {h.projects.map((p) => (
              <div
                key={p.name}
                className="p-6 bg-[#111111] border border-[#1f1f1f] rounded-lg hover:border-[#7C3AED]/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-sm font-bold text-white">{p.name}</span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    p.status === "live" || p.status === "в работе"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-blue-500/15 text-blue-400"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-4">{p.desc}</p>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] px-2 py-1 bg-white/5 text-white/40 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      className="font-mono text-[10px] text-[#a78bfa] hover:text-white transition-colors shrink-0">
                      Live →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/projects" className="font-mono text-sm text-[#a78bfa] hover:text-white transition-colors">
              {h.allProjects}
            </Link>
          </div>
        </div>
      </section>

      {/* AI Career System live counter */}
      <section className="border-t border-white/5 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <p className="font-mono text-xs text-emerald-400 tracking-[0.15em] uppercase">{h.liveLabel}</p>
          </div>
          <h2 className="font-mono text-lg font-bold text-white mb-2">{h.liveTitle}</h2>
          <p className="text-white/40 text-sm mb-8 max-w-xl">{h.liveDesc}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {h.liveStats.map((s) => (
              <div key={s.label} className="p-4 bg-[#111111] border border-emerald-500/10 rounded-lg">
                <p className="font-mono text-2xl font-bold text-emerald-400">{s.value}</p>
                <p className="font-mono text-[11px] text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className="border-t border-white/5 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">{h.byNumbers}</p>
          <p className="text-white/40 text-sm mb-8 max-w-2xl">{h.statsDesc}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {h.stats.map((s) => (
              <div key={s.value} className="p-5 bg-[#111111] border border-[#1f1f1f] rounded-lg">
                <p className="font-mono text-3xl font-bold text-[#a78bfa]">{s.value}</p>
                <p className="font-mono text-[11px] text-white/50 mt-1">{s.label}</p>
                <p className="font-mono text-[10px] text-white/25 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-8">{h.about}</p>
          <div className="max-w-2xl">
            <p className="text-white/70 leading-relaxed mb-4">{h.aboutP1}</p>
            <p className="text-white/50 leading-relaxed">{h.aboutP2}</p>
          </div>
          <div className="mt-10 flex gap-6 flex-wrap">
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/in/jasur-akhmadaliev" },
              { label: "Telegram", href: "https://t.me/pmvision_ai" },
              { label: "VC.ru", href: "https://vc.ru/id5991727" },
              { label: "Email", href: "mailto:jasurakhmadaliev283@gmail.com" },
            ].map((l) => (
              <a key={l.label} href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel={l.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="font-mono text-sm text-[#a78bfa] hover:text-white transition-colors">
                {l.label} →
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* JasurGPT hint */}
      <section className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-mono text-sm text-white/30">{h.gptHint}</p>
          <p className="font-mono text-sm text-[#a78bfa] mt-1">{h.gptCta}</p>
          <div className="mt-5 flex justify-center">
            <BlockedBadge hero />
          </div>
        </div>
      </section>
    </div>
  );
}
