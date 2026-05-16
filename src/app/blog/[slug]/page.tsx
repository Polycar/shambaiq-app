import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";

// Static blog posts that are code-based (data-driven)
const STATIC_SLUGS = [
  "kenya-soil-health-rankings-2026",
  "complete-maize-farming-guide-kenya",
  "why-soil-is-acidic-kenya",
  "dap-vs-can-vs-npk-fertilizer-guide",
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/blog/${slug}`, { next: { revalidate: 300 } });
    if (res.ok) return await res.json();
  } catch { /* fallthrough */ }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (STATIC_SLUGS.includes(slug)) return {};
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: ["/api/og"] },
  };
}

export default async function DynamicBlogPost({ params }: PageProps) {
  const { slug } = await params;

  // Static posts are handled by their own page.tsx files — skip
  if (STATIC_SLUGS.includes(slug)) notFound();

  const post = await getPost(slug);
  if (!post) notFound();

  // Simple markdown-to-HTML: headers, bold, links, paragraphs
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      let html = block
        .replace(/^### (.+)$/gm, '<h3 class="font-display text-xl font-bold text-forest-700 mt-8 mb-3">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="font-display text-2xl font-bold text-forest-700 mt-10 mb-4">$1</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-forest-700">$1</strong>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-gold-600 hover:underline font-medium">$1</a>');

      if (!html.startsWith("<h")) {
        html = `<p class="text-soil-500 leading-relaxed mb-4">${html}</p>`;
      }

      return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />

      <header className="mb-10">
        <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">{post.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">{post.title}</h1>
        {post.excerpt && <p className="text-soil-400 leading-relaxed max-w-2xl">{post.excerpt}</p>}
        <div className="text-xs text-soil-300 mt-4">
          {post.published_at && new Date(post.published_at).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
          {post.read_time && ` · ${post.read_time}`}
          {post.author && ` · ${post.author}`}
        </div>
      </header>

      <div className="prose prose-forest max-w-none">
        {renderContent(post.content)}
      </div>

      <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Get personalized soil advice</h2>
        <p className="text-cream-400 mb-6">Free precision fertilizer recommendations for your county and crop.</p>
        <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Get Free Advice →</Link>
      </div>
    </article>
  );
}
