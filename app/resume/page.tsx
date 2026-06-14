export default function ResumePage() {
  const experience = [
    {
      role: "Product Manager",
      company: "Instameal",
      period: "2023 – 2024",
      bullets: [
        "Led product from 0 to launch: roadmap, prioritization, user research",
        "Reduced onboarding drop-off by 34% via A/B testing",
        "Built analytics dashboard tracking CAC, retention, order frequency",
        "Coordinated dev, design, and marketing teams across sprints",
      ],
    },
    {
      role: "Marketing Analyst",
      company: "IDF Lab",
      period: "2022 – 2023",
      bullets: [
        "Built UTM tracking and attribution model from scratch",
        "Increased lead quality by 28% by reworking targeting criteria",
        "Analyzed conversion funnels and identified key bottlenecks",
        "Competitive analysis for B2B SaaS product positioning",
      ],
    },
    {
      role: "Product Marketing",
      company: "Synergia",
      period: "2022",
      bullets: [
        "Positioning and messaging for new product line",
        "Content strategy for LinkedIn and Telegram (2x engagement growth)",
        "Managed full product launch: landing, email sequence, social campaigns",
      ],
    },
    {
      role: "PM Consultant",
      company: "Molot (Freelance)",
      period: "2023",
      bullets: [
        "Product strategy and roadmap prioritization advisory",
        "Structured backlog, implemented agile workflows",
      ],
    },
    {
      role: "Co-founder / Product",
      company: "Yonma Yon",
      period: "2021 – 2022",
      bullets: [
        "Built local marketplace connecting craftspeople with customers",
        "Handled product, operations, and early-stage marketing",
      ],
    },
  ];

  const skills: Record<string, string[]> = {
    "Product": ["Roadmap planning", "RICE / ICE prioritization", "User research", "A/B testing", "Backlog management"],
    "Marketing": ["Attribution modeling", "Conversion funnels", "Content strategy", "Campaign management"],
    "AI & Tech": ["Claude API", "n8n", "LangChain", "Ollama", "OpenRouter", "Python (basics)", "Next.js"],
    "Tools": ["Notion", "Linear", "Figma (reading)", "Google Sheets scripting", "Amplitude (basics)"],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-start justify-between mb-14 gap-6 flex-wrap">
        <div>
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">Resume</p>
          <h1 className="font-mono text-3xl font-bold text-white mb-2">Jasur Akhmadaliev</h1>
          <p className="text-white/50 text-sm">Product Manager · Marketing · AI</p>
          <div className="flex gap-4 mt-3 flex-wrap">
            <a href="mailto:jasurakhmadaliev283@gmail.com" className="font-mono text-xs text-white/30 hover:text-white transition-colors">
              jasurakhmadaliev283@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/jasur-akhmadaliev" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-[#a78bfa] hover:text-white transition-colors">
              LinkedIn →
            </a>
            <a href="https://vc.ru/id5991727" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-[#a78bfa] hover:text-white transition-colors">
              VC.ru →
            </a>
            <a href="https://github.com/jayco2610" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-[#a78bfa] hover:text-white transition-colors">
              GitHub →
            </a>
          </div>
        </div>
        <a
          href="/resume.pdf"
          className="font-mono text-sm px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors shrink-0"
        >
          Download PDF
        </a>
      </div>

      {/* Experience */}
      <section className="mb-14">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-8">Experience</p>
        <div className="space-y-8">
          {experience.map((job) => (
            <div key={`${job.role}-${job.company}`} className="pl-5 border-l border-[#222]">
              <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                <span className="font-mono text-sm font-bold text-white">{job.role}</span>
                <span className="text-white/40 text-sm">{job.company}</span>
                <span className="font-mono text-[10px] text-white/25 ml-auto">{job.period}</span>
              </div>
              <ul className="space-y-1.5">
                {job.bullets.map((b) => (
                  <li key={b} className="text-white/50 text-sm flex gap-2">
                    <span className="text-[#7C3AED] mt-0.5 shrink-0">+</span>
                    {b}
                  </li>
                ))}
              </ul>
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
          <div className="flex items-center gap-4 p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg">
            <div className="w-8 h-8 bg-[#7C3AED]/15 rounded flex items-center justify-center shrink-0">
              <span className="font-mono text-[10px] text-[#a78bfa] font-bold">AI</span>
            </div>
            <div>
              <p className="font-mono text-sm text-white font-bold">Deep Learning AI Specialization</p>
              <p className="font-mono text-[10px] text-white/35 mt-0.5">deeplearning.ai · Issued 2024</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
