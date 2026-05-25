"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getCookieSession(): { name?: string; token?: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find(c => c.startsWith("shambaiq_session="));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))); }
  catch { return null; }
}

const QUICK_LINKS = [
  { href: "/app", label: "Farm Plan" },
  { href: "/doctor", label: "Plant Doctor" },
  { href: "/agronomy", label: "Ask Agronomist" },
  { href: "/yields", label: "My Yields" },
];

export default function PersonalizedBanner() {
  const [session, setSession] = useState<{ name?: string; token?: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getCookieSession());
    setReady(true);
  }, []);

  if (!ready || !session?.token) return null;

  const name = session.name?.split(" ")[0] || "Farmer";

  return (
    <div className="bg-forest-900 border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white leading-none">{name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-cream-100 font-semibold text-sm leading-tight">
              {getGreeting()}, {name} 🌱
            </p>
            <p className="text-cream-400 text-xs leading-none mt-0.5">Welcome back to your farm dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-cream-300 hover:text-gold-300 hover:bg-cream-200/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/profile"
            className="ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gold-400 border border-gold-400/30 hover:border-gold-400/60 hover:bg-gold-400/10 transition-colors flex items-center gap-1"
          >
            My Profile <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
