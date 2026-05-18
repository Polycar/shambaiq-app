import { MetadataRoute } from "next";
import {
  getCountySoils,
  getCrops,
  getZones,
  slugify,
} from "@/lib/data";

const BASE = "https://www.shambaiq.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const counties = getCountySoils();
  const crops = getCrops();
  const zones = getZones();

  const now = new Date().toISOString();

  // ── Static pages ────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/soil`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/crops`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/zones`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/dealers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/dealers/apply`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    // NOT included (noindex): /app /agronomy /admin /yields /doctor /profile /dealers/status
  ];

  // ── Blog posts ────────────────────────────────────────────
  const blogPosts: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/blog/kenya-soil-health-rankings-2026`,
      lastModified: "2026-05-01",
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/complete-maize-farming-guide-kenya`,
      lastModified: "2026-05-01",
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/why-soil-is-acidic-kenya`,
      lastModified: "2026-05-01",
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/dap-vs-can-vs-npk-fertilizer-guide`,
      lastModified: "2026-05-01",
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  // ── Zone pages (10) ─────────────────────────────────────
  const zonePages: MetadataRoute.Sitemap = zones.map((zone) => ({
    url: `${BASE}/zones/${slugify(zone)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── County soil pages (47) ────────────────────────────────
  const countyPages: MetadataRoute.Sitemap = counties.map((c) => ({
    url: `${BASE}/soil/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── Dealer directory pages (47) ───────────────────────────
  const dealerPages: MetadataRoute.Sitemap = counties.map((c) => ({
    url: `${BASE}/dealers/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // ── Crop pages (25) ──────────────────────────────────────
  const cropPages: MetadataRoute.Sitemap = crops.map((c) => ({
    url: `${BASE}/crops/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── County × Crop combo pages (47 × 25 = 1,175) ──────────
  // Priority 0.6 — valuable long-tail, lower than top-level pages
  const comboPages: MetadataRoute.Sitemap = counties.flatMap((county) =>
    crops.map((crop) => ({
      url: `${BASE}/soil/${county.slug}/${crop.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [
    ...staticPages,     // 8 pages
    ...blogPosts,       // 4 pages
    ...zonePages,       // 10 pages
    ...countyPages,     // 47 pages
    ...dealerPages,     // 47 pages
    ...cropPages,       // 25 pages
    ...comboPages,      // 1,175 pages
    // Total: ~1,316 pages
    // Ward pages excluded — 1,450 pages is too many for a single sitemap
    // and ward-level data pages have low individual SEO value
  ];
}
