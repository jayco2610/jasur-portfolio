// OpenRouter completion for the demos, on free models.
//
// The list of free models is taken from OpenRouter itself (cached for an hour),
// the same way app/api/chat/route.ts does it. A hardcoded list rots: free
// models disappear within weeks, and every attempt on a dead or overloaded
// model burns the shared daily allowance. An account that has never bought
// credits gets 50 free-model requests a day, shared by the chat and all demos.
//
// So: ask live models one at a time, stop at the first good answer, and give
// up when the time budget runs out instead of walking a long chain twice.

const PREFERRED = [/gemma-4-26b/, /gemma-4-31b/, /glm-5/, /nemotron-3-super-120b/, /llama.*70b/, /qwen.*(72b|80b|235b)/];
const SKIP = /safety|code|coder|vision|audio|embed|guard|nano|lightning/i;
const FALLBACK = ["google/gemma-4-31b-it:free", "meta-llama/llama-3.3-70b-instruct:free"];
const MAX_MODELS = 5;
const MODEL_TIMEOUT_MS = 18_000;
const TOTAL_BUDGET_MS = 45_000;

let modelCache: { at: number; ids: string[] } | null = null;

async function freeModels(): Promise<string[]> {
  if (modelCache && Date.now() - modelCache.at < 3_600_000) return modelCache.ids;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", { cache: "no-store" });
    const data = await res.json();
    const all: { id: string; context_length?: number }[] = Array.isArray(data?.data) ? data.data : [];
    const free = all
      .filter((m) => m.id.endsWith(":free") && !SKIP.test(m.id) && (m.context_length ?? 0) >= 16000)
      .map((m) => m.id);
    const ranked = [...PREFERRED.flatMap((re) => free.filter((id) => re.test(id))), ...free]
      .filter((id, i, arr) => arr.indexOf(id) === i)
      .slice(0, MAX_MODELS);
    if (ranked.length) {
      modelCache = { at: Date.now(), ids: ranked };
      return ranked;
    }
  } catch {
    // fall through to the fallback list
  }
  return FALLBACK;
}

export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

export type GenerateOpts = {
  maxTokens?: number;
  temperature?: number;
  title?: string;
  // Reject bad outputs (wrong language, leaked reasoning, over-length) and
  // move on to the next model.
  validate?: (s: string) => boolean;
};

// Reasoning models sometimes dump their chain of thought into content.
// Strip the marked blocks and unwrap quotes; validate() catches the rest.
function cleanContent(raw: string): string {
  return raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "")
    .trim()
    .replace(/^["'«»""]+|["'«»""]+$/g, "")
    .trim();
}

export async function generate(messages: LlmMessage[], opts?: GenerateOpts): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const started = Date.now();
  for (const model of await freeModels()) {
    const left = TOTAL_BUDGET_MS - (Date.now() - started);
    if (left < 3_000) break;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), Math.min(MODEL_TIMEOUT_MS, left));
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: ctl.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://jasur-portfolio-pied.vercel.app",
          "X-Title": opts?.title ?? "Jasur Portfolio Demo",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: opts?.maxTokens ?? 512,
          temperature: opts?.temperature ?? 0.7,
          // Free models are mostly reasoning models now: without this they can
          // spend the whole token budget thinking and return empty content.
          reasoning: { effort: "low", exclude: true },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn(`[llm] ${model} HTTP ${res.status}: ${JSON.stringify(data?.error ?? data).slice(0, 300)}`);
        // The daily allowance is gone for the whole account: other models will
        // say the same, stop instead of burning time.
        if (res.status === 429 && /per-?day|daily/i.test(JSON.stringify(data))) break;
        continue;
      }
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) {
        const clean = cleanContent(content);
        if (clean && (!opts?.validate || opts.validate(clean))) return clean;
        console.warn(`[llm] ${model} rejected output: ${clean.slice(0, 150)}`);
        continue;
      }
      console.warn(`[llm] ${model} empty content: ${JSON.stringify(data).slice(0, 300)}`);
    } catch (e) {
      console.warn(`[llm] ${model} threw: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}
