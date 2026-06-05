import type { MetadataRoute } from "next";
import { ALL_POSTS } from "@/lib/blog-data";
import { ALL_COUNTIES, ALL_CROPS, ALL_ZONES } from "@/lib/site-data";
import { getWards, slugify } from "@/lib/data";

const BASE = "https://shambaiq.com";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

// Shard layout (all under 5,000 URLs each, well inside Google's 50k limit):
//   0 = core  — static pages, blog, zones, counties, crops, dealers, compare hub
//   1 = combos-a — county×crop, counties 0–23
//   2 = combos-b — county×crop, counties 24–46
//   3 = wards — all ward pages
// When URL count passes ~10k per shard bump the split further.
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const now = new Date().toISOString();
  // Stable last-modified for data-driven pages. Bump only when the underlying
  // soil/crop/ward datasets change — avoids fake freshness on every deploy.
  const dataUpdated = "2026-06-01T00:00:00.000Z";

  // ── Shard 0: core pages ────────────────────────────────────────────────────
  if (id === "0") {
    const staticPages: MetadataRoute.Sitemap = [
      { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
      { url: `${BASE}/app`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE}/soil`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
      { url: `${BASE}/crops`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
      { url: `${BASE}/zones`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/dealers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
      { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
      { url: `${BASE}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
      { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
      { url: `${BASE}/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
      { url: `${BASE}/impact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE}/dealers/apply`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
      { url: `${BASE}/dealers/status`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE}/api`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/embed`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/doctor`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE}/yields`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
      { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
      { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
      { url: `${BASE}/map`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
      { url: `${BASE}/soil-test`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
      // County comparison hub
      { url: `${BASE}/soil/compare`, lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
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
      const res = await fetch(`${API}/api/v1/blog`, { next: { revalidate: 3600 } });
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

    // Per-crop county comparison pages
    const comparePages: MetadataRoute.Sitemap = ALL_CROPS.map((c) => ({
      url: `${BASE}/soil/compare/${c.slug}`,
      lastModified: dataUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    return [
      ...staticPages,
      ...blogPages,
      ...zonePages,
      ...countyPages,
      ...cropPages,
      ...dealerPages,
      ...comparePages,
    ];
  }

  // ── Shard 1: county×crop combos, first half of counties ───────────────────
  if (id === "1") {
    const half = Math.ceil(ALL_COUNTIES.length / 2);
    return ALL_COUNTIES.slice(0, half).flatMap((county) =>
      ALL_CROPS.map((crop) => ({
        url: `${BASE}/soil/${county.slug}/${crop.slug}`,
        lastModified: dataUpdated,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    );
  }

  // ── Shard 2: county×crop combos, second half of counties ──────────────────
  if (id === "2") {
    const half = Math.ceil(ALL_COUNTIES.length / 2);
    return ALL_COUNTIES.slice(half).flatMap((county) =>
      ALL_CROPS.map((crop) => ({
        url: `${BASE}/soil/${county.slug}/${crop.slug}`,
        lastModified: dataUpdated,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    );
  }

  // ── Shard 3: ward pages ────────────────────────────────────────────────────
  if (id === "3") {
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
