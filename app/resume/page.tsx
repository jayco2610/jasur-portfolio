"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

const certifications = [
  { name: "AI for Product Manager", issuer: "DeepLearning.AI · Coursera", year: "Jun 2025", icon: "AI" },
  { name: "CJM and CustDev Tools", issuer: "ProductStar", year: "2026", icon: "PM" },
  { name: "Metrics and Models for Project Managers", issuer: "Shelf", year: "2025", icon: "PM" },
];

const channels = {
  en: { name: "@pmvision_ai", sub: "Telegram channel · AI, product, career" },
  ru: { name: "@pmvision_ai", sub: "Telegram-канал · AI, продукт, карьера" },
};

export default function ResumePage() {
  const { lang } = useLanguage();
  const r = t[lang].resume;
  const ch = channels[lang];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-14 gap-6 flex-wrap">
        <div>
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">{r.label}</p>
          <h1 className="font-mono text-3xl font-bold text-white mb-2">{r.name}</h1>
          <p className="text-white/50 text-sm">{r.title}</p>
          <div className="flex gap-4 mt-3 flex-wrap">
            <a href="mailto:jasurakhmadaliev283@gmail.com" className="font-mono text-xs text-white/30 hover:text-white transition-colors">
              jasurakhmadaliev283@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/jasur-akhmadaliev" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-[#a78bfa] hover:text-white transition-colors">LinkedIn →</a>
            <a href="https://github.com/jayco2610" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-[#a78bfa] hover:text-white transition-colors">GitHub →</a>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <a href="/resume.pdf" download
            className="font-mono text-sm px-4 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors">
            {r.pdfEn}
          </a>
          <a href="/resume-ru.pdf" download
            className="font-mono text-sm px-4 py-2.5 border border-[#7C3AED]/40 text-[#a78bfa] rounded hover:bg-[#7C3AED]/10 transition-colors">
            {r.pdfRu}
          </a>
        </div>
      </div>

      {/* Education */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">{r.education}</p>
        <div className="pl-5 border-l border-[#222]">
          <div className="flex items-baseline gap-3 mb-1 flex-wrap">
            <span className="font-mono text-sm font-bold text-white">{r.hse}</span>
            <span className="font-mono text-[10px] text-white/25 ml-auto">{r.hseLocation}</span>
          </div>
          <p className="text-white/40 text-sm">{r.hseDegree}</p>
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">{r.certifications}</p>
        <div className="space-y-3">
          {certifications.map((c) => (
            <div key={c.name} className="flex items-center gap-4 p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg">
              <div className="w-8 h-8 bg-[#7C3AED]/15 rounded flex items-center justify-center shrink-0">
                <span className="font-mono text-[10px] text-[#a78bfa] font-bold">{c.icon}</span>
              </div>
              <div>
                <p className="font-mono text-sm text-white font-bold">{c.name}</p>
                <p className="font-mono text-[10px] text-white/35 mt-0.5">{c.issuer} · {c.year}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="font-mono text-[10px] text-white/25 mb-3 tracking-wider">{r.certPreview}</p>
          <div className="border border-[#1f1f1f] rounded-lg overflow-hidden max-w-xl">
            <img src="/certificate-deeplearning.png" alt="AI for Product Manager — DeepLearning.AI" className="w-full" />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-8">{r.experience}</p>
        <div className="space-y-8">
          {r.experience_data.map((job) => (
            <div key={`${job.role}-${job.company}`} className="pl-5 border-l border-[#222]">
              <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                <span className="font-mono text-sm font-bold text-white">{job.role}</span>
                <span className="text-white/40 text-sm">{job.company}</span>
                <span className="font-mono text-[10px] text-white/25 ml-auto">{job.period}</span>
              </div>
              <ul className="space-y-1.5 mt-3 mb-3">
                {job.bullets.map((b) => (
                  <li key={b} className="text-white/50 text-sm flex gap-2">
                    <span className="text-[#7C3AED] mt-0.5 shrink-0">+</span>{b}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[10px] text-white/25 italic">{job.skills}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-8">{r.projects}</p>
        <div className="space-y-6">
          {r.projects_data.map((proj) => (
            <div key={proj.name} className="pl-5 border-l border-[#222]">
              <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                <span className="font-mono text-sm font-bold text-white">{proj.name}</span>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-[#a78bfa] hover:text-white transition-colors">Live →</a>
                )}
                <span className="font-mono text-[10px] text-white/25 ml-auto">{proj.period}</span>
              </div>
              <ul className="space-y-1.5 mt-3 mb-3">
                {proj.bullets.map((b) => (
                  <li key={b} className="text-white/50 text-sm flex gap-2">
                    <span className="text-[#7C3AED] mt-0.5 shrink-0">+</span>{b}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[10px] text-white/25 italic">{proj.skills}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content & Publications */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">{r.content}</p>
        <div className="pl-5 border-l border-[#222]">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <span className="font-mono text-sm font-bold text-white">{ch.name}</span>
            <span className="text-white/40 text-sm">{ch.sub}</span>
          </div>
          <ul className="space-y-1.5 mb-3">
            {r.contentBullets.map((b) => (
              <li key={b} className="text-white/50 text-sm flex gap-2">
                <span className="text-[#7C3AED] mt-0.5 shrink-0">+</span>{b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">{r.skills}</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(r.skills_data).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-[10px] text-white/30 mb-3 tracking-wider">{category}</p>
              <div className="flex flex-wrap gap-2">
                {(items as string[]).map((skill) => (
                  <span key={skill} className="font-mono text-[10px] px-2.5 py-1 rounded bg-[#111] border border-[#1f1f1f] text-white/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section>
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-4">{r.about}</p>
        <p className="text-white/50 text-sm leading-relaxed">
          {r.aboutText.split("@pmvision_ai").map((part, i) =>
            i === 0 ? part : (
              <>
                <a href="https://t.me/pmvision_ai" target="_blank" rel="noopener noreferrer"
                  className="text-[#a78bfa] hover:text-white transition-colors">
                  @pmvision_ai
                </a>
                {part}
              </>
            )
          )}
        </p>
      </section>
    </div>
  );
}
