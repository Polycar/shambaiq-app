"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Hide the global header when inside the tool
  if (pathname === "/app") return null;
  
  return <Header />;
}
