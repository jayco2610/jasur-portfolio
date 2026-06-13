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

  const skills = {
    "Product": ["Roadmap planning", "RICE / ICE prioritization", "User research", "A/B testing", "Backlog management"],
    "Marketing": ["Attribution modeling", "Conversion funnels", "Content strategy", "Campaign management"],
    "AI & Tech": ["Claude API", "Gemini API", "n8n automation", "LangChain", "Ollama", "Python (basics)", "Next.js"],
    "Tools": ["Notion", "Linear", "Figma (reading)", "Google Sheets (scripting)", "Amplitude (basics)"],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-start justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFF] mb-2">
            Jasur Akhmadaliev
          </h1>
          <p className="text-white/60">Product Manager · Marketing · AI</p>
          <p className="text-white/40 text-sm mt-1">
            jasurakhmadaliev283@gmail.com · @pmvision_ai
          </p>
        </div>
        <a
          href="/resume.pdf"
          className="px-5 py-2.5 bg-[#7C3AED] text-white rounded-lg text-sm font-medium hover:bg-[#6d28d9] transition-colors shrink-0"
        >
          Download PDF
        </a>
      </div>

      {/* Experience */}
      <section className="mb-14">
        <h2 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-8">
          Experience
        </h2>
        <div className="space-y-8">
          {experience.map((job) => (
            <div key={`${job.role}-${job.company}`} className="relative pl-6 border-l border-white/10">
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[#7C3AED] -translate-x-[5px]" />
              <div className="flex items-baseline gap-3 mb-3">
                <h3 className="text-[#F8FAFF] font-semibold">{job.role}</h3>
                <span className="text-white/50 text-sm">{job.company}</span>
                <span className="text-white/30 text-xs ml-auto">{job.period}</span>
              </div>
              <ul className="space-y-1.5">
                {job.bullets.map((b) => (
                  <li key={b} className="text-white/60 text-sm flex gap-2">
                    <span className="text-[#7C3AED] mt-0.5 shrink-0">·</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-6">
          Skills
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-white/40 text-xs font-mono mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
