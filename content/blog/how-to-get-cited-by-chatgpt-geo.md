---
title: "How to get cited by ChatGPT and Google AI: GEO in 2026"
date: "2026-09-17"
description: "What actually gets a site into ChatGPT, Perplexity and Google AI answers: the GEO study, Ahrefs and SE Ranking data, and what Google and Yandex say."
lang: "en"
rubric: "ai"
tags: ["AI", "GEO", "SEO"]
translation: "kak-popast-v-otvety-chatgpt-i-alisy"
draft: false
---

**Short answer: there is no magic. AI assistants cite pages that already rank well, are fresh, and carry numbers, sources and quotes. In the GEO study those three moves raised visibility in answers by up to 40%, while keyword stuffing made things worse.**

In brief:

- GEO is SEO with one extra question: will an AI cite you when it answers for you.
- Sources, quotes and statistics in the text work best.
- The same moves sometimes hurt pages ranked first, and roughly double the gain for pages ranked fifth.
- llms.txt and FAQ markup do not help you get cited. This has been checked.

## What GEO is and why it matters

A person used to see ten links and choose. Now ChatGPT, Perplexity or Google answer right away and put three or four sources under the answer. The other sites are simply not seen.

Generative Engine Optimization, GEO, is the work of getting into those three or four. The term comes from [a study by Princeton and co-authors](https://arxiv.org/abs/2311.09735) published in November 2023 and accepted at KDD in 2024.

Google says plainly in [its guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) that GEO for its search is "still SEO". There are no separate requirements. Worth remembering before someone sells you a "GEO course".

## What the study found

The authors took thousands of queries and rewrote pages in different ways. Then they measured how often and how prominently the AI cited each page. The baseline with no changes was 19.5.

| Method | Score | Versus baseline |
|---|---|---|
| Add quotations | 27.8 | better |
| Add statistics | 25.9 | better |
| Improve fluency | 25.1 | better |
| Cite sources | 24.9 | better |
| Authoritative tone | 21.8 | barely different |
| Keyword stuffing | 17.8 | **worse** |

Source: [Aggarwal et al., GEO, arXiv 2311.09735](https://arxiv.org/html/2311.09735v3).

![What lifts a page in AI answers. Quotations, statistics, fluency and sources beat the baseline, keyword stuffing falls below it](/blog/geo-methods-en.png)

The interesting part is not the table but the page's position. Pages ranked fifth gained 115% from citing sources and 100% from quotes. Pages ranked first **lost** 20 to 30% from the very same edits.

The meaning is simple. If the AI already picks you, don't rewrite the text to follow a trend. If you sit mid-page, numbers and links give you a real chance to climb.

On live Perplexity the effect was smaller: quotes added 22%, keywords took away 10%. The lab is always more generous than real life.

## Who AI actually cites

Google results and AI answers overlap less than you would think.

- Only 6 to 8% of the links in ChatGPT answers rank in Google's top 10. For Perplexity it is 28.6% ([Ahrefs, August 2025](https://ahrefs.com/blog/ai-search-overlap/)).
- In Google AI Overviews 38% of links come from the top 10, and another 31% from beyond the first hundred ([Ahrefs, March 2026](https://ahrefs.com/blog/ai-overview-citations-top-10/)).
- ChatGPT cites Wikipedia most, Perplexity cites Reddit most ([Profound, June 2025](https://www.tryprofound.com/blog/ai-platform-citation-patterns)).

[SE Ranking](https://seranking.com/blog/how-to-optimize-for-chatgpt/) looked at which pages ChatGPT cites across 216,000 pages:

| Page trait | Average citations | Without it |
|---|---|---|
| Updated in the last 3 months | 6.0 | 3.6 |
| 19 or more numbers in the text | 5.4 | 2.8 |
| Sections of 120 to 180 words | 4.6 | 2.7 |
| Expert quotes | 4.1 | 2.4 |

The strongest link to citations is the number of sites linking to yours. Good old authority, nothing new.

An important caveat: these are correlations. Fresh pages full of numbers may be cited more simply because strong editorial teams write them. The researchers point this out themselves.

## How much traffic it brings

Less than the headlines say, and more than a year ago.

- AI assistants bring sites about 0.1% of visits. Google sends 345 times more than ChatGPT, Gemini and Perplexity combined ([Ahrefs, March 2025](https://ahrefs.com/blog/ai-traffic-research/)).
- When Google shows an AI summary, people click a link in 8% of visits, without it in 15% ([Pew Research, July 2025](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)).
- The first position under an AI summary lost 58% of clicks compared with 2023 ([Ahrefs, February 2026](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/)).
- But if the summary cites your site, you get 120% more clicks per impression than those it leaves out ([Seer Interactive, April 2026](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update)).

The unpleasant conclusion: AI answers take clicks from everyone. Getting cited does not mean winning, it means losing less than the rest.

## Yandex and Alice

Yandex is simpler, it said everything outright.

Alice AI takes answers from pages that [rank high in Search](https://yandex.ru/support/webmaster/ru/service/alice-answers) for the main query and related topics. Yandex's requirements are expertise, usefulness, originality and substance. Alice's quick answers reach 46.5 million people a month ([Yandex, April 2026](https://yandex.ru/company/news/07-04-2026-01)).

Yandex Webmaster now has a report on site visibility in Alice AI. It does not affect rankings, but it shows whether the assistant cites you.

You can opt out of answers with `User-agent: YandexAdditional` and `Disallow` in robots.txt. Why you would do that is another question.

## What does not work

- **llms.txt.** Google [states directly](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) that it does not use it. SE Ranking checked 300,000 domains and [found no link to citations](https://seranking.com/blog/llms-txt/).
- **FAQ markup.** Pages with it were cited even less often: 3.6 versus 4.2.
- **Keywords.** In the GEO study this was the only method that scored below the baseline.
- **Authoritative tone.** Helps in history and science, barely anywhere else.
- **Chopping text into tiny chunks.** Google asks you not to.

## What to do

1. **Plain SEO first.** Yandex takes sources from the top of results, Google says GEO is SEO. Without rankings nothing else works.
2. **Answer in the first paragraph.** One sentence with a number or a definition.
3. **Numbers with a source and a date.** Not for show, but because it is the best method in the study.
4. **Quotes from people who know the subject.** With name and role.
5. **Sections of 120 to 180 words** with clear question headings.
6. **Update the page at least once a quarter.** Fresh pages are cited almost twice as often.
7. **Do not block the bots.** OAI-SearchBot is needed to appear in ChatGPT search ([OpenAI](https://developers.openai.com/api/docs/bots)), PerplexityBot for Perplexity.
8. **Check.** In Yandex Webmaster use the Alice report, elsewhere ask the AI your own question and see who it cites.

## What this means for a small site

GEO gives big sites almost nothing: they are cited already. For a small site it opens a chance that ordinary search results never gave. The AI does not have to put first whoever is first in Google. It picks whoever has a clear answer, fresh numbers and links.

This text follows the same rules. In three months I will check whether anyone cites it and write about what happened.

## Sources

- Aggarwal P. et al. GEO: Generative Engine Optimization. arXiv 2311.09735, KDD 2024.
- Ahrefs: AI Search Overlap (08.2025), AI Overview Citations (03.2026), AI Overviews Reduce Clicks (04.2025, 02.2026), AI Traffic Research (03.2025).
- Profound: AI Platform Citation Patterns (06.2025).
- SE Ranking: How to Optimize for ChatGPT (11.2025), llms.txt study (11.2025).
- Pew Research Center (07.2025).
- Seer Interactive (04.2026).
- Google Search Central: AI features, AI optimization guide (07.2026).
- Yandex Webmaster: Alice AI answers, blog (04.2026).
- OpenAI: Overview of OpenAI Crawlers.
