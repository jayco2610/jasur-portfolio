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
- Trained on: full resume, work history, projects, skills, services
- Model chain: Gemma 4 → Llama 3.3 → Qwen 2.5 → Mistral 7B (OpenRouter free tier)
- Cost: $0/month
- Knows to answer in Russian or English depending on the question

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
