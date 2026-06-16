export default function WritingPage() {
  const published = [
    {
      title: "The PM AI Stack That Actually Works (And Why 95% of Teams Miss It)",
      platform: "Medium",
      lang: "EN",
      description: "The AI tools product managers actually use across discovery, prioritization, PRDs, and analytics — and the gap between adopting AI and getting results.",
      href: "https://medium.com/@jasurakhmadaliev283/the-pm-ai-stack-that-actually-works-and-why-95-of-teams-miss-it-9fb5e3b46c4f",
    },
    {
      title: "Google Killed the Search Box at I/O 2026. Here's What It Means for Product Teams",
      platform: "Medium",
      lang: "EN",
      description: "How the Google I/O 2026 announcements reshape search and traffic, and what product teams should do about it.",
      href: "https://medium.com/@jasurakhmadaliev283/google-killed-the-search-box-at-i-o-2026-heres-what-it-means-for-product-teams-50d37a954ed7",
    },
    {
      title: "The NASA Trick Product Managers Almost Never Use",
      platform: "Medium",
      lang: "EN",
      description: "A structured thinking technique borrowed from NASA that most PMs overlook when making decisions under uncertainty.",
      href: "https://medium.com/@jasurakhmadaliev283/the-nasa-trick-product-managers-almost-never-use-67156efea126",
    },
    {
      title: "The Customers You Already Have Are the Ones You Are Losing",
      platform: "Medium",
      lang: "EN",
      description: "Why retention beats acquisition, and the quiet ways companies lose the customers they already paid to win.",
      href: "https://medium.com/@jasurakhmadaliev283/the-customers-you-already-have-are-the-ones-you-are-losing-c69461b648f8",
    },
    {
      title: "Your Best Thinking Happens Before You Start Writing",
      platform: "Medium",
      lang: "EN",
      description: "How voice and AI capture better thinking than typing, and why input speed shapes the quality of your ideas.",
      href: "https://medium.com/@jasurakhmadaliev283/your-best-thinking-happens-before-you-start-writing-0eb0f35df9c7",
    },
    {
      title: "Fable 5 за 36 часов: запуск, скандал, запрет. Что это значит для бизнеса на AI",
      platform: "VC.ru",
      lang: "RU",
      description: "Launch, controversy, and restriction of a new AI model in 36 hours, and what it means for businesses building on AI.",
      href: "https://vc.ru/id5991727/2977300-fable-5-zapusk-skandal-posledstviya-dlya-biznesa-na-ai",
    },
    {
      title: "Я потратил 8 месяцев на продукт, который никому не был нужен. Вот где была ошибка",
      platform: "VC.ru",
      lang: "RU",
      description: "A personal failure case: eight months building a marketplace nobody needed, and the real mistake behind it.",
      href: "https://vc.ru/id5991727/2968908-oshibka-v-sozdanii-marketpleysa-dlya-repetitorov-i-studentov",
    },
    {
      title: "+15% повторных продаж за квартал — без новой рекламы, через RFM-анализ",
      platform: "VC.ru",
      lang: "RU",
      description: "Product case: +15% repeat sales in a quarter using RFM segmentation in Excel, with no new ad budget.",
      href: "https://vc.ru/id5991727/2972334-povtornye-prodazhi-na-15-bez-novoy-reklamy-s-pomoshchyu-rfm-analiza",
    },
  ];

  const channels = [
    { name: "Telegram @pmvision_ai", description: "Main hub. AI tools, PM thinking, job search diary.", href: "https://t.me/pmvision_ai" },
    { name: "Medium", description: "Long-form product and AI articles in English.", href: "https://medium.com/@jasurakhmadaliev283" },
    { name: "LinkedIn", description: "Professional content in English. PM cases and AI updates.", href: "https://www.linkedin.com/in/jasur-akhmadaliev" },
    { name: "VC.ru", description: "Business cases and product thinking in Russian.", href: "https://vc.ru/id5991727" },
    { name: "Habr", description: "Deep technical and product articles in Russian.", href: "https://habr.com/ru/users/Akhmadaliev/" },
    { name: "X", description: "Short-form English distribution.", href: "https://x.com/Jasur1651Jasur" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">Writing</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-2">Articles & Content</h1>
      <p className="text-white/40 text-sm mb-14">Cases, technical breakdowns, and product thinking.</p>

      {/* Published */}
      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Published</p>
        <div className="space-y-4">
          {published.map((a) => (
            <a
              key={a.href}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-[#111111] rounded-lg border border-[#1f1f1f] hover:border-[#7C3AED]/40 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30 border border-white/10">{a.platform}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E3A8A]/30 text-blue-300">{a.lang}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">published</span>
                <span className="font-mono text-[10px] text-[#a78bfa] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">Read {a.platform === "Medium" ? "on Medium" : "on VC.ru"} →</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-[#a78bfa] transition-colors">{a.title}</h3>
              <p className="text-white/40 text-sm">{a.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Channels */}
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
