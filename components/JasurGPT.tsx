"use client";

import { useState, useRef, useEffect } from "react";
import BlockedBadge from "@/components/BlockedBadge";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's your PM experience?",
  "Tell me about the AI career system",
  "What projects have you shipped?",
  "Are you open to work?",
];

export default function JasurGPT() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content || "No response." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen((v) => !v)} className="ask-btn">
        <i />
        Ask JasurGPT
      </button>

      {/* Chat modal */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 border border-ink bg-paper shadow-2xl flex flex-col overflow-hidden fade-up">
          {/* Header */}
          <div className="px-4 py-3 border-b border-ink flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-bold">J</div>
              <div>
                <p className="text-xs font-bold">JasurGPT</p>
                <p className="tiny !text-[9px]">answers about Jasur</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-dim hover:text-ink transition-colors text-xs">
              ✕
            </button>
          </div>

          {/* Messages */}
          {/* Clarity пишет видеозапись сессии. Без этой пометки в записи
              видно, что незнакомые люди писали в чат. */}
          <div
            className="h-72 overflow-y-auto p-4 space-y-3 chat-scrollbar"
            data-clarity-mask="true"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="tiny !text-[11px] mb-5">Ask me about Jasur&apos;s experience, projects, or skills.</p>
                <div className="flex flex-col gap-2 w-full">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="demo-chip text-left">
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-5">
                  <BlockedBadge />
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2.5 text-xs leading-relaxed ${
                      msg.role === "user" ? "bg-ink text-paper" : "border border-rule text-dim"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="border border-rule px-3 py-2.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-ink animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-ink">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-paper border border-rule px-3 py-2 text-xs placeholder:text-faint focus:outline-none focus:border-ink transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-3 py-2 bg-ink text-paper text-xs hover:opacity-80 disabled:opacity-30 transition-opacity"
              >
                →
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
