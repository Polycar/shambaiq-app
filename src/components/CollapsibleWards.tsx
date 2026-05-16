"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface Ward {
  ward: string;
  slug: string;
  subcounty: string;
}

interface Props {
  countySlug: string;
  subcounties: string[];
  wards: Ward[];
}

export default function CollapsibleWards({ countySlug, subcounties, wards }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (sc: string) => setOpen((prev) => ({ ...prev, [sc]: !prev[sc] }));

  return (
    <div className="space-y-2">
      {subcounties.map((sc) => {
        const scWards = wards.filter((w) => w.subcounty === sc);
        const isOpen = open[sc] || false;

        return (
          <div key={sc} className="border border-cream-300 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(sc)}
              className="w-full flex items-center justify-between px-4 py-3 bg-cream-50 hover:bg-cream-100 transition-colors text-left"
            >
              <div>
                <span className="text-sm font-bold text-forest-600 uppercase tracking-wide">
                  {sc}
                </span>
                <span className="text-xs text-soil-400 ml-2">
                  {scWards.length} wards
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-soil-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {scWards.map((w) => (
                  <Link
                    key={w.slug}
                    href={`/soil/${countySlug}/ward/${w.slug}`}
                    className="px-3 py-1.5 bg-cream-100 hover:bg-gold-100 text-forest-700 text-sm rounded-lg border border-cream-300 hover:border-gold-400 transition-colors"
                  >
                    {w.ward}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
