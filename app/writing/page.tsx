export default function WritingPage() {
  const articles = [
    {
      title: "Как я построил AI-систему для поиска работы: архитектура, инструменты, результаты",
      platform: "Habr",
      lang: "RU",
      description:
        "Технический разбор: Claude + n8n + Google Sheets + Telegram. Как работает автоматизация от вакансии до сопроводительного письма.",
      status: "planned",
      link: null,
    },
    {
      title: "PM Building in Public: Using AI to Job-Hunt at Scale",
      platform: "LinkedIn",
      lang: "EN",
      description:
        "How a PM built a custom AI pipeline for his own job search and what it revealed about modern hiring.",
      status: "planned",
      link: null,
    },
    {
      title: "Retention без бюджета: что реально работает",
      platform: "VC.ru",
      lang: "RU",
      description:
        "Кейс из работы с продуктом: как поднять retention без платных инструментов, опираясь на продуктовые механики.",
      status: "planned",
      link: null,
    },
  ];

  const channels = [
    {
      name: "Telegram @pmvision_ai",
      description: "Main hub. AI tools, PM thinking, job search diary. In Russian.",
      link: "https://t.me/pmvision_ai",
    },
    {
      name: "LinkedIn",
      description: "Professional content in English. PM cases and AI updates.",
      link: "https://linkedin.com/in/jasurakhmadaliev",
    },
    {
      name: "Habr",
      description: "Deep technical and product articles in Russian.",
      link: null,
    },
    {
      name: "VC.ru",
      description: "Business cases and product thinking in Russian.",
      link: null,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[#F8FAFF] mb-2">Writing</h1>
      <p className="text-white/50 mb-12">Articles, cases, and content across platforms.</p>

      <section className="mb-16">
        <h2 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-6">
          Upcoming articles
        </h2>
        <div className="space-y-4">
          {articles.map((a) => (
            <div
              key={a.title}
              className="p-5 rounded-xl border border-white/10 bg-white/5"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 font-mono shrink-0">
                  {a.platform}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1E3A8A]/30 text-blue-300 font-mono shrink-0">
                  {a.lang}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono shrink-0">
                  {a.status}
                </span>
              </div>
              <h3 className="text-[#F8FAFF] font-medium text-sm mb-2">{a.title}</h3>
              <p className="text-white/50 text-sm">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-6">
          Where I publish
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {channels.map((c) => (
            <div
              key={c.name}
              className="p-5 rounded-xl border border-white/10 bg-white/5"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[#F8FAFF] font-medium text-sm">{c.name}</h3>
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#7C3AED] hover:text-purple-300 transition-colors"
                  >
                    Visit →
                  </a>
                )}
              </div>
              <p className="text-white/50 text-sm">{c.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
