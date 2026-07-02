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

export async function generate(
  messages: LlmMessage[],
  opts?: { maxTokens?: number; temperature?: number; title?: string }
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  for (let pass = 0; pass < PASSES; pass++) {
    if (pass > 0) await new Promise((r) => setTimeout(r, 800));
    const content = await tryChain(apiKey, messages, opts);
    if (content) return content;
  }
  return null;
}

async function tryChain(
  apiKey: string,
  messages: LlmMessage[],
  opts?: { maxTokens?: number; temperature?: number; title?: string }
): Promise<string | null> {
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
      if (typeof content === "string" && content.trim()) return content.trim();
      console.warn(`[llm] ${model} empty content: ${JSON.stringify(data).slice(0, 300)}`);
    } catch (e) {
      console.warn(`[llm] ${model} threw: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return null;
}
