export default function ResumePage() {
  const experience = [
    {
      role: "Independent AI Builder",
      company: "Personal AI Projects",
      period: "May 2026 – Present",
      bullets: [
        "Built expat networking web app solo via vibe coding (Cursor + Claude)",
        "Built Portfolio + JasurGPT — personal site with AI chat trained on resume and projects — jasur-portfolio-pied.vercel.app",
        "Built AI Career System — end-to-end job search automation (Claude + n8n + Google Sheets + Telegram); vacancy in → cover letter out in under 80 seconds",
        "Configured Claude + Telegram + Whisper voice pipeline end-to-end, independently",
        "Developing AI agent for ABC/XYZ inventory analysis using n8n (in progress)",
        "Built conversational automation bots in Voiceflow for real business use cases",
      ],
      skills: "Claude API, Cursor, Telegram Bot API, Whisper, n8n, Voiceflow, Prompt Engineering, Facebook API",
    },
    {
      role: "AI Analyst (Freelance)",
      company: "Consulting Project — Food Court Molot",
      period: "Jan 2026 – May 2026",
      bullets: [
        "Audited operational and procurement data using Claude + Google Sheets",
        "Built automated reporting system to track cost categories across departments",
        "Result: estimated –18% reduction in procurement costs",
      ],
      skills: "Claude, Google Sheets, Data Analysis, Workflow Automation",
    },
    {
      role: "Product Manager / Co-founder",
      company: "Yonma Yon — Local Startup",
      period: "Nov 2024 – 2025",
      bullets: [
        "Conducted customer discovery: 10+ user interviews, analyzed insights via NotebookLM and ChatGPT",
        "Defined product hypotheses across monetization models, UX flows, and user scenarios",
        "Designed and launched MVP: landing page + Telegram bot",
        "Configured AI agents to automate incoming request processing via Voiceflow + n8n",
        "Opened B2B direction: analytics-as-a-service offering for business partners",
        "Result: 150+ users acquired, first B2B inquiries received",
      ],
      skills: "CustDev, CJM, MVP, Voiceflow, n8n, NotebookLM, ChatGPT, Telegram Bot API",
    },
    {
      role: "Data Analyst",
      company: "IDF Lab — Analytics Project (HSE)",
      period: "Jun 2023 – Nov 2024",
      bullets: [
        "Performed RFM segmentation of client database for an external business client",
        "Delivered retention recommendations based on customer segment behavior",
        "Result: estimated +15% increase in repeat-purchase retention rate",
      ],
      skills: "RFM Analysis, Google Sheets, Data Analytics, AI-assisted Research",
    },
    {
      role: "Client Relations Coordinator",
      company: "Synergia University",
      period: "Aug 2023 – Apr 2025",
      bullets: [
        "Managed portfolio of 40+ clients: onboarding, support, and contract oversight",
        "Gathered client requirements and translated them into technical specs for the delivery team",
        "Monitored timelines and quality across concurrent accounts; kept clients updated throughout",
        "Used Claude and ChatGPT to accelerate document preparation and data structuring",
        "Result: 3 projects on time with no delays, NPS 62→78, response time –30%",
        "Presented process improvements at internal team meetup",
      ],
      skills: "Client Management, Requirements Gathering, Excel, Google Sheets, Claude, ChatGPT, Documentation",
    },
    {
      role: "Product Manager / Co-founder",
      company: "Instameal — FoodTech Startup",
      period: "Mar 2024 – Jul 2024",
      bullets: [
        "Launched product from zero: customer discovery, CJM, MVP development, first paying users",
        "Built MVP via vibe coding: Telegram bot + website; designed UI flows in Figma",
        "Set up conversion funnel and product metrics dashboard; tested user activation mechanics",
        "Coordinated cross-functional team of 8 across logistics, development, and marketing",
        "Used AI for hypothesis generation and product research",
        "Result: ~400 users, ~40% conversion rate",
      ],
      skills: "CustDev, CJM, Figma, Telegram Bot API, Product Metrics, Scrum, AI Research",
    },
  ];

  const projects = [
    {
      name: "Expat Networking Platform",
      period: "May 2026 – Present",
      link: "https://expat-roadmap-sea.vercel.app",
      bullets: [
        "Built full-stack platform solo: interactive visa/city map, community, housing board, events, jobs",
        "Deployed Telegram bot as the primary user engagement channel",
      ],
      skills: "Next.js, Supabase, Cursor, Claude API, Telegram, Vibe Coding",
    },
    {
      name: "Portfolio + JasurGPT",
      period: "2026",
      link: "https://jasur-portfolio-pied.vercel.app",
      bullets: [
        "Personal site with AI chat (JasurGPT) trained on full context: resume, projects, experience",
        "Showcases: AI Career System, Expat Roadmap SEA, RAG Starter",
      ],
      skills: "Next.js, OpenRouter, Vercel, TypeScript, Tailwind CSS",
    },
    {
      name: "AI Career System",
      period: "2026 · Live",
      link: null,
      bullets: [
        "End-to-end job search automation: vacancy parsing, ATS resume adaptation, auto cover letter generation",
        "Claude + n8n + Google Sheets + Telegram; vacancy in → cover letter out in under 80 seconds",
      ],
      skills: "Claude API, n8n, Google Sheets, Telegram Bot API, Prompt Engineering",
    },
    {
      name: "Claude + Telegram + Whisper Voice Pipeline",
      period: "2026",
      link: null,
      bullets: [
        "Configured end-to-end pipeline: Whisper transcribes audio → Claude processes → Telegram delivers",
        "Set up independently, without templates or tutorials",
      ],
      skills: "Whisper API, Claude API, Telegram Bot API",
    },
  ];

  const skills: Record<string, string[]> = {
    "Product": ["Product Discovery", "CustDev", "CJM", "User Stories", "Backlog Prioritization", "Hypothesis Formation", "A/B Testing", "MVP", "Scrum", "SAFe (basic)", "NPS", "LTV / CAC", "Funnel Analytics"],
    "Development": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Prisma", "Vercel", "Git / GitHub", "REST API"],
    "AI & Automation": ["Claude API", "OpenRouter API", "ChatGPT", "Prompt Engineering", "NotebookLM", "n8n", "Voiceflow", "Cursor", "AI Agents", "Whisper API"],
    "Tools": ["Google Sheets", "Figma", "Canva", "Telegram Bot API", "Facebook API"],
    "Languages": ["English (B1)", "Russian (Native)", "Turkish (B2)", "Uzbek (Native)"],
  };

  const certifications = [
    { name: "AI for Product Manager", issuer: "DeepLearning.AI · Coursera", year: "Jun 2025" },
    { name: "CJM and CustDev Tools", issuer: "ProductStar", year: "2026" },
    { name: "Metrics and Models for Project Managers", issuer: "Shelf", year: "2025" },
    { name: "AI for Product Managers", issuer: "BOS Shelf", year: "in progress" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-14 gap-6 flex-wrap">
        <div>
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">Resume</p>
          <h1 className="font-mono text-3xl font-bold text-white mb-2">Jasur Akhmadaliev</h1>
          <p className="text-white/50 text-sm">AI Product Manager · Product Strategy · AI Automation & MVP Launch</p>
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
            PDF — EN
          </a>
          <a href="/resume-ru.pdf" download
            className="font-mono text-sm px-4 py-2.5 border border-[#7C3AED]/40 text-[#a78bfa] rounded hover:bg-[#7C3AED]/10 transition-colors">
            PDF — RU
          </a>
        </div>
      </div>

      {/* Education */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Education</p>
        <div className="pl-5 border-l border-[#222]">
          <div className="flex items-baseline gap-3 mb-1 flex-wrap">
            <span className="font-mono text-sm font-bold text-white">HSE University (Higher School of Economics)</span>
            <span className="font-mono text-[10px] text-white/25 ml-auto">Moscow · 2023–2025</span>
          </div>
          <p className="text-white/40 text-sm">Bachelor of Business and Economics, International Program</p>
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Certifications</p>
        <div className="space-y-3">
          {certifications.map((c) => (
            <div key={c.name} className="flex items-center gap-4 p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg">
              <div className="w-8 h-8 bg-[#7C3AED]/15 rounded flex items-center justify-center shrink-0">
                <span className="font-mono text-[10px] text-[#a78bfa] font-bold">AI</span>
              </div>
              <div>
                <p className="font-mono text-sm text-white font-bold">{c.name}</p>
                <p className="font-mono text-[10px] text-white/35 mt-0.5">{c.issuer} · {c.year}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="font-mono text-[10px] text-white/25 mb-3 tracking-wider">CERTIFICATE PREVIEW</p>
          <div className="border border-[#1f1f1f] rounded-lg overflow-hidden max-w-xl">
            <img src="/certificate-deeplearning.png" alt="AI for Product Manager — DeepLearning.AI" className="w-full" />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-8">Experience</p>
        <div className="space-y-8">
          {experience.map((job) => (
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
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-8">Projects</p>
        <div className="space-y-6">
          {projects.map((p) => (
            <div key={p.name} className="pl-5 border-l border-[#222]">
              <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                <span className="font-mono text-sm font-bold text-white">{p.name}</span>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-[#a78bfa] hover:text-white transition-colors">Live →</a>
                )}
                <span className="font-mono text-[10px] text-white/25 ml-auto">{p.period}</span>
              </div>
              <ul className="space-y-1.5 mt-3 mb-3">
                {p.bullets.map((b) => (
                  <li key={b} className="text-white/50 text-sm flex gap-2">
                    <span className="text-[#7C3AED] mt-0.5 shrink-0">+</span>{b}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[10px] text-white/25 italic">{p.skills}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content & Publications */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Content & Publications</p>
        <div className="pl-5 border-l border-[#222]">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <span className="font-mono text-sm font-bold text-white">@pmvision_ai</span>
            <span className="text-white/40 text-sm">Telegram channel · AI, product, career</span>
          </div>
          <ul className="space-y-1.5 mb-3">
            {[
              "Publishing publicly about AI experiments, product thinking, and job search process",
              "Dzen: 67% readthrough rate; Threads: ~15,000 views per thread",
              "Active on: Telegram, Dzen, Threads, LinkedIn, VC.ru, Habr, Medium, X",
            ].map((b) => (
              <li key={b} className="text-white/50 text-sm flex gap-2">
                <span className="text-[#7C3AED] mt-0.5 shrink-0">+</span>{b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Skills</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-[10px] text-white/30 mb-3 tracking-wider">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
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
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-4">About</p>
        <p className="text-white/50 text-sm leading-relaxed">
          Product Manager who ships digital products hands-on, from customer discovery to live users.
          Built and deployed Expat Roadmap SEA (Next.js + Supabase) and Portfolio + JasurGPT solo.
          Configured Claude + Telegram + Whisper pipeline independently, built AI Career System for automated job search,
          developing an AI agent for business analytics. Use n8n, Voiceflow, and NotebookLM in real projects.
          Publishing about the process publicly at{" "}
          <a href="https://t.me/pmvision_ai" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:text-white transition-colors">
            @pmvision_ai
          </a>.
        </p>
        <p className="font-mono text-[10px] text-white/25 mt-4">
          Portfolio: jasur-portfolio-pied.vercel.app · Brandbook/Portfolio PDF: available on request · Telegram: @pmvision_ai
        </p>
      </section>
    </div>
  );
}
