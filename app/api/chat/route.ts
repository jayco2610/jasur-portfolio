import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const JASUR_CONTEXT = readFileSync(
  join(process.cwd(), "data/jasur-context.md"),
  "utf-8"
);

const SYSTEM_PROMPT = `${JASUR_CONTEXT}

You are JasurGPT. Answer questions about Jasur Akhmadaliev concisely and honestly.
Never invent experience or projects not listed above.
Respond in the same language the user writes in (Russian or English).`;

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: Message[] };

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { content: "JasurGPT is not configured yet. API key missing." },
      { status: 200 }
    );
  }

  const body = {
    model: "google/gemma-4-31b-it:free",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
    max_tokens: 512,
    temperature: 0.7,
  };

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://jasur-portfolio.vercel.app",
      "X-Title": "JasurGPT",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("OpenRouter error:", err);
    return NextResponse.json(
      { content: "Error reaching AI. Try again later." },
      { status: 200 }
    );
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "No response.";

  return NextResponse.json({ content });
}
