export default function ServicesPage() {
  const automation = [
    {
      price: "от 35 000 ₽",
      name: "CRM + AI автоматизация под ключ",
      sub: "amoCRM / Битрикс",
      description:
        "Настройка CRM + AI-слой: воронка и этапы сделки, импорт базы, базовая автоматизация (3 сценария), AI-агент для входящих обращений, интеграция с Telegram или WhatsApp.",
      featured: true,
    },
    {
      price: "от 25 000 ₽",
      name: "Внедрение AI-агента под задачу",
      sub: null,
      description:
        "AI-агент под конкретную задачу: обработка обращений, квалификация лидов, внутренний ассистент, автоответы. Разбор задачи и техническое ТЗ.",
      featured: false,
    },
    {
      price: "от 15 000 ₽",
      name: "Автоматизация процесса",
      sub: "n8n",
      description:
        "Связка CRM, мессенджеров, AI и таблиц. Заявка из формы → карточка CRM → уведомление в Telegram → AI-ответ клиенту. Схема, настройка, тест, инструкция. Без кода.",
      featured: false,
    },
    {
      price: "от 8 000 ₽",
      name: "Продуктовый аудит AI-инструментов",
      sub: null,
      description:
        "Разбор стека (ChatGPT, Notion AI, Copilot): где теряются время и деньги. Итог: 1-страничный план оптимизации с приоритетами. Встреча 1,5 часа + документ.",
      featured: false,
    },
    {
      price: "от 3 500 ₽",
      name: "Консультация, разбор задачи",
      sub: "1 час",
      description:
        "CRM, автоматизация, AI-инструменты или процессы. Чёткий план действий и инструменты под вашу ситуацию. Zoom или звонок + письменное резюме.",
      featured: false,
    },
  ];

  const product = [
    {
      price: "от 60 000 ₽/мес",
      name: "Контент-завод / AI Brand Ambassador",
      sub: null,
      description:
        "AI-система ежедневного контента: скрипты, видео с AI-аватаром, посты, stories под 3–5 платформ. Claude + n8n + HeyGen + планировщик. 20–40 единиц контента в месяц — бренд живёт в соцсетях каждый день без съёмок.",
      note: "Подписки AI-сервисов (HeyGen, Claude API) оплачиваются клиентом отдельно — ориентировочно $80–250/мес.",
      featured: true,
    },
    {
      price: "от 40 000 ₽/мес",
      name: "PM-сопровождение продукта",
      sub: null,
      description:
        "Внешний PM: Discovery, CustDev, CJM, бэклог, roadmap, метрики. Работаю в вашем инструменте (Jira, Notion, Linear). Асинхронно в Telegram + встречи по запросу.",
      note: null,
      featured: false,
    },
    {
      price: "от 25 000 ₽",
      name: "Продуктовый маркетинг",
      sub: null,
      description:
        "Позиционирование, ICP, УТП, воронка, контент-план под цели роста. AI-анализ конкурентов включён. Итог: стратегия + 30-дневный контент-план + шаблоны под платформы.",
      note: null,
      featured: false,
    },
    {
      price: "от 20 000 ₽",
      name: "Аудит отдела / процесса",
      sub: null,
      description:
        "Маркетинг, продажи, онбординг, клиентский сервис. Нахожу узкие места и расставляю приоритеты. Итог: карта процесса + план оптимизации с оценкой эффекта. 2–3 встречи + документ.",
      note: null,
      featured: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">Services</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-2">Чем помогаю</h1>
      <p className="text-white/40 text-sm mb-14">
        Заявки:{" "}
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
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">AI и автоматизация</p>
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
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <span className="font-mono text-lg font-bold text-[#a78bfa]">{s.price}</span>
                  {s.sub && (
                    <span className="font-mono text-xs text-white/30 ml-2">· {s.sub}</span>
                  )}
                </div>
              </div>
              <p className="font-mono text-sm font-bold text-white mb-2">{s.name}</p>
              <p className="text-white/50 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product & Content */}
      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">Продукт и контент</p>
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
          Подписки на AI-сервисы при необходимости оплачиваются клиентом отдельно — обсуждается на старте.
        </p>
      </section>

      {/* CTA */}
      <div className="p-6 bg-[#111111] border border-[#7C3AED]/20 rounded-lg">
        <p className="font-mono text-sm font-bold text-white mb-1">Обсудить задачу</p>
        <p className="text-white/40 text-sm mb-4">CRM, автоматизация, AI-инструменты и процессы. Пишите — разберём и подберём формат.</p>
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
            Написать на почту
          </a>
        </div>
      </div>
    </div>
  );
}
