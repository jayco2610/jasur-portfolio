export default function ProjectsPage() {
  const projects = [
    {
      name: "AI Career System",
      status: "live",
      stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
      description: "End-to-end automation for job search. Receives a vacancy link in Telegram, fetches and analyzes the job description, compares it against my resume, finds the recruiter, generates a tailored cover letter, and logs everything to Google Sheets — without manual steps.",
      metrics: ["Covers 100% of incoming vacancies", "Cover letter in under 60 seconds", "Zero manual copy-paste"],
      link: null,
    },
    {
      name: "Expat Roadmap SEA",
      status: "shipped",
      stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
      description: "A practical guide for people relocating to Southeast Asia. Covers visas, housing, cost of living, and local community resources. Built solo from scratch and deployed on Vercel.",
      metrics: ["Shipped solo", "Full-stack: Next.js + Supabase", "Deployed on Vercel"],
      link: null,
    },
    {
      name: "RAG Starter",
      status: "in progress",
      stack: ["Python", "Gemini API", "Ollama", "LangChain"],
      description: "Open-source RAG template. Supports both Gemini API (cloud) and Ollama (local). Built as a portfolio piece for AI consulting — specifically for dental clinics wanting to automate patient Q&A.",
      metrics: ["Dual LLM support: cloud + local", "Portfolio for AI consulting", "GitHub public"],
      link: null,
    },
    {
      name: "Portfolio + JasurGPT",
      status: "live",
      stack: ["Next.js", "OpenRouter", "Vercel", "TypeScript"],
      description: "This site. JasurGPT is an AI assistant trained on my full professional context. Runs on OpenRouter free tier. Total infrastructure cost: $0.",
      metrics: ["$0/month infrastructure", "Floating chat widget", "Deployed in one push"],
      link: null,
    },
  ];

  const statusColors: Record<string, string> = {
    live: "bg-emerald-500/15 text-emerald-400",
    shipped: "bg-blue-500/15 text-blue-400",
    "in progress": "bg-[#7C3AED]/15 text-[#a78bfa]",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">Projects</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-2">Things I built.</h1>
      <p className="text-white/40 text-sm mb-14">Real use cases, real results.</p>

      <div className="space-y-5">
        {projects.map((p) => (
          <div key={p.name} className="p-6 bg-[#111111] border border-[#1f1f1f] rounded-lg hover:border-[#7C3AED]/20 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-mono text-sm font-bold text-white">{p.name}</h2>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${statusColors[p.status]}`}>
                  {p.status}
                </span>
              </div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[10px] text-[#a78bfa] hover:text-white transition-colors shrink-0">
                  Live →
                </a>
              )}
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-4">{p.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {p.stack.map((s) => (
                <span key={s} className="font-mono text-[10px] px-2.5 py-1 rounded bg-white/5 border border-white/5 text-white/40">
                  {s}
                </span>
              ))}
            </div>

            <ul className="space-y-1">
              {p.metrics.map((m) => (
                <li key={m} className="font-mono text-[10px] text-white/30 flex items-center gap-2">
                  <span className="text-[#7C3AED]">+</span>{m}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
