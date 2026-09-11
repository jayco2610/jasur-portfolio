"use client";

import Link from "next/link";
import Band from "@/components/Band";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage, type Lang } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

function ProjectArticle({
  proj,
  i,
  ru,
}: {
  proj: (typeof t)[Lang]["projects"]["projects"][number];
  i: number;
  ru: boolean;
}) {
  const { ref, className } = useReveal<HTMLElement>(i);
  return (
    <article
      ref={ref}
      className={`grid gap-3 py-8 border-b border-rule-soft lg:grid-cols-[52px_1fr] lg:gap-7 ${className}`}
    >
      <span className="tiny">A.0{i + 1}</span>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="row-title !ml-0 !px-0">{proj.name}</h3>
          <span className="tiny">{proj.status}</span>
        </div>
        <div className="tiny mt-2">{proj.stack.join(" · ")}</div>

        <p className="row-desc mt-4 max-w-3xl">{proj.description}</p>

        <ul className="mt-4 flex flex-col gap-1">
          {proj.metrics.map((m) => (
            <li key={m} className="tiny normal-case tracking-normal text-[13px] text-[#3c3a33]">
              — {m}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-5 mt-5">
          {(proj as { demo?: string }).demo && (
            <Link href={(proj as { demo: string }).demo} className="tiny hover:text-ink transition-colors">
              {ru ? "Демо" : "Demo"} →
            </Link>
          )}
          {proj.link && (
            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="tiny hover:text-ink transition-colors">
              {ru ? "Открыть" : "Live"} →
            </a>
          )}
          {proj.github && (
            <a href={proj.github} target="_blank" rel="noopener noreferrer" className="tiny hover:text-ink transition-colors">
              GitHub →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const { lang } = useLanguage();
  const p = t[lang].projects;
  const ru = lang === "ru";

  return (
    <>
      <div className="wrap">
        <div className="tiny pt-11 pb-8">{p.label}</div>
        <div className="sh">
          <span className="tiny">01</span>
          <h1>
            {p.title.split(" ").slice(0, -1).join(" ")}{" "}
            <em className="serif">{p.title.split(" ").slice(-1)}</em>
          </h1>
          <span className="tiny">{p.projects.length}</span>
        </div>
        <p className="text-[clamp(15.5px,1.35vw,18px)] leading-[1.62] max-w-2xl pt-6">{p.subtitle}</p>
      </div>

      <div className="wrap">
        <section className="sec">
          {p.projects.map((proj, i) => (
            <ProjectArticle key={proj.name} proj={proj} i={i} ru={ru} />
          ))}
        </section>
      </div>

      <Band word="OPEN SOURCE" note={`02 — ${p.repos.length} repos`} />

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">02</span>
            <h2>{p.openSource}</h2>
            <span className="tiny">GitHub</span>
          </div>
          <p className="text-[clamp(15.5px,1.35vw,18px)] leading-[1.62] max-w-2xl pt-6">{p.openSourceDesc}</p>

          <div className="grid sm:grid-cols-2 mt-4">
            {p.repos.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group pt-6 pr-6 pb-6 border-b border-rule-soft no-underline text-ink"
              >
                <b className="inline-block font-bold px-1.5 -ml-1.5 pb-0.5 transition-colors group-hover:bg-ink group-hover:text-paper">
                  {r.name}
                </b>
                <p className="row-desc mt-2">{r.description}</p>
              </a>
            ))}
          </div>

          <p className="mt-8 pb-20">
            <a href="https://github.com/jayco2610" target="_blank" rel="noopener noreferrer" className="tiny hover:text-ink transition-colors">
              {p.allRepos}
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
