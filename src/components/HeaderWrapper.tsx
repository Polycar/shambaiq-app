"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper({ isLoggedIn, userName }: { isLoggedIn?: boolean; userName?: string }) {
  const pathname = usePathname();
  
  // Hide the global header when inside the tool or login
  if (pathname === "/app" || pathname === "/login") return null;
  
  return <Header isLoggedIn={isLoggedIn} userName={userName} />;
}
