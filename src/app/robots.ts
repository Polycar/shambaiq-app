import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/results", "/api/"],
    },
    sitemap: "https://www.shambaiq.com/sitemap.xml",
  };
}
