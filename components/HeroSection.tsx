"use client";

import Link from "next/link";
import Mark from "@/components/Mark";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

export default function HeroSection() {
  const { lang } = useLanguage();
  const hero = t[lang].hero;

  return (
    <header className="wrap pt-[clamp(56px,9vh,110px)] pb-[clamp(40px,6vh,80px)]">
      <div className="tiny mb-11">{hero.kicker}</div>

      <div className="grid gap-9 items-end lg:grid-cols-[1.35fr_0.9fr] lg:gap-14">
        <div>
          <h1 className="text-[clamp(44px,7.6vw,116px)] leading-[0.88] tracking-[-0.05em] font-bold">
            <span className="block font-extralight tracking-[-0.038em]">{hero.l1}</span>
            {hero.l2}
            <span className="serif block text-[0.56em] leading-[1.04] mt-[0.06em]">{hero.l3}</span>
          </h1>

          <div className="grid gap-6 mt-11 md:grid-cols-[1.25fr_1fr] md:gap-14">
            <p className="text-[clamp(15.5px,1.35vw,18px)] leading-[1.62]">
              {hero.deckA}
              <Mark>{hero.deckMark}</Mark>
              {hero.deckB}
            </p>
            <p className="text-[14.5px] text-dim border-t border-ink pt-3.5">{hero.deck2}</p>
          </div>

          {/* Тизер на статью «Зачем этот сайт»: люди на портфолио должны узнать
              про дневник, не заходя в него специально. Обложка та же, что у статьи,
              клик ведёт прямо в неё, а не на список журнала. */}
          <Link
            href={`/blog/${hero.journalSlug}`}
            className="mt-6 flex items-center gap-4 border-t border-rule pt-4 group"
          >
            <span className="w-16 h-10 flex-none overflow-hidden bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.journalCover} alt="" className="w-full h-full object-cover grayscale" />
            </span>
            <span className="min-w-0">
              <span className="tiny block mb-1">{hero.journalKicker}</span>
              <span className="block">
                <b className="font-bold group-hover:underline underline-offset-4">{hero.journalTitle}</b>
                <span className="text-dim"> — {hero.journalDesc}</span>
              </span>
            </span>
          </Link>
        </div>

        <figure className="self-end max-w-[420px] lg:max-w-none">
          <img
            src="/frontispiece.png"
            alt=""
            className="w-full block grayscale contrast-[1.04] mix-blend-multiply"
          />
          <figcaption className="flex justify-between items-baseline mt-2.5 pt-2 border-t border-ink">
            <span className="tiny">{hero.figCap}</span>
            <span className="tiny">2026</span>
          </figcaption>
        </figure>
      </div>
    </header>
  );
}
