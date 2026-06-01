"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Leaf, RotateCcw, Lock, ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationSummary {
  id: string;
  title: string;
  updated_at: string | null;
}

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

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

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AgronomyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const session = getCookieSession();
    setLoggedIn(!!session?.token);
    if (session?.token) {
      loadConversations(session.token);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function loadConversations(token: string) {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/v1/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations ?? []);
      }
    } catch { /* ignore */ }
    finally { setHistoryLoading(false); }
  }

  async function loadConversation(id: string) {
    const session = getCookieSession();
    if (!session?.token) return;
    try {
      const res = await fetch(`${BACKEND}/api/v1/chat/conversations/${id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })));
        setConversationId(id);
        setShowHistory(false);
      }
    } catch { /* ignore */ }
  }

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const session = getCookieSession();
    if (!session?.token) return;
    try {
      await fetch(`${BACKEND}/api/v1/chat/conversations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.token}` },
      });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (conversationId === id) reset();
    } catch { /* ignore */ }
  }

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
        body: JSON.stringify({ messages: newMessages, conversation_id: conversationId }),
      });

      if (res.status === 401) {
        setLoggedIn(false);
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        if (data.conversation_id && data.conversation_id !== conversationId) {
          setConversationId(data.conversation_id);
          // Refresh sidebar conversation list
          const session = getCookieSession();
          if (session?.token) loadConversations(session.token);
        }
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
    setConversationId(null);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  if (loggedIn === null) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-cream-100">
        <Loader2 size={24} className="animate-spin text-forest-600" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-cream-100 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-forest-700 flex items-center justify-center mb-4">
          <Lock size={28} className="text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-forest-700 mb-2">Login Required</h2>
        <p className="text-soil-500 text-sm max-w-xs mb-6">
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
              <span className="font-normal text-green-200 ml-1">— AI Agronomist</span>
            </h1>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-200 hidden sm:block">🇰🇪 Kenya-specific advice</span>
          <button
            onClick={() => setShowHistory(v => !v)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            title="Chat history"
          >
            <Clock size={16} className="text-green-200" />
          </button>
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

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (desktop always visible / mobile: showHistory toggle) */}
        <aside className={`
          ${showHistory ? "flex" : "hidden"} lg:flex
          flex-col w-64 xl:w-72 flex-shrink-0 bg-white border-r border-cream-300 overflow-y-auto
        `}>
          {/* Mobile back button */}
          <div className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-cream-200">
            <button onClick={() => setShowHistory(false)} className="p-1 rounded hover:bg-cream-100">
              <ChevronLeft size={18} className="text-forest-700" />
            </button>
            <span className="text-sm font-bold text-forest-700">Chat History</span>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #11472a, #16a34a)" }}
                >
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-700">Shamba Mshauri</p>
                  <p className="text-[10px] text-soil-500">AI Agronomist</p>
                </div>
              </div>
              <button
                onClick={reset}
                title="New conversation"
                className="w-7 h-7 rounded-lg bg-cream-100 hover:bg-cream-200 flex items-center justify-center transition-colors"
              >
                <RotateCcw size={13} className="text-forest-600" />
              </button>
            </div>

            {/* Starter prompts when no conversation active */}
            {messages.length === 0 && conversations.length === 0 && (
              <>
                <p className="text-xs text-soil-500 mb-3 leading-relaxed">
                  Ask anything about crops, soil, fertilizers, or pests — in English or Kiswahili.
                </p>
                <p className="text-[10px] font-bold text-soil-500 uppercase tracking-widest mb-2">Try asking</p>
                <div className="space-y-1.5">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => { setShowHistory(false); send(prompt); }}
                      className="w-full text-left text-xs px-3 py-2.5 bg-cream-50 border border-cream-200 hover:border-gold-400 hover:bg-gold-50 text-forest-700 rounded-xl transition-all leading-relaxed"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Past conversations */}
            {conversations.length > 0 && (
              <>
                <p className="text-[10px] font-bold text-soil-500 uppercase tracking-widest mb-2 mt-1">Recent chats</p>
                {historyLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 size={16} className="animate-spin text-forest-600" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map(c => (
                      <button
                        key={c.id}
                        onClick={() => loadConversation(c.id)}
                        className={`group w-full text-left px-3 py-2.5 rounded-xl border transition-all text-xs leading-snug ${
                          conversationId === c.id
                            ? "border-gold-400 bg-gold-50 text-forest-700"
                            : "border-cream-200 bg-cream-50 hover:border-gold-300 hover:bg-gold-50 text-forest-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="line-clamp-2 flex-1">{c.title}</span>
                          <button
                            onClick={(e) => deleteConversation(c.id, e)}
                            className="opacity-0 group-hover:opacity-100 text-soil-300 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                        <span className="text-soil-300 text-[10px] mt-0.5 block">
                          {relativeTime(c.updated_at)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {messages.length === 0 && (
                  <>
                    <div className="my-3 border-t border-cream-200" />
                    <p className="text-[10px] font-bold text-soil-500 uppercase tracking-widest mb-2">Try asking</p>
                    <div className="space-y-1.5">
                      {STARTER_PROMPTS.slice(0, 3).map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => { setShowHistory(false); send(prompt); }}
                          className="w-full text-left text-xs px-3 py-2.5 bg-cream-50 border border-cream-200 hover:border-gold-400 hover:bg-gold-50 text-forest-700 rounded-xl transition-all leading-relaxed"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Main chat area */}
        <div className={`flex flex-col flex-1 overflow-hidden ${showHistory ? "hidden lg:flex" : "flex"}`}>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg lg:hidden"
                  style={{ background: "linear-gradient(135deg, #11472a, #16a34a)" }}
                >
                  <Bot size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-forest-700 mb-1">Shamba Mshauri</h2>
                  <p className="text-soil-500 text-sm max-w-xs">
                    Your AI agronomist for all 47 Kenyan counties. Ask anything about crops, soil, fertilizers, or pests — in English or Kiswahili.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg lg:hidden">
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
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user" ? "bg-gold-500" : "bg-forest-700"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[60%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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

            {loading && (
              <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white border border-cream-300 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-forest-600" />
                  <span className="text-sm text-soil-500">Analyzing...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 bg-white border-t border-cream-300 px-4 py-3">
            <div className="flex items-end gap-2 max-w-3xl mx-auto">
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
                  requestAnimationFrame(() => {
                    el.style.height = "auto";
                    el.style.height = Math.min(el.scrollHeight, 120) + "px";
                  });
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

      </div>
    </div>
  );
}
