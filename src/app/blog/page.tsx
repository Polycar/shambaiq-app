import Link from "next/link";
import { Metadata } from "next";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Farming Guides & Soil Reports — Kenya Agriculture Blog",
  description:
    "Data-driven farming guides for Kenya. County soil rankings, crop guides, fertilizer comparisons, and seasonal advice based on 30m precision satellite soil data.",
  alternates: { canonical: "https://shambaiq.com/blog" },
  openGraph: {
    title: "ShambaIQ Farming Guides — Kenya Agriculture Blog",
    description: "Data-driven farming guides: soil rankings, crop guides, fertilizer comparisons, and seasonal advice for Kenyan smallholder farmers.",
    url: "https://shambaiq.com/blog",
    images: [{ url: "https://shambaiq.com/api/og", width: 1200, height: 630, alt: "ShambaIQ Kenya Farming Blog" }],
  },
  twitter: { card: "summary_large_image", title: "ShambaIQ Farming Guides", description: "Data-driven farming guides for Kenya — soil rankings, crop guides, fertilizer comparisons.", images: ["https://shambaiq.com/api/og"] },
};

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

const staticPosts = [
  {
    slug: "kenya-soil-health-rankings-2026",
    title: "2026 Kenya Soil Health Report: All 47 Counties Ranked",
    excerpt: "We analyzed satellite soil data for every Kenyan county. Here are the healthiest soils, the most challenging, and what it means for your farm.",
    date: "May 2026",
    readTime: "8 min read",
    category: "Data Report",
  },
  {
    slug: "complete-maize-farming-guide-kenya",
    title: "The Complete Maize Farming Guide for Kenya",
    excerpt: "Everything you need to grow maize in Kenya: soil requirements, best counties, certified seed varieties, fertilizer plans, and expected economics by region.",
    date: "May 2026",
    readTime: "10 min read",
    category: "Crop Guide",
  },
  {
    slug: "why-soil-is-acidic-kenya",
    title: "Why Your Soil Is Acidic — And What To Do About It",
    excerpt: "Soil acidity locks nutrients away from your crops. We identify the 15 most acidic counties in Kenya and explain exactly how to fix it.",
    date: "May 2026",
    readTime: "7 min read",
    category: "Soil Science",
  },
  {
    slug: "dap-vs-can-vs-npk-fertilizer-guide",
    title: "DAP vs CAN vs NPK: Which Fertilizer Does Your Farm Need?",
    excerpt: "Stop guessing which fertilizer to buy. This guide matches each fertilizer type to your soil condition, crop, and budget — with real prices.",
    date: "May 2026",
    readTime: "9 min read",
    category: "Fertilizer",
  },
  {
    slug: "kakamega-soil-mavuno-not-dap",
    title: "Kakamega Soil: Why Western Kenya Needs Mavuno, Not DAP",
    excerpt: "Kakamega's acidic soil locks DAP phosphorus. Data shows Mavuno outperforms DAP in all 4 Western Kenya counties. Here's the science and the savings.",
    date: "May 2026",
    readTime: "7 min read",
    category: "Soil Science",
  },
  {
    slug: "farming-semi-arid-kenya-machakos-makueni-kitui",
    title: "Farming in Semi-Arid Kenya: Machakos, Makueni, Kitui Guide",
    excerpt: "These counties are dismissed as too dry — but their soil is surprisingly nutrient-rich. The challenge isn't fertility, it's water. Here's how to farm them.",
    date: "May 2026",
    readTime: "8 min read",
    category: "County Guide",
  },
  {
    slug: "nakuru-vs-uasin-gishu-best-county-wheat",
    title: "Nakuru vs Uasin Gishu: Best County for Wheat?",
    excerpt: "Kenya's two biggest wheat counties compared on soil chemistry, certified seed varieties, and farming economics. The satellite data picks a winner.",
    date: "May 2026",
    readTime: "7 min read",
    category: "County Guide",
  },
  {
    slug: "how-much-fertilizer-per-acre-calculator",
    title: "How Much Fertilizer Per Acre? Calculator for over 40 Crops",
    excerpt: "Exact bags per acre for planting and top dressing across all over 40 crops. With costs at subsidized and commercial prices. The only table you need.",
    date: "May 2026",
    readTime: "9 min read",
    category: "Fertilizer",
  },
  {
    slug: "meru-nyeri-potato-farming-guide",
    title: "Potato Farming in Meru & Nyeri: Shangi Guide & Soil Science",
    excerpt: "Unlocking potato yields in Mt. Kenya's cold highlands. We analyze Meru and Nyeri soil chemistry, seed selection, and optimized fertilization systems.",
    date: "May 2026",
    readTime: "8 min read",
    category: "Crop Guide",
  },
  {
    slug: "organic-soil-enrichment-kenya-soil-carbon",
    title: "Organic Soil Enrichment & Soil Carbon Guide — Kenya",
    excerpt: "Chemical fertilizers work best in carbon-rich soil. We explore how to restore your shamba's natural fertility using organic soil carbon conservation.",
    date: "May 2026",
    readTime: "7 min read",
    category: "Soil Science",
  },
  {
    slug: "tomato-farming-guide-kiambu-kirinyaga",
    title: "Tomato Farming in Kiambu & Kirinyaga: Blossom End Rot & Yields",
    excerpt: "Commercial tomato cultivation under irrigation and greenhouse systems. We analyze Kirinyaga and Kiambu soils, calcium nutrition, and fertilizer selection.",
    date: "May 2026",
    readTime: "8 min read",
    category: "Crop Guide",
  },
  {
    slug: "cabbage-farming-kiambu",
    title: "Cabbage Farming in Kiambu: Clubroot Defense & Soil Chemistry",
    excerpt: "Grow heavier cabbages in Kiambu county. Learn Copenhagen and Gloria F1 cultivation, acidic soil management (pH 5.28), and lime-fertilizer applications.",
    date: "May 2026",
    readTime: "8 min read",
    category: "Crop Guide",
  },
  {
    slug: "onion-farming-kajiado",
    title: "Onion Farming in Kajiado: Sulfur Nutrition & Drip Irrigation",
    excerpt: "Master bulb onion farming in Kajiado county. Learn Red Coach F1 nursery setup, alkaline-neutral soil biology (pH 6.55), and sulfur fertilization.",
    date: "May 2026",
    readTime: "8 min read",
    category: "Crop Guide",
  },
  {
    slug: "sweet-potato-farming-homa-bay",
    title: "Sweet Potato Farming in Homa Bay: Potassium & OFSP Nutrition",
    excerpt: "Maximize sweet potato yields in Homa Bay county. Learn Orange-Fleshed Sweet Potato (OFSP) vine planting, acid-soil tolerance (pH 5.27), and potassium feeding.",
    date: "May 2026",
    readTime: "8 min read",
    category: "Crop Guide",
  },
  {
    slug: "dairy-farming-nandi",
    title: "Dairy Farming & Fodder in Nandi: Protein Yields & Soil Science",
    excerpt: "Boost milk production in Nandi county. Learn how soil chemistry (pH 6.17) fuels high-protein Napier, Boma Rhodes, and fodder maize cultivation.",
    date: "May 2026",
    readTime: "8 min read",
    category: "Dairy Guide",
  },
  {
    slug: "bean-farming-kakamega",
    title: "Bean Farming in Kakamega: Rhizobium Inoculation & Acid Soil Strategy",
    excerpt: "Grow higher bean yields in Western Kenya. Learn Rosecoco and Chelalang management, Rhizobium inoculation, and acidic soil buffering (pH 5.63).",
    date: "May 2026",
    readTime: "8 min read",
    category: "Crop Guide",
  },
];

async function getPublishedPosts() {
  try {
    const res = await fetch(`${API}/api/v1/blog`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return data.posts || [];
    }
  } catch (e) {
    console.error("Failed to fetch blog posts from API:", e);
  }
  return [];
}

export default async function BlogPage() {
  const dynamicPosts = await getPublishedPosts();

  const mappedDynamic = dynamicPosts.map((p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    date: p.published_at
      ? new Date(p.published_at).toLocaleDateString("en-KE", {
          year: "numeric",
          month: "long",
        })
      : "May 2026",
    readTime: p.read_time || "5 min read",
    category: p.category || "Guide",
  }));

  const allPosts = [...staticPosts, ...mappedDynamic];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        ShambaIQ Blog
      </h1>
      <p className="text-soil-500 mb-10 max-w-2xl">
        Data-driven farming guides, county soil reports, and seasonal advice. Every article uses real 30m precision satellite soil data covering all 47 Kenyan counties.
      </p>

      <div className="space-y-6">
        {allPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-white rounded-2xl p-6 md:p-8 border border-cream-300 hover:border-gold-400 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-soil-500">
                <Calendar size={12} /> {post.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-soil-500">
                <Clock size={12} /> {post.readTime}
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-forest-700 group-hover:text-gold-700 transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-soil-500 leading-relaxed mb-4">{post.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-gold-700 font-semibold text-sm group-hover:gap-2 transition-all">
              Read article <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-forest-700 rounded-2xl p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">
          Get personalized soil advice
        </h2>
        <p className="text-cream-400 mb-6">
          These guides give general advice. For recommendations matched to your exact location and crop, use ShambaIQ.
        </p>
        <Link
          href="/app"
          className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
        >
          Get Free Advice →
        </Link>
      </div>
    </div>
  );
}
