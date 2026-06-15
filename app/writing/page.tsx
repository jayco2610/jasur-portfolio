export default function WritingPage() {
  const published = [
    {
      title: "PM и AI в 2025: статистика, инструменты и разрыв между использованием и результатом",
      platform: "VC.ru",
      lang: "RU",
      description: "94% продакт-менеджеров используют AI. Разбор по этапам: discovery, приоритизация, PRD, аналитика — и почему адаптация не равна результату.",
      href: "https://vc.ru/id5991727/2980172-prodakt-menedzhery-i-ai-instrumenty-statistika-i-razryv-v-ispolzovanii",
    },
    {
      title: "Google сломал SEO на Google I/O 2026. Что делать бизнесу",
      platform: "VC.ru",
      lang: "RU",
      description: "Как анонсы Google I/O 2026 меняют поиск и трафик, и что это значит для бизнеса, который жил на SEO.",
      href: "https://vc.ru/id5991727/2980099-google-slomal-seo-na-google-i-o-2026-chto-delat-biznesu",
    },
    {
      title: "Fable 5 за 36 часов: запуск, скандал, запрет. Что это значит для бизнеса на AI",
      platform: "VC.ru",
      lang: "RU",
      description: "Разбор запуска новой модели без пресс-релиза: что произошло за 36 часов и какие выводы для тех, кто строит продукты на AI.",
      href: "https://vc.ru/id5991727/2977300-fable-5-zapusk-skandal-posledstviya-dlya-biznesa-na-ai",
    },
    {
      title: "+15% повторных продаж за квартал — без новой рекламы, через RFM-анализ",
      platform: "VC.ru",
      lang: "RU",
      description: "Продуктовый кейс: три сегмента в Excel вместо новых бюджетов. Как RFM-анализ поднял повторные продажи без привлечения новых клиентов.",
      href: "https://vc.ru/id5991727/2972334-povtornye-prodazhi-na-15-bez-novoy-reklamy-s-pomoshchyu-rfm-analiza",
    },
    {
      title: "Вы говорите 130 слов в минуту, печатаете 40. В этой разнице теряется ваше лучшее мышление",
      platform: "VC.ru",
      lang: "RU",
      description: "Как голосовые заметки и AI помогают думать быстрее и глубже, чем текст, и почему скорость ввода влияет на качество мысли.",
      href: "https://vc.ru/id5991727/2972189-kak-uluchshit-mishlenie-s-pomoshchyu-golosovykh-zametok-i-ai",
    },
    {
      title: "Я потратил 8 месяцев на продукт, который никому не был нужен. Вот где была ошибка",
      platform: "VC.ru",
      lang: "RU",
      description: "Личный кейс провала: маркетплейс для репетиторов и студентов, 8 месяцев работы и настоящая причина, по которой он не взлетел.",
      href: "https://vc.ru/id5991727/2968908-oshibka-v-sozdanii-marketpleysa-dlya-repetitorov-i-studentov",
    },
    {
      title: "Зачем мне Perplexity, если есть Google? Отвечу — но ответ не тот, которого вы ждёте",
      platform: "VC.ru",
      lang: "RU",
      description: "Когда Perplexity реально выигрывает у Google, а когда нет. Практическое сравнение двух подходов к поиску.",
      href: "https://vc.ru/id5991727/2968896-perspektivy-ispolzovaniya-perplexity-i-google",
    },
    {
      title: "Удержать клиента в 5–7 раз дешевле привлечения. Почему компании делают наоборот?",
      platform: "VC.ru",
      lang: "RU",
      description: "Почему бизнес вкладывается в привлечение вместо удержания, хотя retention дешевле, и что с этим делать.",
      href: "https://vc.ru/id5991727/2967728-uderzhanie-klienta-vazhnee-privlecheniya",
    },
  ];

  const upcoming = [
    {
      title: "I Built a Personal AI Assistant on My Own Resume — for $0/month",
      platform: "LinkedIn / Habr",
      lang: "EN / RU",
      description: "How I shipped JasurGPT: Next.js + OpenRouter free tier + 4-model fallback chain. Runs 24/7, knows my full work history, costs nothing.",
    },
    {
      title: "How I Built an AI System for My Own Job Search: Architecture, Tools, Results",
      platform: "Habr",
      lang: "RU",
      description: "Technical breakdown: Claude + n8n + Google Sheets + Telegram. How automation works from vacancy to cover letter.",
    },
  ];

  const channels = [
    { name: "Telegram @pmvision_ai", description: "Main hub. AI tools, PM thinking, job search diary.", href: "https://t.me/pmvision_ai" },
    { name: "VC.ru", description: "Business cases and product thinking in Russian.", href: "https://vc.ru/id5991727" },
    { name: "LinkedIn", description: "Professional content in English. PM cases and AI updates.", href: "https://www.linkedin.com/in/jasur-akhmadaliev" },
    { name: "Habr", description: "Deep technical and product articles in Russian.", href: null },
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
                <span className="font-mono text-[10px] text-[#a78bfa] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">Read on VC.ru →</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-[#a78bfa] transition-colors">{a.title}</h3>
              <p className="text-white/40 text-sm">{a.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Upcoming</p>
        <div className="space-y-4">
          {upcoming.map((a) => (
            <div key={a.title} className="p-5 bg-[#111111] rounded-lg border border-[#1f1f1f]">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30 border border-white/10">{a.platform}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E3A8A]/30 text-blue-300">{a.lang}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400">planned</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{a.title}</h3>
              <p className="text-white/40 text-sm">{a.description}</p>
            </div>
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
