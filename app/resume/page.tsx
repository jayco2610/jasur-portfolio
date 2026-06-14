export default function ResumePage() {
  const experience = [
    {
      role: "Independent AI Builder",
      company: "Personal AI Projects",
      period: "May 2026 – Present",
      bullets: [
        "Built expat networking web app solo via vibe coding (Cursor + Claude)",
        "Configured Claude + Telegram + Whisper voice pipeline end-to-end, independently",
        "Developing AI agent for ABC/XYZ inventory analysis using n8n (in progress)",
        "Built conversational automation bots in Voiceflow for real business use cases",
      ],
      skills: "Claude API, Cursor, Telegram Bot API, Whisper, n8n, Voiceflow, Prompt Engineering",
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
      company: "Yonma Yon",
      period: "Nov 2024 – 2025",
      bullets: [
        "Conducted customer discovery: 10+ user interviews, analyzed insights via NotebookLM and ChatGPT",
        "Designed and launched MVP: landing page + Telegram bot",
        "Configured AI agents to automate incoming request processing via Voiceflow + n8n",
        "Opened B2B direction: analytics-as-a-service offering for business partners",
        "Result: 150+ users acquired, first B2B inquiries received",
      ],
      skills: "CustDev, CJM, MVP, Voiceflow, n8n, NotebookLM, ChatGPT, Telegram Bot API",
    },
    {
      role: "Product Manager / Co-founder",
      company: "Instameal — FoodTech Startup",
      period: "Mar 2024 – Jul 2024",
      bullets: [
        "Launched product from zero: customer discovery, CJM, MVP development, first paying users",
        "Built MVP via vibe coding: Telegram bot + website; designed UI flows in Figma",
        "Set up conversion funnel and product metrics dashboard",
        "Coordinated cross-functional team of 8 across logistics, development, and marketing",
        "Result: ~400 users, ~40% conversion rate",
      ],
      skills: "CustDev, CJM, Figma, Telegram Bot API, Product Metrics, Scrum, AI Research",
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
        "Result: NPS 62→78, response time –30%",
      ],
      skills: "Client Management, Requirements Gathering, Google Sheets, Claude, ChatGPT",
    },
  ];

  const skills: Record<string, string[]> = {
    "Product": ["Product Discovery", "CustDev", "CJM", "User Stories", "Backlog Prioritization", "A/B Testing", "MVP", "Scrum", "NPS", "LTV / CAC", "Funnel Analytics"],
    "AI & Automation": ["Claude API", "ChatGPT", "Prompt Engineering", "n8n", "Voiceflow", "Cursor", "NotebookLM", "AI Agents"],
    "Tools": ["Google Sheets", "Figma", "Canva", "Telegram Bot API", "Whisper", "Facebook API"],
    "Languages": ["English (B1)", "Russian (Native)", "Turkish (B2)", "Uzbek (Native)"],
  };

  const certifications = [
    { name: "AI for Product Managers", issuer: "BOS Shelf", year: "2027" },
    { name: "CJM and CustDev Tools", issuer: "ProductStar", year: "2026" },
    { name: "Metrics and Models for Project Managers", issuer: "Shelf", year: "2025" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
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
              className="font-mono text-xs text-[#a78bfa] hover:text-white transition-colors">
              LinkedIn →
            </a>
            <a href="https://github.com/jayco2610" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-[#a78bfa] hover:text-white transition-colors">
              GitHub →
            </a>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href="/resume.pdf"
            download
            className="font-mono text-sm px-4 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors"
          >
            PDF — EN
          </a>
          <a
            href="/resume-ru.pdf"
            download
            className="font-mono text-sm px-4 py-2.5 border border-[#7C3AED]/40 text-[#a78bfa] rounded hover:bg-[#7C3AED]/10 transition-colors"
          >
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
            <span className="font-mono text-[10px] text-white/25 ml-auto">Moscow · Expected 2027</span>
          </div>
          <p className="text-white/40 text-sm">Bachelor of Business and Economics, International Program</p>
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
                    <span className="text-[#7C3AED] mt-0.5 shrink-0">+</span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[10px] text-white/25 italic">{job.skills}</p>
            </div>
          ))}
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

      {/* Certifications */}
      <section>
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
      </section>
    </div>
  );
}
