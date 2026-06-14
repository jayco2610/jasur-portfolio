export default function WritingPage() {
  const articles = [
    {
      title: "How I Built an AI System for My Own Job Search: Architecture, Tools, Results",
      platform: "Habr",
      lang: "RU",
      description: "Technical breakdown: Claude + n8n + Google Sheets + Telegram. How automation works from vacancy to cover letter.",
      status: "planned",
    },
    {
      title: "PM Building in Public: Using AI to Job-Hunt at Scale",
      platform: "LinkedIn",
      lang: "EN",
      description: "How a PM built a custom AI pipeline for his own job search and what it revealed about modern hiring.",
      status: "planned",
    },
    {
      title: "Retention Without Budget: What Actually Works",
      platform: "VC.ru",
      lang: "RU",
      description: "Product case: how to improve retention without paid tools, relying on product mechanics.",
      status: "planned",
    },
  ];

  const channels = [
    { name: "Telegram @pmvision_ai", description: "Main hub. AI tools, PM thinking, job search diary.", href: "https://t.me/pmvision_ai" },
    { name: "LinkedIn", description: "Professional content in English. PM cases and AI updates.", href: "https://www.linkedin.com/in/jasur-akhmadaliev" },
    { name: "VC.ru", description: "Business cases and product thinking in Russian.", href: "https://vc.ru/id5991727" },
    { name: "Habr", description: "Deep technical and product articles in Russian.", href: null },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">Writing</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-2">Articles & Content</h1>
      <p className="text-white/40 text-sm mb-14">Cases, technical breakdowns, and product thinking.</p>

      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Upcoming</p>
        <div className="space-y-4">
          {articles.map((a) => (
            <div key={a.title} className="p-5 bg-[#111111] border border-[#1f1f1f] rounded-lg">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30 border border-white/10">{a.platform}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E3A8A]/30 text-blue-300">{a.lang}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400">{a.status}</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{a.title}</h3>
              <p className="text-white/40 text-sm">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Channels</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {channels.map((c) => (
            <div key={c.name} className="p-5 bg-[#111111] border border-[#1f1f1f] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-mono text-sm text-white font-bold">{c.name}</h3>
                {c.href && (
                  <a href={c.href} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-[#a78bfa] hover:text-white transition-colors">
                    Visit →
                  </a>
                )}
              </div>
              <p className="text-white/40 text-sm">{c.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
