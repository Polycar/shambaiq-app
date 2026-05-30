"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Check, Clipboard, Code } from "lucide-react";

export default function SoilEmbedCard({ countyName, countySlug }: { countyName: string; countySlug: string }) {
  const [copied, setCopied] = useState(false);

  const embedCode = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.shambaiq.com";
    return `<iframe src="${origin}/embed/county/${countySlug}" width="100%" height="320" style="border:none;border-radius:16px;box-shadow:0 4px 16px rgba(0, 0, 0, 0.05);background:#FAF8F5;" title="${countyName} County Soil Health Report by ShambaIQ"></iframe>`;
  }, [countySlug, countyName]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy widget code: ", err);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-forest-700 leading-tight">
            Embed {countyName} Soil Data on Your Website
          </h2>
          <p className="text-sm text-soil-400 mt-1 max-w-xl">
            Are you a local blogger, news agency, or county advisor? You can embed this live, 30m resolution soil suitability report card on your website for free.
          </p>
        </div>
        <Link
          href="/embed"
          className="text-xs bg-forest-700/5 hover:bg-forest-700/10 text-forest-700 font-extrabold px-4 py-2 rounded-xl transition-colors border border-forest-700/10 shrink-0"
        >
          Customize Widget →
        </Link>
      </div>

      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Copy-paste display */}
        <div className="w-full flex-1 relative">
          <code className="block bg-forest-950 text-gold-300 rounded-xl p-3.5 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all pr-12 leading-relaxed">
            {embedCode}
          </code>
          <button
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-cream-200 hover:text-white transition-all shadow border border-forest-700/50"
            aria-label="Copy widget embed code"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Clipboard size={14} />}
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow shrink-0"
        >
          {copied ? (
            <>
              <Check size={16} /> Copied!
            </>
          ) : (
            <>
              <Clipboard size={16} /> Copy Embed Code
            </>
          )}
        </button>
      </div>
    </section>
  );
}
