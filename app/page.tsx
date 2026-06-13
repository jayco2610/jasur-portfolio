import JasurGPT from "@/components/JasurGPT";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Hero */}
      <section className="mb-20">
        <p className="text-[#7C3AED] text-sm font-mono mb-4 tracking-widest uppercase">
          Product Manager · Marketing · AI
        </p>
        <h1 className="text-5xl font-bold text-[#F8FAFF] leading-tight mb-6">
          Jasur Akhmadaliev
        </h1>
        <p className="text-xl text-white/70 max-w-xl leading-relaxed mb-4">
          Building an AI system for his own career search.
          <br />
          Showing it live.
        </p>
        <p className="text-lg text-white/50 font-light italic mb-10">
          &ldquo;Система для себя. Работает при всех.&rdquo;
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/projects"
            className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg font-medium hover:bg-[#6d28d9] transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/resume"
            className="px-6 py-3 border border-white/20 text-white/80 rounded-lg font-medium hover:border-[#7C3AED] hover:text-white transition-colors"
          >
            Resume
          </Link>
          <a
            href="https://t.me/pmvision_ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-white/20 text-white/80 rounded-lg font-medium hover:border-[#1E3A8A] hover:text-white transition-colors"
          >
            Telegram →
          </a>
        </div>
      </section>

      {/* Currently building */}
      <section className="mb-20">
        <h2 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-6">
          Currently building
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: "AI Career System",
              desc: "Claude + n8n + Google Sheets pipeline that automates job search: vacancy analysis, resume adaptation, cover letters.",
              tag: "live",
            },
            {
              title: "RAG Starter",
              desc: "Open-source RAG template with Gemini + Ollama. Portfolio piece for AI consulting.",
              tag: "in progress",
            },
            {
              title: "Expat Roadmap SEA",
              desc: "Guide for relocating to Southeast Asia. Next.js + Supabase. First product shipped solo.",
              tag: "shipped",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl border border-white/10 bg-white/5 hover:border-[#7C3AED]/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#F8FAFF] font-semibold text-sm">
                  {item.title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    item.tag === "live"
                      ? "bg-green-500/20 text-green-400"
                      : item.tag === "shipped"
                      ? "bg-[#1E3A8A]/40 text-blue-300"
                      : "bg-[#7C3AED]/20 text-purple-300"
                  }`}
                >
                  {item.tag}
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JasurGPT */}
      <section>
        <h2 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-2">
          Ask JasurGPT
        </h2>
        <p className="text-white/50 text-sm mb-6">
          AI trained on my resume, projects, and experience. Ask anything.
        </p>
        <JasurGPT />
      </section>
    </div>
  );
}
