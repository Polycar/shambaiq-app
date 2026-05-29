import { MetadataRoute } from "next";
import { ALL_POSTS } from "@/lib/blog-data";
import { ALL_COUNTIES, ALL_CROPS, ALL_ZONES } from "@/lib/site-data";
import { getWards, slugify } from "@/lib/data";

const BASE = "https://www.shambaiq.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const wards = getWards();

  // ── 1. Static Pages ────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/soil`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/crops`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/zones`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/dealers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/dealers/apply`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/api`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/embed`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // ── 2. Dynamic Blog Pages ──────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = ALL_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.dateModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ── 3. Top-Level Directories (Zones, Counties, Crops, Dealers) ──
  const zonePages: MetadataRoute.Sitemap = ALL_ZONES.map((zone) => ({
    url: `${BASE}/zones/${zone.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const countyPages: MetadataRoute.Sitemap = ALL_COUNTIES.map((c) => ({
    url: `${BASE}/soil/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const dealerPages: MetadataRoute.Sitemap = ALL_COUNTIES.map((c) => ({
    url: `${BASE}/dealers/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const cropPages: MetadataRoute.Sitemap = ALL_CROPS.map((c) => ({
    url: `${BASE}/crops/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── 4. Deep Combinations (County × Crop) ───────────────────────
  const comboPages: MetadataRoute.Sitemap = ALL_COUNTIES.flatMap((county) =>
    ALL_CROPS.map((crop) => ({
      url: `${BASE}/soil/${county.slug}/${crop.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  // ── 5. Hyper-Local Wards ─────────────────────────────────────────
  const wardPages: MetadataRoute.Sitemap = wards.map((w) => {
    const county = ALL_COUNTIES.find((c) => c.name.toLowerCase() === w.county.toLowerCase());
    const countySlug = county ? county.slug : slugify(w.county);
    return {
      url: `${BASE}/soil/${countySlug}/ward/${w.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    };
  });

  return [
    ...staticPages,
    ...blogPages,
    ...zonePages,
    ...countyPages,
    ...cropPages,
    ...dealerPages,
    ...comboPages,
    ...wardPages,
  ];
}
