import type { MetadataRoute } from "next";
import { ALL_POSTS } from "@/lib/blog-data";
import { ALL_COUNTIES, ALL_CROPS, ALL_ZONES } from "@/lib/site-data";
import { getWards, slugify } from "@/lib/data";

export const revalidate = 86400; // ISR: regenerate at most every 24 hours

const BASE = "https://shambaiq.com";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

// Shard layout:
//   0 = core  — static pages, blog, zones, counties, crops, dealers, compare hub
//   1 = wards — all ward pages
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const now = new Date().toISOString();
  const dataUpdated = "2026-06-01T00:00:00.000Z";

  // ── Shard 0: core pages ────────────────────────────────────────────────────
  if (id === "0") {
    const livePages: MetadataRoute.Sitemap = [
      { url: BASE,               lastModified: now, changeFrequency: "weekly", priority: 1.0 },
      { url: `${BASE}/app`,      lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE}/blog`,     lastModified: now, changeFrequency: "weekly", priority: 0.8 },
      { url: `${BASE}/dealers`,  lastModified: now, changeFrequency: "weekly", priority: 0.7 },
      { url: `${BASE}/yields`,   lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ];

    const stablePages: MetadataRoute.Sitemap = [
      { url: `${BASE}/soil`,         lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.9 },
      { url: `${BASE}/crops`,        lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.9 },
      { url: `${BASE}/zones`,        lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/map`,          lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
      { url: `${BASE}/soil-test`,    lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
      { url: `${BASE}/intercrop`,    lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
      { url: `${BASE}/crop-finder`,  lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
      { url: `${BASE}/seeds`,        lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/features`,     lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
      { url: `${BASE}/api`,          lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/embed`,        lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/doctor`,       lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/agronomy`,     lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/soil/compare`, lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
      { url: `${BASE}/impact`,       lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE}/partners`,     lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.6 },
    ];

    const staticCopyPages: MetadataRoute.Sitemap = [
      { url: `${BASE}/about`,          lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.7 },
      { url: `${BASE}/contact`,        lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.6 },
      { url: `${BASE}/dealers/apply`,  lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.5 },
      { url: `${BASE}/dealers/status`, lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE}/login`,          lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.5 },
      { url: `${BASE}/privacy`,        lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.3 },
      { url: `${BASE}/terms`,          lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.3 },
    ];

    const safeDate = (dateStr: string | null | undefined, fallback: string): string => {
      if (!dateStr) return fallback;
      try {
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? fallback : d.toISOString();
      } catch {
        return fallback;
      }
    };

    let dynamicPosts: any[] = [];
    try {
      const res = await fetch(`${API}/api/v1/blog`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        dynamicPosts = data.posts || [];
      }
    } catch {
      // omit dynamic posts if API is unreachable
    }

    const blogPages: MetadataRoute.Sitemap = [
      ...ALL_POSTS.map((post) => ({
        url: `${BASE}/blog/${post.slug}`,
        lastModified: safeDate(post.dateModified, now),
        changeFrequency: "monthly" as const,
        priority: 0.85,
      })),
      ...dynamicPosts.map((post) => ({
        url: `${BASE}/blog/${post.slug}`,
        lastModified: safeDate(post.published_at, now),
        changeFrequency: "monthly" as const,
        priority: 0.85,
      })),
    ];

    const zonePages: MetadataRoute.Sitemap = ALL_ZONES.map((zone) => ({
      url: `${BASE}/zones/${zone.slug}`,
      lastModified: dataUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const countyPages: MetadataRoute.Sitemap = ALL_COUNTIES.map((c) => ({
      url: `${BASE}/soil/${c.slug}`,
      lastModified: dataUpdated,
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
      lastModified: dataUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const comparePages: MetadataRoute.Sitemap = ALL_CROPS.map((c) => ({
      url: `${BASE}/soil/compare/${c.slug}`,
      lastModified: dataUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    return [
      ...livePages,
      ...stablePages,
      ...staticCopyPages,
      ...blogPages,
      ...zonePages,
      ...countyPages,
      ...cropPages,
      ...dealerPages,
      ...comparePages,
    ];
  }

  // ── Shard 1: ward pages ────────────────────────────────────────────────────
  if (id === "1") {
    const wards = getWards();
    return wards.map((w) => {
      const county = ALL_COUNTIES.find(
        (c) => c.name.toLowerCase() === w.county.toLowerCase()
      );
      const countySlug = county ? county.slug : slugify(w.county);
      return {
        url: `${BASE}/soil/${countySlug}/ward/${w.slug}`,
        lastModified: dataUpdated,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      };
    });
  }

  return [];
}
