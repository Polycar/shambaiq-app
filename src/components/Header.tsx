"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const navLinks = [
  { href: "/soil", label: "Soil Reports" },
  { href: "/crops", label: "Crop Guides" },
  { href: "/yields", label: "My Yields" },
  { href: "/dealers", label: "Dealers" },
  { href: "/doctor", label: "Plant Doctor" },
  { href: "/agronomy", label: "Ask Agronomist" },
  { href: "/dealers/apply", label: "Dealer Signup", cta: true },
];

export default function Header({ isLoggedIn, userName }: { isLoggedIn?: boolean; userName?: string }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "shambaiq_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-forest-700/95 backdrop-blur-sm border-b border-forest-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={28} showText={false} />
            <span className="font-display text-xl font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
              Shamba<span className="text-gold-400">IQ</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.cta ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="ml-3 px-5 py-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-cream-300 hover:text-gold-300 transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              )
            )}
            {isLoggedIn ? (
              <div className="flex items-center gap-4 ml-3">
                <div className="flex items-center gap-2 text-cream-300">
                  <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center border border-forest-500">
                    <span className="text-xs font-bold text-white">{userName?.charAt(0).toUpperCase() || "F"}</span>
                  </div>
                  <span className="text-sm font-medium">Hi, {userName || "Farmer"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-cream-300/30 hover:border-cream-300 text-cream-300 font-semibold rounded-lg transition-colors text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-3 px-4 py-2 border border-cream-300/30 hover:border-cream-300 text-cream-300 font-semibold rounded-lg transition-colors text-sm"
              >
                Log In
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-cream-300 hover:text-gold-300"
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

        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  link.cta
                    ? "bg-gold-500 text-white mt-2"
                    : "text-cream-300 hover:bg-forest-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="mt-4 pt-4 border-t border-cream-300/10">
                <div className="flex items-center gap-3 px-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center border border-forest-500">
                    <span className="text-sm font-bold text-white">{userName?.charAt(0).toUpperCase() || "F"}</span>
                  </div>
                  <span className="text-sm font-medium text-cream-300">Hi, {userName || "Farmer"}</span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left block px-3 py-2 rounded-lg text-sm font-medium text-cream-300 border border-cream-300/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 mt-2 rounded-lg text-sm font-medium text-cream-300 border border-cream-300/30"
              >
                Log In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
