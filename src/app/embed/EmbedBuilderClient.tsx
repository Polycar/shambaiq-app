"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowLeft, Check, Clipboard, Code, Eye, RefreshCw, Settings } from "lucide-react";

interface CountyItem {
  county: string;
  slug: string;
}

export default function EmbedBuilderClient({ counties }: { counties: CountyItem[] }) {
  const [selectedSlug, setSelectedSlug] = useState(counties[0]?.slug || "kakamega");
  const [copied, setCopied] = useState(false);

  const selectedCountyName = useMemo(() => {
    return counties.find((c) => c.slug === selectedSlug)?.county || "";
  }, [selectedSlug, counties]);

  // Generates clean dynamic iframe HTML code
  const embedCode = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.shambaiq.com";
    return `<iframe src="${origin}/embed/county/${selectedSlug}" width="100%" height="320" style="border:none;border-radius:16px;box-shadow:0 4px 16px rgba(0, 0, 0, 0.05);background:#FAF8F5;" title="${selectedCountyName} County Soil Health Report by ShambaIQ"></iframe>`;
  }, [selectedSlug, selectedCountyName]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy embed code: ", err);
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Soil Reports", href: "/soil" },
          { label: "Soil Widget Embed Builder" },
        ]}
      />

      {/* Header */}
      <div className="mb-10 md:mb-12">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-forest-700 mb-3 leading-tight">
          Soil Health Widget Embed Builder
        </h1>
        <p className="text-soil-400 max-w-2xl text-lg leading-relaxed">
          Create dynamic, hyper-local soil reports to share on your agriculture website or blog. 
          Select a county, customize it, and copy the responsive iframe snippet below.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left customization column - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4 flex items-center gap-2">
              <Settings size={18} className="text-gold-500" />
              Configure Widget
            </h2>

            {/* Select County */}
            <div className="mb-6">
              <label htmlFor="county-select" className="block text-xs font-bold uppercase tracking-wider text-forest-600 mb-2">
                Choose County
              </label>
              <select
                id="county-select"
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="w-full bg-cream-50/50 border border-cream-300 rounded-xl px-4 py-3 text-sm text-forest-800 font-semibold focus:outline-none focus:border-gold-500 focus:bg-white transition-all cursor-pointer"
              >
                {counties.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.county}
                  </option>
                ))}
              </select>
            </div>

            {/* Widget size details info */}
            <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 text-xs text-soil-400 leading-relaxed">
              <p className="font-bold text-forest-700 mb-1">💡 Pro-Tip for SEO backlinks</p>
              By embedding this widget, you get live agricultural data for your readers. 
              The widget automatically includes a deep link back to ShambaIQ, helping establish 
              reliable open soil data referencing across the Kenyan web.
            </div>
          </div>

          {/* Copy-paste HTML box */}
          <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm">
            <h2 className="font-display text-base font-bold text-forest-700 mb-3 flex items-center gap-2">
              <Code size={16} className="text-gold-500" />
              Embed Code
            </h2>
            <div className="relative">
              <pre className="bg-forest-950 text-gold-300 rounded-xl p-4 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all pr-12 leading-relaxed">
                {embedCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-cream-200 hover:text-white transition-all shadow border border-forest-700/50"
                aria-label="Copy code to clipboard"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Clipboard size={14} />}
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow"
            >
              {copied ? (
                <>
                  <Check size={18} /> Code Copied!
                </>
              ) : (
                <>
                  <Clipboard size={18} /> Copy HTML Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Live Preview Column - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-display text-sm font-bold text-forest-600 uppercase tracking-wider flex items-center gap-2">
              <Eye size={16} />
              Live Widget Preview
            </h2>
            <span className="text-xs text-soil-400 flex items-center gap-1">
              <RefreshCw size={12} className="animate-spin-slow" /> Responsive Frame
            </span>
          </div>

          {/* Iframe wrapper */}
          <div className="bg-cream-100/30 rounded-3xl p-6 border border-cream-200 shadow-inner flex items-center justify-center min-h-[380px]">
            <div className="w-full max-w-[420px] transition-all duration-300">
              <iframe
                src={`/embed/county/${selectedSlug}`}
                width="100%"
                height="320"
                className="rounded-2xl shadow-md border-0 bg-[#FAF8F5]"
                style={{ border: "none" }}
                title="Live Widget Preview"
              />
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href={`/soil/${selectedSlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-500 transition-colors"
            >
              <ArrowLeft size={14} /> Back to full {selectedCountyName} County Soil Report
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
