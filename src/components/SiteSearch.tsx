"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { searchCounties, searchCrops } from "@/lib/site-data";

// ── Types ──────────────────────────────────────────────────────────────────

interface Result {
  label: string;
  sublabel: string;
  href: string;
  type: "county" | "crop";
}

// ── Component ──────────────────────────────────────────────────────────────

export default function SiteSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  // Run search on every keystroke
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }

    const counties = searchCounties(q).map((c) => ({
      label: `${c.name} County`,
      sublabel: c.zone,
      href: `/soil/${c.slug}`,
      type: "county" as const,
    }));

    const crops = searchCrops(q).map((c) => ({
      label: c.name,
      sublabel: c.category,
      href: `/crops/${c.slug}`,
      type: "crop" as const,
    }));

    const combined = [...counties, ...crops].slice(0, 8);
    setResults(combined);
    setOpen(combined.length > 0);
    setActiveIndex(-1);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          router.push(results[activeIndex].href);
          setOpen(false);
          setQuery("");
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
      }
    },
    [open, results, activeIndex, router]
  );

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleBlur = () => {
    // Delay to allow click on result to fire first
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative w-full"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      {/* Search input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300 pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setOpen(results.length > 0)}
          onBlur={handleBlur}
          placeholder="Search county or crop — Nakuru, Maize, Kiambu..."
          aria-label="Search counties and crops"
          aria-controls="search-results"
          aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
          className="w-full pl-11 pr-4 py-4 text-base border border-cream-300 rounded-xl bg-white text-forest-900 placeholder-soil-300 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-200 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-soil-300 hover:text-soil-500 transition-colors"
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <ul
          id="search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-cream-300 rounded-xl shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto"
        >
          {/* Group headers */}
          {results.some((r) => r.type === "county") && (
            <li className="px-4 pt-3 pb-1" role="presentation">
              <span className="text-xs font-bold uppercase tracking-widest text-soil-300">Counties</span>
            </li>
          )}
          {results
            .filter((r) => r.type === "county")
            .map((result, i) => (
              <li
                key={result.href}
                id={`result-${i}`}
                role="option"
                aria-selected={activeIndex === i}
                onClick={() => handleSelect(result.href)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                  activeIndex === i ? "bg-forest-50" : "hover:bg-cream-50"
                }`}
              >
                <div>
                  <span className="text-sm font-medium text-forest-800">{result.label}</span>
                  <span className="text-xs text-soil-500 ml-2">{result.sublabel}</span>
                </div>
                <span className="text-xs text-gold-500 font-medium flex-shrink-0">Soil report →</span>
              </li>
            ))}

          {results.some((r) => r.type === "crop") && (
            <li
              className={`px-4 pb-1 ${results.some((r) => r.type === "county") ? "pt-3 border-t border-cream-200 mt-1" : "pt-3"}`}
              role="presentation"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-soil-300">Crops</span>
            </li>
          )}
          {results
            .filter((r) => r.type === "crop")
            .map((result, i) => {
              const globalIndex = results.findIndex((r) => r.href === result.href);
              return (
                <li
                  key={result.href}
                  id={`result-${globalIndex}`}
                  role="option"
                  aria-selected={activeIndex === globalIndex}
                  onClick={() => handleSelect(result.href)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    activeIndex === globalIndex ? "bg-forest-50" : "hover:bg-cream-50"
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium text-forest-800">{result.label}</span>
                    <span className="text-xs text-soil-500 ml-2">{result.sublabel}</span>
                  </div>
                  <span className="text-xs text-gold-500 font-medium flex-shrink-0">Crop guide →</span>
                </li>
              );
            })}

          {/* Quick action footer */}
          <li className="px-4 py-2.5 border-t border-cream-200 bg-cream-50" role="presentation">
            <button
              onClick={() => { router.push(`/app?q=${encodeURIComponent(query)}`); setOpen(false); }}
              className="text-xs text-forest-600 hover:text-forest-800 font-medium transition-colors"
            >
              Get precision plan for "{query}" in ShambaIQ tool →
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
