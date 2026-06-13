export default function ProjectsPage() {
  const projects = [
    {
      name: "AI Career System",
      status: "live",
      stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
      description:
        "End-to-end automation for job search. Receives a vacancy link in Telegram, fetches and analyzes the job description, compares it against my resume, finds the recruiter, generates a tailored cover letter, and logs everything to Google Sheets — all without manual steps.",
      metrics: ["Covers 100% of incoming vacancies", "Cover letter in under 60 seconds", "Zero manual copy-paste"],
      link: null,
    },
    {
      name: "Expat Roadmap SEA",
      status: "shipped",
      stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
      description:
        "A practical guide for people relocating to Southeast Asia. Covers visas, housing, cost of living, and local community resources. Built solo from scratch and deployed on Vercel.",
      metrics: ["Shipped solo", "Full-stack: Next.js + Supabase", "Deployed on Vercel"],
      link: "https://expat-roadmap-sea.vercel.app",
    },
    {
      name: "RAG Starter",
      status: "in progress",
      stack: ["Python", "Gemini API", "Ollama", "LangChain"],
      description:
        "Open-source RAG (Retrieval-Augmented Generation) template. Supports both Gemini API (cloud) and Ollama (local). Built as a portfolio piece for AI consulting — specifically for dental clinics wanting to automate patient Q&A.",
      metrics: ["Dual LLM support: cloud + local", "Portfolio for AI consulting", "GitHub public"],
      link: null,
    },
    {
      name: "Portfolio Site + JasurGPT",
      status: "live",
      stack: ["Next.js", "Gemini 2.0 Flash", "Vercel", "TypeScript"],
      description:
        "This site. JasurGPT is an AI assistant trained on my full professional context — resume, projects, experience. Runs on Gemini free tier. Total infrastructure cost: $0.",
      metrics: ["$0/month infrastructure", "1500 free Gemini requests/day", "Deployed in one push"],
      link: null,
    },
  ];

  const statusColors: Record<string, string> = {
    live: "bg-green-500/20 text-green-400",
    shipped: "bg-[#1E3A8A]/40 text-blue-300",
    "in progress": "bg-[#7C3AED]/20 text-purple-300",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[#F8FAFF] mb-2">Projects</h1>
      <p className="text-white/50 mb-12">Things I built. Real use cases, real results.</p>

      <div className="space-y-6">
        {projects.map((p) => (
          <div
            key={p.name}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-[#F8FAFF]">{p.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusColors[p.status]}`}>
                  {p.status}
                </span>
              </div>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#7C3AED] hover:text-purple-300 transition-colors shrink-0"
                >
                  Live site →
                </a>
              )}
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-4">{p.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/50 font-mono"
                >
                  {s}
                </span>
              ))}
            </div>

            <ul className="space-y-1">
              {p.metrics.map((m) => (
                <li key={m} className="text-xs text-white/40 flex items-center gap-2">
                  <span className="text-[#7C3AED]">+</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
