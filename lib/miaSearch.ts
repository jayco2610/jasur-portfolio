// Поиск фрагментов для живой Mia. Без внешних сервисов, векторных баз и
// новых зависимостей: совпадение слов вопроса со словами фрагмента.
//
// Как это устроено.
// 1. Слово вопроса и слово фрагмента приводятся к одному виду: нижний
//    регистр, «ё» как «е», обрезка русского окончания по короткому списку,
//    затем первые шесть знаков основы. Так «чистка», «чистку», «чистки»
//    и «имплантация», «импланты» сходятся без словаря.
// 2. Синонимы собраны в группы (GROUPS). Любое слово группы заменяется её
//    именем и в вопросе, и во фрагментах: чистка = гигиена, цена =
//    стоимость = сколько стоит, воскресенье = выходные = часы работы.
//    Английские слова вопроса входят в те же группы, поэтому вопрос на
//    английском находит русский фрагмент.
// 3. Фрагмент получает баллы за каждое совпавшее слово вопроса, вес слова
//    тем выше, чем реже оно встречается в документе (idf), если оно есть в
//    названии раздела и если во фрагменте оно повторяется. Слова-связки («как», «у вас», «ли») и слова
//    цены (общие для всех прайсов) баллов не дают, цена лишь слегка
//    поднимает фрагменты с рублями.
// 4. Порог. Берутся до трёх фрагментов, но не слабее 60 процентов от лучшего.
//    Если больше половины значимых слов вопроса нет нигде в документе
//    («виниры из золота», «как пройти в ЗАГС»), не возвращается ничего:
//    лучше честная фраза про консультацию, чем ответ про соседнюю тему.
// 5. Вопрос из одного-двух слов без смысла («а корейский?») дополняется
//    прошлым вопросом посетителя.

import { MIA_CHUNKS, type MiaChunk } from "./mia";

export type MiaSource = { id: string; title: string; titleEn: string; quote: string };

const ENDINGS = [
  "ыми", "ями", "ами", "ого", "его", "ому", "ему", "ией", "ует", "ете", "ает", "ают", "ишь", "ешь",
  "ов", "ев", "ей", "ем", "ам", "ом", "ах", "ях", "ий", "ый", "ой", "ая", "яя", "ое", "ее", "ие",
  "ые", "ую", "юю", "ою", "ею", "их", "ых", "ут", "ют", "ат", "ят", "ет", "ит", "ть", "ся", "сь",
  "ок", "ек", "а", "я", "о", "е", "и", "ы", "у", "ю", "ь", "й",
];

const STEM_LEN = 6;

function stem(raw: string): string {
  const w = raw.toLowerCase().replace(/ё/g, "е");
  if (/^[a-z]+$/.test(w)) {
    // Английские слова: только множественное число и -ing.
    return w.replace(/(ing|es|s)$/, "") || w;
  }
  let s = w;
  for (const e of ENDINGS) {
    if (s.length - e.length >= 3 && s.endsWith(e)) {
      s = s.slice(0, -e.length);
      break;
    }
  }
  return s.slice(0, STEM_LEN);
}

// Группы синонимов: имя группы и слова (русские и английские).
const GROUPS: Record<string, string> = {
  price:
    "цена цены цену стоимость стоит стоить сколько прайс ценник тариф price prices cost costs much fee fees",
  hygiene: "чистка чистку чистки гигиена гигиены гигиену гигиеническая cleaning clean hygiene scaling",
  hours:
    "часы график режим расписание воскресенье воскресенья выходной выходные выходных суббота субботу понедельник пятница будни ежедневно работа работы работает работаете работаю работаем работать открыты открыто открыта закрыты hours open opened schedule sunday saturday weekend weekends daily",
  contacts:
    "адрес адреса адресу находится находитесь расположена расположены где контакты контакт телефон позвонить связаться метро address location located where phone contact contacts",
  booking: "запись записаться записи запишитесь заявка заявку book booking appointment",
  payment: "рассрочка рассрочку рассрочки кредит кредиты оплата оплатить оплаты installment installments credit loan pay payment",
  tax: "налог налоговый вычет возврат tax deduction refund",
  guarantee: "гарантия гарантии гарантию гарантируете warranty guarantee guarantees guaranteed",
  implant: "имплант импланты имплантов имплантацию имплантация имплантации имплантат implant implants implantation",
  crown: "коронка коронку коронки коронок коронка crown crowns",
  prosthetics: "протез протезы протезов протезирование протезирования мост мосты bridge bridges denture dentures prosthetics prosthesis",
  veneers: "винир виниры виниров veneer veneers",
  treatment: "лечение лечить лечения лечу пломба пломбу пломбы пломбировать treatment treat filling fillings",
  removal: "удаление удаления удалить удалить вырвать вырвать удаляете extraction extract remove removal pull",
  whitening: "отбеливание отбеливания отбелить отбелить whitening bleaching whiten",
  pain: "больно болезненно боль боли боюсь страшно анестезия обезболивание pain painful hurt hurts anesthesia anaesthesia",
  consult: "консультация консультацию диагностика диагностики бесплатная бесплатно free consultation diagnostics diagnostic",
  professional: "профессиональная профессиональный профессиональное профессиональную professional",
  tooth: "зуб зубы зубов зуба зубу tooth teeth dental",
  speed: "быстро срок сроки готовы готов лаборатория days fast quickly lab laboratory",
};

const stemToGroup = new Map<string, string>();
for (const [name, words] of Object.entries(GROUPS)) {
  for (const w of words.split(/\s+/)) {
    const st = stem(w);
    if (!stemToGroup.has(st)) stemToGroup.set(st, name);
  }
}

// Слова-связки: ни баллов, ни веса в доле найденных слов.
const STOP = new Set(
  (
    "что чего как какой какая какие какое каких кто когда ли есть у вас вам вы мы я мне ваш ваша ваши в во на из и а но или по за с со к о об от до для " +
    "можно нужно нужна нужен надо пожалуйста здравствуйте привет добрый день подскажите скажите расскажите хочу хотел хотела узнать это этот эта эти тоже ещё еще же бы не нет да " +
    "the a an is are do does did you your i me my we our of in on for to and or at it be there have has can could would what how which when who please tell about with"
  )
    .split(/\s+/)
    .map(stem)
);

const tokenize = (s: string): string[] => s.toLowerCase().replace(/ё/g, "е").match(/[a-zа-я]+/g) ?? [];

// Слово к виду для сравнения: имя группы или основа.
const norm = (w: string): string => {
  const st = stem(w);
  return stemToGroup.get(st) ?? st;
};

// Индекс фрагментов: слова текста и слова названия раздела.
type Indexed = { chunk: MiaChunk; words: Map<string, number>; title: Set<string> };

const index: Indexed[] = MIA_CHUNKS.map((chunk) => {
  const words = new Map<string, number>();
  for (const w of tokenize(chunk.text + " " + chunk.title.ru).map(norm)) words.set(w, (words.get(w) ?? 0) + 1);
  if (chunk.text.includes("₽")) words.set("price", 1);
  const title = new Set<string>(tokenize(chunk.title.ru).map(norm));
  return { chunk, words, title };
});

const df = new Map<string, number>();
for (const { words } of index) for (const w of words.keys()) df.set(w, (df.get(w) ?? 0) + 1);
const idf = (w: string): number => Math.log(1 + index.length / (df.get(w) ?? 1));

function queryTerms(text: string): { content: string[]; price: boolean } {
  const content = new Set<string>();
  let price = false;
  for (const raw of tokenize(text)) {
    if (STOP.has(stem(raw))) continue;
    const t = norm(raw);
    if (t === "price") price = true;
    else content.add(t);
  }
  return { content: [...content], price };
}

const MAX_RESULTS = 3;
const RELATIVE_CUTOFF = 0.6;
const QUOTE_MAX = 200;

/** Найденные фрагменты, лучший первым. Пустой список: в документе ответа нет. */
export function searchMia(question: string, previousQuestion?: string): MiaChunk[] {
  let { content, price } = queryTerms(question);
  if (content.length < 2 && previousQuestion) {
    const prev = queryTerms(previousQuestion);
    content = [...new Set([...content, ...prev.content])];
    price = price || prev.price;
  }
  if (content.length === 0) return [];

  // Доля значимых слов вопроса, которые есть хоть где-то в документе.
  const known = content.filter((t) => df.has(t)).length;
  if (known / content.length <= 0.5) return [];

  const scored = index
    .map(({ chunk, words, title }) => {
      let score = 0;
      for (const t of content) {
        const tf = words.get(t);
        // Слово, повторённое во фрагменте, весит больше, но не бесконечно.
        if (tf) score += idf(t) * (title.has(t) ? 1.6 : 1) * (1 + 0.25 * Math.min(tf - 1, 4));
      }
      if (score > 0 && price && words.has("price")) score += 0.3;
      return { chunk, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];
  const best = scored[0].score;
  return scored
    .filter((x) => x.score >= best * RELATIVE_CUTOFF)
    .slice(0, MAX_RESULTS)
    .map((x) => x.chunk);
}

/** Цитата до 200 знаков: строки фрагмента, ближе всего к вопросу. */
export function quoteFor(chunk: MiaChunk, question: string): string {
  const terms = new Set(queryTerms(question).content);
  const lines = chunk.text
    .split("\n")
    .map((l) => l.replace(/^- /, "").trim())
    .filter(Boolean);
  // Строка-заголовок («Цены на имплантацию:») цитатой не бывает, если есть другие.
  const body = lines.filter((l) => !l.endsWith(":"));
  const scored = (body.length ? body : lines).map((line, i) => {
    const words = new Set(tokenize(line).map(norm));
    let s = 0;
    for (const t of terms) if (words.has(t)) s++;
    return { line, i, s };
  });
  const best = Math.max(...scored.map((x) => x.s));
  // Строки с лучшим совпадением в порядке документа; без совпадений первая.
  const picked = scored.filter((x) => (best > 0 ? x.s === best : x.i === 0));
  let out = "";
  for (const { line } of picked) {
    const next = out ? `${out} / ${line}` : line;
    if (next.length > QUOTE_MAX) {
      if (!out) out = line.slice(0, QUOTE_MAX - 1).trimEnd() + "…";
      break;
    }
    out = next;
  }
  return out;
}

export function sourcesFor(found: MiaChunk[], question: string): MiaSource[] {
  return found.map((c) => ({
    id: c.id,
    title: c.title.ru,
    titleEn: c.title.en,
    quote: quoteFor(c, question),
  }));
}
