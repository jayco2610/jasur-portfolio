// Генерация текста для демо (app/api/demo и lib/demo-company.ts).
//
// Тонкая обёртка над общим модулем lib/ai.ts: Groq, если задан ключ, потом
// бесплатные модели OpenRouter. Сигнатура generate() прежняя, чтобы
// маршрут демо и демо для компаний не пришлось менять: строка или null.

import { complete, type AiMessage } from "@/lib/ai";

export type LlmMessage = AiMessage;

export type GenerateOpts = {
  maxTokens?: number;
  temperature?: number;
  title?: string;
  // Reject bad outputs (wrong language, leaked reasoning, over-length) and
  // move on to the next model.
  validate?: (s: string) => boolean;
};

export async function generate(messages: LlmMessage[], opts?: GenerateOpts): Promise<string | null> {
  const res = await complete(messages, {
    maxTokens: opts?.maxTokens,
    temperature: opts?.temperature,
    title: opts?.title ?? "Jasur Portfolio Demo",
    validate: opts?.validate,
    unquote: true,
    tag: "demo",
  });
  return res.ok ? res.text : null;
}
