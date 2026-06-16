export default function ProjectsPage() {
  const projects = [
    {
      name: "AI Career System",
      status: "live",
      stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
      description: "End-to-end automation for job search. Receives a vacancy link in Telegram, fetches and analyzes the job description, compares it against my resume, finds the recruiter, generates a tailored cover letter, and logs everything to Google Sheets — without manual steps.",
      metrics: ["Covers 100% of incoming vacancies", "Cover letter in under 60 seconds", "Zero manual copy-paste"],
      link: null,
      github: null,
    },
    {
      name: "Expat Roadmap SEA",
      status: "shipped",
      stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
      description: "A practical guide for people relocating to Southeast Asia. Covers visas, housing, cost of living, and local community resources. Built solo from scratch and deployed on Vercel.",
      metrics: ["Shipped solo", "Full-stack: Next.js + Supabase", "Deployed on Vercel"],
      link: "https://expat-roadmap-sea.vercel.app",
      github: "https://github.com/jayco2610/expat-roadmap-sea",
    },
    {
      name: "Mia — Dental Clinic RAG Assistant",
      status: "live",
      stack: ["Python", "RAG", "Groq", "Gradio", "Hugging Face"],
      description: "A retrieval-augmented assistant for a dental clinic. Answers patient questions about services, pricing, hours, and procedures from the clinic's own documents — grounded answers only, no made-up facts. Deployed live on Hugging Face Spaces as a working demo for AI consulting in the dental niche.",
      metrics: ["Live demo on Hugging Face Spaces", "Answers grounded in clinic documents", "Built for dental AI consulting"],
      link: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
      github: "https://github.com/jayco2610/rag-starter",
    },
    {
      name: "Portfolio + JasurGPT",
      status: "live",
      stack: ["Next.js", "OpenRouter", "Vercel", "TypeScript"],
      description: "This site. JasurGPT is an AI assistant trained on my full professional context. Runs on OpenRouter free tier with a 4-model fallback chain. Total infrastructure cost: $0.",
      metrics: ["$0/month infrastructure", "4-model fallback — always on", "Deployed on Vercel"],
      link: "https://jasur-portfolio-pied.vercel.app",
      github: "https://github.com/jayco2610/jasur-portfolio",
    },
    {
      name: "Personal Brandbook",
      status: "shipped",
      stack: ["Canva", "PDF", "GitHub Pages"],
      description: "10-page brand portfolio covering positioning, experience with real metrics, services with pricing, and project case studies including Expat Roadmap SEA and Portfolio + JasurGPT.",
      metrics: ["10 pages", "Services with pricing", "Expat Roadmap case study"],
      link: "/brandbook.pdf",
      github: "https://github.com/jayco2610/jasur-brandbook",
    },
  ];

  const githubRepos = [
    {
      name: "claude-google-sheets-apps-script",
      description: "Connect Claude to Google Sheets via Apps Script — no billing, no API key for Sheets",
      url: "https://github.com/jayco2610/claude-google-sheets-apps-script",
    },
    {
      name: "claude-obsidian-mcp",
      description: "Connect Claude to your Obsidian vault — read, write, and search notes from any chat",
      url: "https://github.com/jayco2610/claude-obsidian-mcp",
    },
    {
      name: "claude-telegram-setup",
      description: "Claude Code + Telegram: voice-control AI from your phone — step-by-step guide",
      url: "https://github.com/jayco2610/claude-telegram-setup",
    },
    {
      name: "claude-memory-mcp",
      description: "Persistent memory for Claude between sessions — local Knowledge Graph, no cloud",
      url: "https://github.com/jayco2610/claude-memory-mcp",
    },
    {
      name: "claude-duckduckgo-search-mcp",
      description: "Real-time web search in Claude via DuckDuckGo — no API key, 10-minute setup",
      url: "https://github.com/jayco2610/claude-duckduckgo-search-mcp",
    },
    {
      name: "claude-yt-dlp-mcp",
      description: "Let Claude read YouTube videos via transcripts — yt-dlp MCP setup",
      url: "https://github.com/jayco2610/claude-yt-dlp-mcp",
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
              <div className="flex items-center gap-3 shrink-0">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-white/30 hover:text-white transition-colors">
                    GitHub →
                  </a>
                )}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-[#a78bfa] hover:text-white transition-colors">
                    Live →
                  </a>
                )}
              </div>
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

      {/* GitHub Open Source */}
      <div className="mt-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-2">Open Source</p>
        <p className="text-white/40 text-sm mb-8">MCP server guides and Claude productivity tools — all public on GitHub.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {githubRepos.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg hover:border-[#7C3AED]/30 transition-colors group"
            >
              <p className="font-mono text-xs font-bold text-white/80 group-hover:text-white transition-colors mb-2">{r.name}</p>
              <p className="text-white/40 text-xs leading-relaxed">{r.description}</p>
            </a>
          ))}
        </div>
        <div className="mt-5">
          <a
            href="https://github.com/jayco2610"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-[#a78bfa] hover:text-white transition-colors"
          >
            All repos on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
