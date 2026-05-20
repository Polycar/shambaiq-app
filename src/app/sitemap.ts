import { MetadataRoute } from "next";
import {
  getCountySoils,
  getCrops,
  getZones,
  getWards,
  slugify,
} from "@/lib/data";

const BASE = "https://www.shambaiq.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const counties = getCountySoils();
  const crops = getCrops();
  const zones = getZones();
  const wards = getWards();

  const now = new Date().toISOString();

  // ── 1. Static Pages ────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/soil`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/crops`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/zones`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/dealers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/dealers/apply`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  // ── 2. Blog Posts ────────────────────────────────────────────
  const blogPosts: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog/kenya-soil-health-rankings-2026`, lastModified: "2026-05-01", changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/blog/complete-maize-farming-guide-kenya`, lastModified: "2026-05-01", changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/blog/why-soil-is-acidic-kenya`, lastModified: "2026-05-01", changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/blog/dap-vs-can-vs-npk-fertilizer-guide`, lastModified: "2026-05-01", changeFrequency: "yearly", priority: 0.8 },
  ];

  // ── 3. Top-Level Directories (Zones, Counties, Crops, Dealers) ──
  const zonePages: MetadataRoute.Sitemap = zones.map((zone) => ({
    url: `${BASE}/zones/${slugify(zone)}`, lastModified: now, changeFrequency: "monthly", priority: 0.7,
  }));

  const countyPages: MetadataRoute.Sitemap = counties.map((c) => ({
    url: `${BASE}/soil/${c.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8,
  }));

  const dealerPages: MetadataRoute.Sitemap = counties.map((c) => ({
    url: `${BASE}/dealers/${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6,
  }));

  const cropPages: MetadataRoute.Sitemap = crops.map((c) => ({
    url: `${BASE}/crops/${c.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8,
  }));

  // ── 4. Deep Combinations (County × Crop) ───────────────────────
  const comboPages: MetadataRoute.Sitemap = counties.flatMap((county) =>
    crops.map((crop) => ({
      url: `${BASE}/soil/${county.slug}/${crop.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }))
  );

  // ── 5. Hyper-Local Wards ─────────────────────────────────────────
  const wardPages: MetadataRoute.Sitemap = wards.map((w) => {
    const county = counties.find((c) => c.county.toLowerCase() === w.county.toLowerCase());
    const countySlug = county ? county.slug : slugify(w.county);
    return {
      url: `${BASE}/soil/${countySlug}/ward/${w.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    };
  });

  // Total URLs generated: ~2,725
  // Safely under the Next.js/Google 50,000 URL limit for a single sitemap file.
  return [
    ...staticPages,
    ...blogPosts,
    ...zonePages,
    ...countyPages,
    ...dealerPages,
    ...cropPages,
    ...comboPages,
    ...wardPages,
  ];
}
