import Link from "next/link";
import { Metadata } from "next";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Farming Guides & Soil Reports — Kenya Agriculture Blog",
  description:
    "Data-driven farming guides for Kenya. County soil rankings, crop guides, fertilizer comparisons, and seasonal advice based on iSDAsoil satellite data.",
};

const API = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";

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
      <p className="text-soil-400 mb-10 max-w-2xl">
        Data-driven farming guides, county soil reports, and seasonal advice. Every article uses real iSDAsoil satellite data covering all 47 Kenyan counties.
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
              <span className="flex items-center gap-1 text-xs text-soil-400">
                <Calendar size={12} /> {post.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-soil-400">
                <Clock size={12} /> {post.readTime}
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-forest-700 group-hover:text-gold-600 transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-soil-400 leading-relaxed mb-4">{post.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-gold-600 font-semibold text-sm group-hover:gap-2 transition-all">
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
