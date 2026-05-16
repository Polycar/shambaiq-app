"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const navLinks = [
  { href: "/soil", label: "Soil Reports" },
  { href: "/crops", label: "Crop Guides" },
  { href: "/zones", label: "Zones" },
  { href: "/dealers", label: "Dealers" },
  { href: "/yields", label: "Yields" },
  { href: "/doctor", label: "Plant Doctor" },
  { href: "/blog", label: "Blog" },
  { href: "/dealers/apply", label: "Dealer Signup", cta: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-forest-700/95 backdrop-blur-sm border-b border-forest-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={28} />
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
          </nav>
        )}
      </div>
    </header>
  );
}
