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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { content: "JasurGPT is not configured yet. API key missing." },
      { status: 200 }
    );
  }

  const geminiMessages = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: geminiMessages,
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.7,
    },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini error:", err);
    return NextResponse.json(
      { content: "Error reaching Gemini. Try again later." },
      { status: 200 }
    );
  }

  const data = await res.json();
  const content =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response.";

  return NextResponse.json({ content });
}
