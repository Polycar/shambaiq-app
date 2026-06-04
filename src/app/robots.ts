import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og"], // Allow OG image endpoints for rich previews
        disallow: [
          // API proxy routes blocked individually so /api/og stays crawlable
          "/api/admin",   // Admin backend routes
          "/api/chat",    // AI proxy routes
          "/api/doctor",  // AI proxy routes
          "/api/agronomy",// AI proxy routes
          "/admin",       // Officer dashboard
          "/profile",     // User auth pages
          "/dealer/",     // Dealer dashboard and dealer login
          "/agronomy",    // Agronomic AI chatbot page
          "/offline",     // Offline fallback page
          "/app/results", // Dynamic results — no SEO value
        ],
      },
    ],
    sitemap: "https://shambaiq.com/sitemap.xml",
    host: "https://shambaiq.com",
  };
}
