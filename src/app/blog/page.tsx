import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "ShambaIQ Blog — Kenya Farming Data & Guides",
  description:
    "Data-driven farming articles, county soil rankings, crop guides, and seasonal advice for Kenyan farmers.",
};

const posts = [
  {
    slug: "county-soil-rankings-2026",
    title: "2026 Kenya Soil Health Report: All 47 Counties Ranked",
    excerpt:
      "We ranked every Kenyan county by soil health using iSDAsoil satellite data. See where your county stands and what it means for your crops.",
    date: "2026-01-15",
    category: "Data Report",
  },
  {
    slug: "maize-farming-guide",
    title: "The Complete Maize Farming Guide for Kenya",
    excerpt:
      "Everything you need to know about growing maize in Kenya — soil requirements, best counties, seed varieties, fertilizer plans, and expected returns.",
    date: "2026-01-22",
    category: "Crop Guide",
  },
  {
    slug: "acidic-soil-fix",
    title: "Why Your Soil Is Acidic — And What To Do About It",
    excerpt:
      "If your county's soil pH is below 5.5, your crops are struggling. Here's the science and the fix, based on real Kenyan soil data.",
    date: "2026-02-01",
    category: "Soil Science",
  },
  {
    slug: "dap-vs-can-vs-npk",
    title: "DAP vs CAN vs NPK: Which Fertilizer Does Your Farm Need?",
    excerpt:
      "Stop guessing. We break down when to use DAP, CAN, NPK, and Urea based on your soil test results and crop choice.",
    date: "2026-02-10",
    category: "Fertilizer",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        ShambaIQ Blog
      </h1>
      <p className="text-soil-400 mb-10">
        Data-driven farming insights for Kenyan farmers
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-2xl p-6 border border-cream-300 hover:border-gold-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold bg-forest-100 text-forest-600 px-2.5 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="text-xs text-soil-400">{post.date}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-forest-700 mb-2">
              {post.title}
            </h2>
            <p className="text-soil-400 text-sm leading-relaxed mb-4">
              {post.excerpt}
            </p>
            <span className="text-gold-600 font-semibold text-sm">
              Coming soon →
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
