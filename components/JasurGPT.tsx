"use client";

import { useState, useRef, useEffect } from "react";

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
      <button
        onClick={() => setOpen((v) => !v)}
        className="gpt-button fixed bottom-6 right-6 z-50 font-mono text-xs px-4 py-3 bg-[#7C3AED] text-white rounded-lg shadow-lg hover:bg-[#6d28d9] transition-colors flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Ask JasurGPT
      </button>

      {/* Chat modal */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 rounded-xl border border-[#222] bg-[#0d0d0d] shadow-2xl flex flex-col overflow-hidden fade-up">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center font-mono text-xs font-bold">
                J
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-white">JasurGPT</p>
                <p className="font-mono text-[10px] text-white/30">knows my full context</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/30 hover:text-white transition-colors font-mono text-xs"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 chat-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="font-mono text-[11px] text-white/25 mb-5">
                  Ask me about Jasur&apos;s experience, projects, or skills.
                </p>
                <div className="flex flex-col gap-2 w-full">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="font-mono text-[10px] px-3 py-2 border border-[#1f1f1f] text-white/40 hover:border-[#7C3AED]/40 hover:text-white/70 transition-colors rounded text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2.5 rounded-lg text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#7C3AED] text-white font-sans"
                      : "bg-[#161616] text-white/70 font-mono border border-[#1f1f1f]"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#161616] border border-[#1f1f1f] px-3 py-2.5 rounded-lg">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-[#a78bfa] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#1a1a1a]">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-[#111] border border-[#222] rounded px-3 py-2 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#7C3AED] transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-3 py-2 bg-[#7C3AED] text-white rounded font-mono text-xs hover:bg-[#6d28d9] disabled:opacity-30 transition-colors"
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
