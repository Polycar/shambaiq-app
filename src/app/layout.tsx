import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cookies } from "next/headers";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shambaiq.com"),
  title: { default: "ShambaIQ — Precision Agriculture for Every Kenyan Farmer", template: "%s | ShambaIQ" },
  description: "Free soil analysis and fertilizer recommendations for all 47 Kenyan counties, 25 crops. Powered by iSDAsoil satellite data.",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: { type: "website", locale: "en_KE", siteName: "ShambaIQ", images: ["/api/og"] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  verification: { google: "hDkSRs8CVliEOaxCe1Odg6JKByTt7natiI-1DM4GHWo" },
  alternates: { languages: { en: "https://www.shambaiq.com", sw: "https://www.shambaiq.com/sw" } },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("shambaiq_session");
  let isLoggedIn = false;
  let userName = "";

  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie.value));
      isLoggedIn = true;
      userName = session.name || "Farmer";
    } catch {
      // Ignored
    }
  }

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header isLoggedIn={isLoggedIn} userName={userName} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
      <GoogleAnalytics gaId="G-7X2WCN7KJ7" />
    </html>
  );
}
