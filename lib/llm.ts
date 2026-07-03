// OpenRouter completion with a fallback chain of free models.
// Same call pattern as app/api/chat/route.ts.

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-4-31b-it:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
];

const PASSES = 2; // free models are flaky; run the chain twice before giving up

export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

export type GenerateOpts = {
  maxTokens?: number;
  temperature?: number;
  title?: string;
  // Reject bad outputs (wrong language, leaked reasoning, over-length) and
  // move on to the next model in the chain.
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

  for (let pass = 0; pass < PASSES; pass++) {
    if (pass > 0) await new Promise((r) => setTimeout(r, 800));
    const content = await tryChain(apiKey, messages, opts);
    if (content) return content;
  }
  return null;
}

async function tryChain(apiKey: string, messages: LlmMessage[], opts?: GenerateOpts): Promise<string | null> {
  for (const model of FREE_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
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
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn(`[llm] ${model} HTTP ${res.status}: ${JSON.stringify(data?.error ?? data).slice(0, 300)}`);
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
    }
  }
  return null;
}
