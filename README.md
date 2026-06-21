# Jasur Akhmadaliev — Portfolio + JasurGPT

Live: [jasur-portfolio-pied.vercel.app](https://jasur-portfolio-pied.vercel.app)

Personal portfolio site with an AI assistant (JasurGPT) trained on my full professional context — resume, projects, experience, and skills.

Built solo from scratch using vibe coding (Cursor + Claude).

---

## What's inside

**Portfolio pages**
- `/` — Full-screen hero with typewriter animation, projects overview, about
- `/projects` — All shipped projects with live links and tech stacks
- `/resume` — Full resume in EN + RU PDF download, all sections: experience, projects, certifications, content & publications, skills
- `/services` — Services with pricing (AI automation, Fractional PM, Content Factory)
- `/writing` — Upcoming articles and content channels

**JasurGPT** — AI chat in the bottom-right corner
- Grounded on: full resume, work history, projects, skills, services
- Model chain: Llama 3.3 70B → gpt-oss-120b → Gemma 4 31B → Qwen3-next 80B (OpenRouter free tier)
- Cost: $0/month
- Knows to answer in Russian or English depending on the question
- Hardened against prompt injection (see Security below)

**Animations**
- Typewriter effect on hero: title → bio → buttons appear sequentially
- Nav links cycle through a purple glow one by one (continuous loop)
- JasurGPT button slides in with spring easing after content loads

---

## Stack

- **Framework**: Next.js 15 (App Router), TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: OpenRouter API — 4-model free fallback chain
- **Deployment**: Vercel
- **Font**: Space Mono + Inter

---

## Security

The AI assistant is a public, anonymous endpoint, so it is treated as untrusted input by default.

- **No secrets exposed** — the OpenRouter API key lives only in server-side environment variables. It is never shipped to the browser, and `.env*` is git-ignored.
- **Prompt-injection resistance** — the system prompt is a strict allowlist: JasurGPT answers only about Jasur's professional background and refuses everything else with a single fixed reply. It will not reveal its own instructions, change role, or follow commands embedded in user messages.
- **Deterministic input filter** — common extraction and jailbreak phrases (EN + RU) are blocked server-side before they ever reach the model, so a weak free-tier model can't be talked into leaking.
- **Abuse limits** — per-IP rate limiting (15 req/min) plus hard caps on message length (1000 chars) and conversation length (16 messages).
- **No sensitive data in context** — the assistant's knowledge is limited to information already published on this site; there is nothing private to leak.
- **HTTP security headers** — HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a restrictive `Permissions-Policy` (see `next.config.ts`).

No system is unbreakable, but the layers above remove the realistic attack surface for a portfolio chatbot: secret leakage, prompt extraction, role hijacking, and free-tier abuse.

---

## Projects showcased

| Project | Status | Stack |
|---|---|---|
| Expat Networking Platform | Live | Next.js, Supabase, Telegram |
| AI Career System | Live | Claude API, n8n, Google Sheets, Telegram |
| Portfolio + JasurGPT | This site | Next.js, OpenRouter, Vercel |
| Claude + Whisper Voice Pipeline | Shipped | Whisper API, Claude API, Telegram |
| AI Agent for ABC/XYZ Analysis | In progress | Claude API, n8n, Google Sheets |

---

## Run locally

```bash
npm install
npm run dev
```

Add `.env.local`:
```
OPENROUTER_API_KEY=your_key_here
```

---

## Author

Jasur Akhmadaliev — AI Product Manager  
[LinkedIn](https://www.linkedin.com/in/jasur-akhmadaliev) · [Telegram @pmvision_ai](https://t.me/pmvision_ai) · [jasur-portfolio-pied.vercel.app](https://jasur-portfolio-pied.vercel.app)
