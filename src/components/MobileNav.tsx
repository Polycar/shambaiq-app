"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mountain, TrendingUp, Stethoscope, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/soil", label: "Soil", icon: Mountain },
  { href: "/yields", label: "Yields", icon: TrendingUp },
  { href: "/doctor", label: "Doctor", icon: Stethoscope },
  { href: "/profile", label: "Me", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-cream-300 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-forest-700"
                  : "text-soil-400 hover:text-forest-600"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? "text-forest-700" : ""}
                aria-hidden="true"
              />
              <span
                className={`text-[10px] leading-tight truncate max-w-full ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
