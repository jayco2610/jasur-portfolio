export default function ServicesPage() {
  const automation = [
    {
      price: "from 35,000 ₽",
      name: "CRM + AI Automation — Full Setup",
      sub: "amoCRM / Bitrix",
      description:
        "CRM setup with an AI layer: sales funnel and deal stages, database import, basic automation (3 scenarios), AI agent for incoming requests, integration with Telegram or WhatsApp.",
      featured: true,
    },
    {
      price: "from 25,000 ₽",
      name: "AI Agent Implementation",
      sub: null,
      description:
        "Custom AI agent for a specific task: handling inquiries, lead qualification, internal assistant, auto-replies. Includes task discovery and technical specification.",
      featured: false,
    },
    {
      price: "from 15,000 ₽",
      name: "Process Automation",
      sub: "n8n",
      description:
        "Connect your CRM, messengers, AI, and spreadsheets. A form submission becomes a CRM card, triggers a Telegram notification, and sends an AI reply to the client. Schema, setup, testing, instructions. No code required.",
      featured: false,
    },
    {
      price: "from 8,000 ₽",
      name: "AI Tools Audit",
      sub: null,
      description:
        "Review your current stack (ChatGPT, Notion AI, Copilot): find where time and money are lost. Output: a 1-page optimization plan with priorities. 1.5-hour session + document.",
      featured: false,
    },
    {
      price: "from 3,500 ₽",
      name: "Consultation — Task Review",
      sub: "1 hour",
      description:
        "CRM, automation, AI tools, or processes. A clear action plan and tools matched to your situation. Zoom or call + written summary.",
      featured: false,
    },
  ];

  const product = [
    {
      price: "from 60,000 ₽/mo",
      name: "Content Factory / AI Brand Ambassador",
      sub: null,
      description:
        "AI-driven daily content system: scripts, AI avatar videos, posts, stories across 3–5 platforms. Claude + n8n + HeyGen + scheduler. 20–40 content pieces per month — brand stays active every day without filming.",
      note: "AI service subscriptions (HeyGen, Claude API) are paid by the client separately — approximately $80–250/mo.",
      featured: true,
    },
    {
      price: "from 40,000 ₽/mo",
      name: "Fractional PM",
      sub: null,
      description:
        "External product manager: Discovery, CustDev, CJM, backlog, roadmap, metrics. Works in your tool (Jira, Notion, Linear). Async via Telegram + calls on demand.",
      note: null,
      featured: false,
    },
    {
      price: "from 25,000 ₽",
      name: "Product Marketing",
      sub: null,
      description:
        "Positioning, ICP, USP, funnel, content plan aligned with growth goals. AI competitor analysis included. Output: strategy + 30-day content plan + platform templates.",
      note: null,
      featured: false,
    },
    {
      price: "from 20,000 ₽",
      name: "Department / Process Audit",
      sub: null,
      description:
        "Marketing, sales, onboarding, or customer service. Find bottlenecks and prioritize fixes. Output: process map + optimization plan with impact estimates. 2–3 sessions + document.",
      note: null,
      featured: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">Services</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-2">What I can help with.</h1>
      <p className="text-white/40 text-sm mb-14">
        Contact:{" "}
        <a href="mailto:jasurakhmadaliev283@gmail.com" className="text-[#a78bfa] hover:text-white transition-colors">
          jasurakhmadaliev283@gmail.com
        </a>{" "}
        · Telegram:{" "}
        <a href="https://t.me/biznesmind" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:text-white transition-colors">
          @biznesmind
        </a>
      </p>

      {/* AI & Automation */}
      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">AI & Automation</p>
        <div className="space-y-4">
          {automation.map((s) => (
            <div
              key={s.name}
              className={`p-6 rounded-lg border transition-colors ${
                s.featured
                  ? "bg-[#111111] border-[#7C3AED]/30"
                  : "bg-[#111111] border-[#1f1f1f] hover:border-[#7C3AED]/20"
              }`}
            >
              <div className="mb-3">
                <span className="font-mono text-lg font-bold text-[#a78bfa]">{s.price}</span>
                {s.sub && (
                  <span className="font-mono text-xs text-white/30 ml-2">· {s.sub}</span>
                )}
              </div>
              <p className="font-mono text-sm font-bold text-white mb-2">{s.name}</p>
              <p className="text-white/50 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product & Content */}
      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Product & Content</p>
        <div className="space-y-4">
          {product.map((s) => (
            <div
              key={s.name}
              className={`p-6 rounded-lg border transition-colors ${
                s.featured
                  ? "bg-[#111111] border-[#7C3AED]/30"
                  : "bg-[#111111] border-[#1f1f1f] hover:border-[#7C3AED]/20"
              }`}
            >
              <div className="mb-3">
                <span className="font-mono text-lg font-bold text-[#a78bfa]">{s.price}</span>
              </div>
              <p className="font-mono text-sm font-bold text-white mb-2">{s.name}</p>
              <p className="text-white/50 text-sm leading-relaxed">{s.description}</p>
              {s.note && (
                <p className="font-mono text-[10px] text-white/25 mt-3 italic">{s.note}</p>
              )}
            </div>
          ))}
        </div>
        <p className="font-mono text-[10px] text-white/25 mt-4 italic">
          AI service subscriptions, where needed, are paid by the client separately — discussed at the start.
        </p>
      </section>

      {/* CTA */}
      <div className="p-6 bg-[#111111] border border-[#7C3AED]/20 rounded-lg">
        <p className="font-mono text-sm font-bold text-white mb-1">Let&apos;s talk</p>
        <p className="text-white/40 text-sm mb-4">CRM, automation, AI tools, or processes. Write — we&apos;ll figure out the right format together.</p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://t.me/biznesmind"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors"
          >
            Telegram @biznesmind
          </a>
          <a
            href="mailto:jasurakhmadaliev283@gmail.com"
            className="font-mono text-sm px-5 py-2.5 border border-white/15 text-white/70 rounded hover:border-white/30 hover:text-white transition-colors"
          >
            Send an email
          </a>
        </div>
      </div>
    </div>
  );
}
