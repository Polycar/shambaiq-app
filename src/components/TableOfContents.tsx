"use client";

import { useEffect, useState } from "react";

export interface TOCItem {
  id: string;
  label: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Table of contents"
      className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8 lg:sticky lg:top-6"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">
        In This Article
      </p>
      <ol className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${item.id}`}
              className={`text-sm leading-snug block transition-colors duration-150 ${
                active === item.id
                  ? "text-forest-700 font-semibold"
                  : "text-soil-500 hover:text-forest-700"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
