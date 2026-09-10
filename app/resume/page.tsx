"use client";

import Band from "@/components/Band";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage, type Lang } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

const certifications = [
  { name: "AI for Product Manager", issuer: "DeepLearning.AI · Coursera", year: "Jun 2025" },
  { name: "CJM and CustDev Tools", issuer: "ProductStar", year: "2026" },
  { name: "Metrics and Models for Project Managers", issuer: "Shelf", year: "2025" },
];

const channels = {
  en: { name: "@head_of_ceo", sub: "Telegram channel · AI, product, career" },
  ru: { name: "@head_of_ceo", sub: "Telegram-канал · AI, продукт, карьера" },
};

function CertRow({ c, i }: { c: (typeof certifications)[number]; i: number }) {
  const { ref, className } = useReveal<HTMLDivElement>(i);
  return (
    <div
      ref={ref}
      className={`grid gap-2 py-6 border-b border-rule-soft md:grid-cols-[52px_1fr_auto] md:items-baseline md:gap-7 ${className}`}
    >
      <span className="tiny" />
      <span className="row-title !text-[19px]">{c.name}</span>
      <span className="tiny">
        {c.issuer} · {c.year}
      </span>
    </div>
  );
}

function ExperienceRow({ job, i }: { job: (typeof t)[Lang]["resume"]["experience_data"][number]; i: number }) {
  const { ref, className } = useReveal<HTMLDivElement>(i);
  return (
    <div
      ref={ref}
      className={`grid gap-3 py-7 border-b border-rule-soft lg:grid-cols-[52px_1fr] lg:gap-7 ${className}`}
    >
      <span className="tiny">E.0{i + 1}</span>
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="row-title !text-[24px]">{job.role}</span>
          <span className="tiny">{job.period}</span>
        </div>
        <div className="tiny mt-2">{job.company}</div>
        <ul className="mt-4 flex flex-col gap-1.5">
          {job.bullets.map((b) => (
            <li key={b} className="row-desc max-w-3xl">
              — {b}
            </li>
          ))}
        </ul>
        <p className="tiny normal-case tracking-normal text-[12px] mt-3 italic">{job.skills}</p>
      </div>
    </div>
  );
}

function ResumeProjectRow({ proj, i, ru }: { proj: (typeof t)[Lang]["resume"]["projects_data"][number]; i: number; ru: boolean }) {
  const { ref, className } = useReveal<HTMLDivElement>(i);
  return (
    <div
      ref={ref}
      className={`grid gap-3 py-7 border-b border-rule-soft lg:grid-cols-[52px_1fr] lg:gap-7 ${className}`}
    >
      <span className="tiny">F.0{i + 1}</span>
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="row-title !text-[22px]">{proj.name}</span>
          <span className="tiny">{proj.period}</span>
        </div>
        {proj.link && (
          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="tiny inline-block mt-2 hover:text-ink transition-colors">
            {ru ? "Открыть" : "Live"} →
          </a>
        )}
        <ul className="mt-4 flex flex-col gap-1.5">
          {proj.bullets.map((b) => (
            <li key={b} className="row-desc max-w-3xl">
              — {b}
            </li>
          ))}
        </ul>
        <p className="tiny normal-case tracking-normal text-[12px] mt-3 italic">{proj.skills}</p>
      </div>
    </div>
  );
}

export default function ResumePage() {
  const { lang } = useLanguage();
  const r = t[lang].resume;
  const ch = channels[lang];
  const ru = lang === "ru";

  return (
    <>
      {/* ===== заголовок ===== */}
      <div className="wrap">
        <div className="tiny pt-11 pb-8">{r.label}</div>

        <div className="grid gap-6 pb-8 border-b border-ink md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h1 className="text-[clamp(34px,5vw,58px)] leading-[0.94] tracking-[-0.04em] font-bold">{r.name}</h1>
            <p className="text-[15px] text-dim mt-3 max-w-xl">{r.title}</p>
            <div className="flex gap-6 mt-5 flex-wrap">
              <a href="mailto:jasurakhmadaliev283@gmail.com" className="tiny hover:text-ink transition-colors">
                jasurakhmadaliev283@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/jasur-akhmadaliev" target="_blank" rel="noopener noreferrer" className="tiny hover:text-ink transition-colors">
                LinkedIn →
              </a>
              <a href="https://github.com/jayco2610" target="_blank" rel="noopener noreferrer" className="tiny hover:text-ink transition-colors">
                GitHub →
              </a>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="/resume.pdf" download className="tiny !text-[11px] px-5 py-3 bg-ink text-paper hover:opacity-80 transition-opacity">
              {r.pdfEn}
            </a>
            <a href="/resume-ru.pdf" download className="tiny !text-[11px] px-5 py-3 border border-ink hover:bg-ink hover:text-paper transition-colors">
              {r.pdfRu}
            </a>
          </div>
        </div>
      </div>

      {/* ===== образование + сертификаты ===== */}
      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">01</span>
            <h2>{r.education}</h2>
            <span className="tiny">HSE</span>
          </div>
          <div className="grid gap-2 py-7 border-b border-rule-soft md:grid-cols-[52px_1fr_auto] md:items-baseline md:gap-7">
            <span className="tiny">01.1</span>
            <div>
              <span className="row-title !text-[24px]">{r.hse}</span>
              <p className="row-desc mt-2 max-w-xl">{r.hseDegree}</p>
            </div>
            <span className="tiny">{r.hseLocation}</span>
          </div>

          <div className="sh mt-13">
            <span className="tiny">01.2</span>
            <h2>{r.certifications}</h2>
            <span className="tiny">{certifications.length}</span>
          </div>
          {certifications.map((c, i) => (
            <CertRow key={c.name} c={c} i={i} />
          ))}

          <div className="mt-7 pb-4">
            <p className="tiny mb-3">{r.certPreview}</p>
            <div className="border border-rule max-w-xl">
              <img src="/certificate-deeplearning.png" alt="AI for Product Manager — DeepLearning.AI" className="w-full block" />
            </div>
          </div>
        </section>
      </div>

      {/* ===== опыт ===== */}
      <Band word={ru ? "ОПЫТ" : "EXPERIENCE"} note={`02 — ${r.experience_data.length}`} />

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">02</span>
            <h2>{r.experience}</h2>
            <span className="tiny">{r.experience_data.length}</span>
          </div>

          {r.experience_data.map((job, i) => (
            <ExperienceRow key={`${job.role}-${job.company}`} job={job} i={i} />
          ))}
        </section>
      </div>

      {/* ===== проекты ===== */}
      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">03</span>
            <h2>{r.projects}</h2>
            <span className="tiny">{r.projects_data.length}</span>
          </div>

          {r.projects_data.map((proj, i) => (
            <ResumeProjectRow key={proj.name} proj={proj} i={i} ru={ru} />
          ))}
        </section>
      </div>

      {/* ===== публикации ===== */}
      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">04</span>
            <h2>{r.content}</h2>
            <span className="tiny">{ch.name}</span>
          </div>
          <div className="grid gap-3 py-7 border-b border-rule-soft lg:grid-cols-[52px_1fr] lg:gap-7">
            <span className="tiny" />
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="row-title !text-[22px]">{ch.name}</span>
                <span className="tiny">{ch.sub}</span>
              </div>
              <ul className="mt-4 flex flex-col gap-1.5">
                {r.contentBullets.map((b) => (
                  <li key={b} className="row-desc max-w-3xl">
                    — {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* ===== навыки ===== */}
      <Band word={ru ? "НАВЫКИ" : "SKILLS"} note={`05 — ${ru ? "по категориям" : "by category"}`} />

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">05</span>
            <h2>{r.skills}</h2>
            <span className="tiny">{Object.keys(r.skills_data).length}</span>
          </div>

          <div className="grid gap-8 py-8 sm:grid-cols-2">
            {Object.entries(r.skills_data).map(([category, items]) => (
              <div key={category}>
                <p className="tiny mb-3">{category}</p>
                <p className="row-desc">{(items as string[]).join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ===== о себе ===== */}
      <div className="wrap">
        <section className="sec pb-24">
          <div className="sh">
            <span className="tiny">06</span>
            <h2>{r.about}</h2>
            <span className="tiny">Рис. 01</span>
          </div>
          <p className="text-[clamp(15.5px,1.35vw,18px)] leading-[1.62] max-w-2xl pt-6">
            {r.aboutText.split("@head_of_ceo").map((part, i) =>
              i === 0 ? (
                part
              ) : (
                <span key={i}>
                  <a href="https://t.me/head_of_ceo" target="_blank" rel="noopener noreferrer" className="underline hover:text-dim">
                    @head_of_ceo
                  </a>
                  {part}
                </span>
              )
            )}
          </p>
        </section>
      </div>
    </>
  );
}
