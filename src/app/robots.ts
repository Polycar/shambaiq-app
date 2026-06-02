import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",       // Backend proxy routes
          "/admin",      // Officer dashboard
          "/profile",    // User auth pages
          "/app/results", // Dynamic results — no SEO value
        ],
      },
    ],
    sitemap: "https://shambaiq.com/sitemap.xml",
    host: "https://shambaiq.com",
  };
}
