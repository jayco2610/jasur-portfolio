"use client";

import type { Ref } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import Band from "@/components/Band";
import CountUp from "@/components/CountUp";
import Mark from "@/components/Mark";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage, type Lang } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

function ProjectRow({
  p,
  i,
}: {
  p: (typeof t)[Lang]["home"]["projects"][number];
  i: number;
}) {
  const { ref, className } = useReveal<HTMLElement>(i);
  const inner = (
    <>
      <span className="tiny">A.0{i + 1}</span>
      <div>
        <span className="row-title">{p.name}</span>
        <div className="tiny mt-2.5">{p.tags.join(" · ")}</div>
      </div>
      <p className="row-desc">{p.desc}</p>
      <span className="tiny">{p.status}</span>
    </>
  );
  return p.link ? (
    <a
      ref={ref as Ref<HTMLAnchorElement>}
      className={`row ${className}`}
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {inner}
    </a>
  ) : (
    <div ref={ref as Ref<HTMLDivElement>} className={`row ${className}`}>
      {inner}
    </div>
  );
}

export default function Home() {
  const { lang } = useLanguage();
  const h = t[lang].home;
  const ru = lang === "ru";

  const contacts = [
    { label: "LinkedIn", note: ru ? "Профессиональное" : "Professional", href: "https://www.linkedin.com/in/jasur-akhmadaliev" },
    { label: "Telegram", note: ru ? "Быстрее всего" : "Fastest", href: "https://t.me/biznesmind" },
    { label: "VC.ru", note: ru ? "Тексты" : "Writing", href: "https://vc.ru/id5991727" },
    { label: "Email", note: ru ? "Подробно" : "In detail", href: "mailto:jasurakhmadaliev283@gmail.com" },
    { label: ru ? "Резюме" : "Resume", note: ru ? "Формально" : "Formal", href: "/resume" },
  ];

  return (
    <>
      <HeroSection />

      {/* ===== работы ===== */}
      <Band word={ru ? "РАБОТЫ" : "WORK"} note={`01 — ${h.projects.length} ${ru ? "проекта" : "projects"}`} />

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">01</span>
            <h2>
              {h.selectedWork.split(" ")[0]} <em className="serif">{h.selectedWork.split(" ").slice(1).join(" ")}</em>
            </h2>
            <span className="tiny">{h.projects.length}</span>
          </div>

          {h.projects.map((p, i) => (
            <ProjectRow key={p.name} p={p} i={i} />
          ))}

          <p className="mt-8">
            <Link href="/projects" className="tiny hover:text-ink transition-colors">
              {h.allProjects} →
            </Link>
          </p>
        </section>
      </div>

      {/* ===== цифры ===== */}
      <Band word={ru ? "ЦИФРЫ" : "NUMBERS"} note={`02 — ${ru ? "проверяемые" : "verifiable"}`} />

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">02</span>
            <h2>
              {ru ? "Живая" : "Live"} <em className="serif">{ru ? "система" : "system"}</em>
            </h2>
            <span className="tiny">{h.liveLabel}</span>
          </div>

          <div className="nums">
            {h.liveStats.map((s) => (
              <div className="num" key={s.label}>
                <CountUp value={s.value} />
                <span className="tiny">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="sh mt-13">
            <span className="tiny">02.1</span>
            <h2>{ru ? "Охват" : "Reach"}</h2>
            <span className="tiny">{ru ? "публично" : "public"}</span>
          </div>

          <div className="nums">
            {h.stats.map((s) => (
              <div className="num" key={s.value + s.label}>
                <CountUp value={s.value} />
                <span className="tiny">
                  {s.label} · {s.sub}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ===== портрет ===== */}
      <Band word={ru ? "ПОРТРЕТ" : "PORTRAIT"} note="03 — Рис. 01" />

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">03</span>
            <h2>{h.about}</h2>
            <span className="tiny">{ru ? "Рис. 01" : "Fig. 01"}</span>
          </div>

          <div className="grid gap-9 pt-6 lg:grid-cols-[290px_1fr] lg:gap-16 items-start">
            <figure>
              <img src="/portrait.jpg" alt="Jasur Akhmadaliev" className="w-full block grayscale contrast-[1.06]" />
              <figcaption className="flex justify-between mt-2.5">
                <span className="tiny">{ru ? "Рис. 01 — Москва" : "Fig. 01 — Moscow"}</span>
                <span className="tiny">2026</span>
              </figcaption>
            </figure>

            <div>
              <p className="text-[clamp(16px,1.4vw,19px)] leading-[1.7]">{h.aboutP1}</p>
              <p className="text-[clamp(16px,1.4vw,19px)] leading-[1.7] mt-4">{h.aboutP2}</p>
              <p className="text-[clamp(16px,1.4vw,19px)] leading-[1.7] mt-4">{h.aboutP3}</p>
              <p className="mt-5">
                <Mark>{h.aboutTag}</Mark>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ===== контакты ===== */}
      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">04</span>
            <h2>{ru ? "Связаться" : "Get in touch"}</h2>
            <span className="tiny">{ru ? "пять каналов" : "five channels"}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group pt-7 pr-3.5 pb-6 border-b border-rule no-underline text-ink"
              >
                <b className="inline-block text-[19px] font-bold tracking-[-0.024em] px-1.5 -ml-1.5 pb-0.5 transition-colors group-hover:bg-ink group-hover:text-paper">
                  {c.label}
                </b>
                <span className="tiny block mt-2.5">{c.note}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
