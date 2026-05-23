"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Leaf, RotateCcw, Lock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "My maize leaves are turning yellow in Nakuru — what's wrong?",
  "What fertilizer should I use for beans in Kisii County?",
  "How do I treat grey leaf spot on maize?",
  "Mbegu gani bora ya mahindi kwa Rift Valley?",
  "My soil pH is 4.8 — how do I fix it before planting?",
  "What crops grow best in Makueni County?",
];

function getCookieSession(): { token?: string; name?: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find(c => c.startsWith("shambaiq_session="));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))); }
  catch { return null; }
}

export default function AgronomyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null); // null = checking
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const session = getCookieSession();
    setLoggedIn(!!session?.token);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.status === 401) {
        setLoggedIn(false);
        setMessages(prev => prev.slice(0, -1)); // remove the user message
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        const err = await res.json().catch(() => ({}));
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `⚠️ ${err.error || "Could not get a response. Please try again."}`,
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Network error — please check your connection and try again.",
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const reset = () => {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  // Checking session
  if (loggedIn === null) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-cream-100">
        <Loader2 size={24} className="animate-spin text-forest-600" />
      </div>
    );
  }

  // Not logged in — show gate
  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-cream-100 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-forest-700 flex items-center justify-center mb-4">
          <Lock size={28} className="text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-forest-700 mb-2">Login Required</h2>
        <p className="text-soil-400 text-sm max-w-xs mb-6">
          Shamba Mshauri is available to registered farmers. Create a free account to get personalized agronomic advice.
        </p>
        <div className="flex gap-3">
          <Link href="/profile"
            className="px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl transition-colors text-sm">
            Log In / Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-cream-100 relative" style={{ height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 text-white flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #11472a, #16a34a)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Leaf size={20} className="text-gold-300" />
          <div>
            <p className="text-xs text-green-200 leading-none">ShambaIQ</p>
            <h1 className="font-bold text-sm leading-tight">
              Shamba Mshauri
              <span className="font-normal text-green-200 ml-1">
                — AI Agronomist
              </span>
            </h1>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-200 hidden sm:block">
            🇰🇪 Kenya-specific advice
          </span>
          {messages.length > 0 && (
            <button
              onClick={reset}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="New conversation"
            >
              <RotateCcw size={16} className="text-green-200" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #11472a, #16a34a)" }}
            >
              <Bot size={32} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-forest-700 mb-1">
                Shamba Mshauri
              </h2>
              <p className="text-soil-400 text-sm max-w-xs">
                Your AI agronomist for all 47 Kenyan counties. Ask anything about
                crops, soil, fertilizers, or pests — in English or Kiswahili.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="text-left text-xs px-3 py-2.5 bg-white border border-cream-300 hover:border-gold-400 hover:bg-gold-50 text-forest-700 rounded-xl transition-all leading-relaxed"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-gold-500"
                    : "bg-forest-700"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={14} className="text-white" />
                ) : (
                  <Bot size={14} className="text-white" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-forest-700 text-white rounded-tr-sm whitespace-pre-wrap"
                    : "bg-white border border-cream-300 text-forest-800 rounded-tl-sm"
                }`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    components={{
                      strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="font-bold text-base mt-4 mb-2" {...props} />,
                      h4: ({ node, ...props }) => <h4 className="font-bold mt-3 mb-1" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading bubble */}
        {loading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white border border-cream-300 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-forest-600" />
              <span className="text-sm text-soil-400">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-white border-t border-cream-300 px-4 py-3">
        <div className="flex items-end gap-2 max-w-2xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crops, soil, pests, fertilizers... (Enter to send)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-cream-300 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 px-4 py-3 text-sm text-forest-800 placeholder:text-soil-300 outline-none transition-colors"
            style={{ maxHeight: "120px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="p-3 rounded-xl text-white transition-all disabled:opacity-40 flex-shrink-0"
            style={{ background: "#11472a" }}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-soil-300 mt-2">
          Powered by Gemini AI · Always verify with your local extension officer
        </p>
      </div>
    </div>
  );
}
