"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OfflinePage() {
  const [cachedPages, setCachedPages] = useState<string[]>([]);
  const [cacheLoaded, setCacheLoaded] = useState(false);

  useEffect(() => {
    if (!("caches" in window)) { setCacheLoaded(true); return; }
    caches.open("shambaiq-v1-pages").then((cache) =>
      cache.keys().then((keys) => {
        const paths = keys
          .map((r) => new URL(r.url).pathname)
          .filter((p) => p.startsWith("/soil/") || p.startsWith("/crops/"))
          .slice(0, 8);
        setCachedPages(paths);
        setCacheLoaded(true);
      })
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-cream-50 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-5">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-amber-600" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      </div>
      <h1 className="font-display text-2xl font-bold text-forest-700 mb-2">You are offline</h1>
      <p className="text-soil-500 text-sm mb-6 max-w-xs">
        No internet connection. Pages you have visited before are available below.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-forest-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full mb-8 active:bg-forest-700"
      >
        Try Again
      </button>
      {cacheLoaded && cachedPages.length === 0 && (
        <p className="text-xs text-soil-500 max-w-xs">
          Visit soil reports and crop pages while online to save them for offline use.
        </p>
      )}
      {cachedPages.length > 0 && (
        <div className="w-full max-w-xs text-left">
          <p className="text-xs font-semibold text-soil-500 uppercase tracking-wide mb-3">Available offline</p>
          <ul className="space-y-2">
            {cachedPages.map((path) => (
              <li key={path}>
                <Link
                  href={path}
                  className="flex items-center gap-2 text-sm text-forest-700 font-medium bg-white border border-cream-300 rounded-xl px-4 py-2.5 hover:bg-cream-50"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  {path.replace(/\//g, " › ").replace(/^›\s/, "").replace(/-/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link href="/" className="mt-8 text-xs text-soil-500 underline">
        Back to home
      </Link>
    </div>
  );
}
