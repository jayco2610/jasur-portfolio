// OpenRouter completion with a fallback chain of free models.
// Same call pattern as app/api/chat/route.ts.

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-4-31b-it:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
];

export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

export async function generate(
  messages: LlmMessage[],
  opts?: { maxTokens?: number; temperature?: number; title?: string }
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

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
      if (!res.ok) continue;
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) return content.trim();
    } catch {
      // try next model
    }
  }
  return null;
}
