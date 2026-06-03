"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "./Logo";

// Links shown in the desktop center nav
const mainNavLinks = [
  { href: "/app", label: "Get farm plan" },
  { href: "/doctor", label: "Plant doctor" },
  { href: "/agronomy", label: "Ask agronomist" },
  { href: "/soil", label: "Soil data" },
  { href: "/blog", label: "Blog" },
];

// All links shown in mobile hamburger
const mobileNavLinks = [
  { href: "/app", label: "Get farm plan" },
  { href: "/doctor", label: "Plant doctor" },
  { href: "/agronomy", label: "Ask agronomist" },
  { href: "/soil", label: "Soil data" },
  { href: "/yields", label: "My yields" },
  { href: "/dealers", label: "Dealers" },
  { href: "/blog", label: "Blog" },
  { href: "/profile", label: "My profile" },
  { href: "/dealers/apply", label: "Dealer signup", cta: true },
];

export default function Header({ isLoggedIn, userName }: { isLoggedIn?: boolean; userName?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    document.cookie = "shambaiq_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "glass border-forest-600/60 shadow-sm"
          : "bg-forest-700/95 backdrop-blur-sm border-forest-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — left */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Logo size={28} showText={false} />
            <span className="font-display text-xl font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
              Shamba<span className="text-gold-400">IQ</span>
            </span>
          </Link>

          {/* Desktop center nav — 4 links only */}
          <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-gold-400 bg-gold-500/10"
                    : "text-cream-300 hover:text-gold-300 hover:bg-cream-200/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side — avatar or login */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="w-8 h-8 rounded-full bg-gold-500 hover:bg-gold-400 flex items-center justify-center border-2 border-gold-400/40 transition-colors"
                  aria-label={`View profile — ${userName || "Farmer"}`}
                >
                  <span className="text-sm font-bold text-white leading-none">
                    {userName?.charAt(0).toUpperCase() || "F"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-cream-300/20 hover:border-cream-300/40 text-cream-300 font-medium rounded-lg transition-colors text-xs"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/profile"
                className="px-4 py-2 border border-cream-300/20 hover:border-cream-300/40 text-cream-300 font-medium rounded-lg transition-colors text-sm"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-cream-300 hover:text-gold-300 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav — all links including My Yields, Dealers, My Profile, Dealer Signup */}
        {open && (
          <nav className="lg:hidden slide-down pb-5 space-y-1 border-t border-forest-600/40 mt-1 pt-3 overflow-hidden">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  link.cta
                    ? "bg-gold-500 text-white mt-2"
                    : isActive(link.href)
                    ? "text-gold-400 bg-gold-500/10"
                    : "text-cream-300 hover:bg-forest-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="mt-4 pt-4 border-t border-cream-300/10">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 mb-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center border-2 border-gold-400/40">
                    <span className="text-sm font-bold text-white">{userName?.charAt(0).toUpperCase() || "F"}</span>
                  </div>
                  <span className="text-sm font-medium text-cream-300">Hi, {userName || "Farmer"} · View profile</span>
                </Link>
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="w-full text-left block px-3 py-2.5 rounded-lg text-sm font-medium text-cream-300 border border-cream-300/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-cream-300 border border-cream-300/20"
              >
                Log in
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
