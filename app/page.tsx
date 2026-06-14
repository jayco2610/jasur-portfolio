import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Full-screen hero */}
      <section className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background photo */}
        <img
          src="/jasur.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0a0a0a]" />

        {/* Hero text */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="font-mono text-5xl md:text-7xl font-bold text-[#a78bfa] mb-8 leading-none">
            Welcome.
          </h1>
          <p className="font-mono text-base md:text-lg text-white leading-relaxed">
            I&apos;m Jasur Akhmadaliev — AI Product Manager from Tashkent.
            Building digital products hands-on: from customer discovery to live users.
            Scroll the cards below to see my projects,
            or ask <span className="text-[#a78bfa]">JasurGPT</span> in the corner anything about my work.
          </p>
          <div className="mt-10 flex gap-3 justify-center flex-wrap">
            <Link
              href="/projects"
              className="font-mono text-sm px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors"
            >
              View projects
            </Link>
            <Link
              href="/resume"
              className="font-mono text-sm px-5 py-2.5 border border-white/25 text-white/80 rounded hover:border-white/50 hover:text-white transition-colors"
            >
              Resume
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-[10px] text-white tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/50" />
        </div>
      </section>

      {/* Projects */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-10">
            Selected work
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "AI Career System",
                status: "live",
                desc: "End-to-end job search automation. Claude + n8n + Google Sheets + Telegram. Vacancy in → cover letter out in under 60 seconds.",
                tags: ["Claude", "n8n", "Telegram"],
                link: null,
              },
              {
                name: "Expat Roadmap SEA",
                status: "shipped",
                desc: "Full-stack guide for relocating to Southeast Asia. Next.js + Supabase, built and deployed solo.",
                tags: ["Next.js", "Supabase", "Vercel"],
                link: "https://expat-roadmap-sea.vercel.app",
              },
              {
                name: "RAG Starter",
                status: "in progress",
                desc: "Open-source retrieval-augmented generation template. Gemini API + Ollama. Built for AI consulting.",
                tags: ["Python", "LangChain", "Ollama"],
                link: null,
              },
              {
                name: "Portfolio + JasurGPT",
                status: "live",
                desc: "This site. AI chat trained on full context — resume, projects, experience. Ask using the button below.",
                tags: ["Next.js", "OpenRouter", "Vercel"],
                link: null,
              },
            ].map((p) => (
              <div
                key={p.name}
                className="p-6 bg-[#111111] border border-[#1f1f1f] rounded-lg hover:border-[#7C3AED]/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-sm font-bold text-white">{p.name}</span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    p.status === "live"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : p.status === "shipped"
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-[#7C3AED]/15 text-[#a78bfa]"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-4">{p.desc}</p>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] px-2 py-1 bg-white/5 text-white/40 rounded">
                        {t}
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
              All projects →
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-8">
            About
          </p>
          <div className="max-w-2xl">
            <p className="text-white/70 leading-relaxed mb-4">
              I&apos;m a Product Manager and marketing analyst from Tashkent, Uzbekistan.
              I&apos;ve shipped products at Instameal (food delivery), IDF Lab (B2B SaaS), and Synergia.
              Currently building AI tooling for my own job search — and publishing the process publicly.
            </p>
            <p className="text-white/50 leading-relaxed">
              Looking for a remote PM or product marketing role with an international team.
              The AI career system you see above is both my portfolio and my actual workflow.
            </p>
          </div>

          <div className="mt-10 flex gap-6 flex-wrap">
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/in/jasur-akhmadaliev" },
              { label: "Telegram", href: "https://t.me/pmvision_ai" },
              { label: "VC.ru", href: "https://vc.ru/id5991727" },
              { label: "Email", href: "mailto:jasurakhmadaliev283@gmail.com" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel={l.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="font-mono text-sm text-[#a78bfa] hover:text-white transition-colors"
              >
                {l.label} →
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* JasurGPT hint */}
      <section className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-mono text-sm text-white/30">
            Have questions about my experience or projects?
          </p>
          <p className="font-mono text-sm text-[#a78bfa] mt-1">
            Ask JasurGPT — button in the bottom right corner.
          </p>
        </div>
      </section>
    </div>
  );
}
