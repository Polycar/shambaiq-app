import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import JsonLd from "@/components/JsonLd";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";
const SITE_URL = "https://www.shambaiq.com";

const STATIC_SLUGS = [
  // ── New Descriptive Slugs ──
  "kenya-county-soil-rankings-2026",
  "complete-maize-farming-guide-kenya",
  "why-your-soil-is-acidic-kenya",
  "dap-vs-can-vs-npk-fertilizer-guide-kenya",
  "maize-farming-nakuru-yield-guide",
  "cabbage-farming-kiambu-highland-soils",
  "wheat-farming-uasin-gishu-yield-guide",
  "tomato-farming-kirinyaga-mwea-soils",
  "onion-farming-kajiado-dryland-guide",
  "sweet-potato-farming-homa-bay-guide",
  "acidic-soil-treatment-meru-nyeri",
  "organic-soil-restoration-machakos",
  "dairy-fodder-farming-nandi-county",
  "bean-farming-kakamega-double-harvest",
  "kakamega-soil-western-kenya-mavuno",
  "farming-semi-arid-kenya-machakos-makueni-kitui",
  "nakuru-vs-uasin-gishu-best-county-wheat",
  "how-much-fertilizer-per-acre-kenya-calculator",
  "long-rains-2026-what-to-plant-kenya",
  "yellow-maize-leaves-soil-deficiency-kenya",
  "cheapest-way-fix-acidic-soil-kenya",

  // ── Old Slugs ──
  "kenya-soil-health-rankings-2026",
  "why-soil-is-acidic-kenya",
  "dap-vs-can-vs-npk-fertilizer-guide",
  "kakamega-soil-mavuno-not-dap",
  "how-much-fertilizer-per-acre-calculator",
  "meru-nyeri-potato-farming-guide",
  "organic-soil-enrichment-kenya-soil-carbon",
  "tomato-farming-guide-kiambu-kirinyaga",
  "cabbage-farming-kiambu",
  "onion-farming-kajiado",
  "sweet-potato-farming-homa-bay",
  "dairy-farming-nandi",
  "bean-farming-kakamega",
];

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  read_time: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  published_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
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

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  const ogImage = post.featured_image || `${SITE_URL}/api/og`;
  const canonical = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.focus_keyword || undefined,
    authors: [{ name: post.author || "ShambaIQ" }],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author || "ShambaIQ"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function parseInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-4 w-full object-cover max-h-80" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold-600 hover:underline font-medium">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-forest-700">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-soil-500">$1</em>');
}

interface FAQItem {
  question: string;
  answer: string;
}

function extractFAQs(content: string): FAQItem[] {
  const faqHeaderIndex = content.search(/##\s+(Frequently Asked Questions|FAQs|FAQ)/i);
  if (faqHeaderIndex === -1) return [];

  const faqSection = content.substring(faqHeaderIndex);
  const qMatches = Array.from(faqSection.matchAll(/\*\*Q:\s*([^*?]+)\??\*\*/gi));
  const items: FAQItem[] = [];

  for (let idx = 0; idx < qMatches.length; idx++) {
    const match = qMatches[idx];
    const questionText = match[1].trim() + "?";
    
    const startIdx = match.index! + match[0].length;
    const endIdx = idx + 1 < qMatches.length ? qMatches[idx + 1].index! : faqSection.length;
    
    let answerText = faqSection.substring(startIdx, endIdx).trim();
    answerText = answerText
      .replace(/##\s+Conclusion.*/gi, "")
      .replace(/##\s+\w.*/gi, "")
      .replace(/^[*\s]+|[*\s]+$/g, "") // strip asterisks
      .trim();

    if (questionText && answerText) {
      items.push({ question: questionText, answer: answerText });
    }
  }

  return items;
}

function extractTOCItems(content: string): TOCItem[] {
  const faqHeaderIndex = content.search(/##\s+(Frequently Asked Questions|FAQs|FAQ)/i);
  const bodyOnly = faqHeaderIndex !== -1 ? content.substring(0, faqHeaderIndex) : content;

  const lines = bodyOnly.split("\n");
  const items: TOCItem[] = [];
  lines.forEach(line => {
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      const id = text.toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      items.push({ id, label: text, level: 2 });
    } else if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      const id = text.toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      items.push({ id, label: text, level: 3 });
    }
  });
  return items;
}

function renderContent(raw: string) {
  // Stop rendering content once we reach the FAQs section
  const faqHeaderIndex = raw.search(/##\s+(Frequently Asked Questions|FAQs|FAQ)/i);
  const contentToRender = faqHeaderIndex !== -1 ? raw.substring(0, faqHeaderIndex) : raw;

  const lines = contentToRender.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={k++} className="border-cream-300 my-8" />);
      i++; continue;
    }

    if (line.startsWith("# ")) {
      elements.push(<h1 key={k++} className="font-display text-3xl font-bold text-forest-700 mt-10 mb-4" dangerouslySetInnerHTML={{ __html: parseInline(line.slice(2)) }} />);
      i++; continue;
    }

    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      elements.push(<h2 id={id} key={k++} className="font-display text-2xl font-bold text-forest-700 mt-10 mb-4" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />);
      i++; continue;
    }

    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      elements.push(<h3 id={id} key={k++} className="font-display text-xl font-bold text-forest-700 mt-8 mb-3" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />);
      i++; continue;
    }

    if (line.startsWith("#### ")) {
      elements.push(<h4 key={k++} className="font-semibold text-forest-700 mt-6 mb-2" dangerouslySetInnerHTML={{ __html: parseInline(line.slice(5)) }} />);
      i++; continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={k++} className="border-l-4 border-gold-400 pl-4 py-2 my-4 bg-cream-50 rounded-r-xl">
          <p className="text-soil-500 italic leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(quoteLines.join(" ")) }} />
        </blockquote>
      );
      continue;
    }

    // --- Markdown Tables ---
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (row: string) =>
          row.split("|").slice(1, -1).map((c) => c.trim());
        const headers = parseRow(tableLines[0]);
        const bodyRows = tableLines.slice(2).map(parseRow);

        elements.push(
          <div key={k++} className="overflow-x-auto my-6 rounded-xl border border-cream-300">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-forest-700/10">
                  {headers.map((h, j) => (
                    <th key={j} className="px-4 py-3 text-left font-semibold text-forest-700 whitespace-nowrap" dangerouslySetInnerHTML={{ __html: parseInline(h) }} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-soil-500 border-t border-cream-200" dangerouslySetInnerHTML={{ __html: parseInline(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={k++} className="list-disc list-outside ml-5 space-y-1.5 my-4">
          {items.map((item, j) => (
            <li key={j} className="text-soil-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={k++} className="list-decimal list-outside ml-5 space-y-1.5 my-4">
          {items.map((item, j) => (
            <li key={j} className="text-soil-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    const imgMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
    if (imgMatch) {
      elements.push(
        <figure key={k++} className="my-6">
          <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full rounded-xl object-cover max-h-80" loading="lazy" />
          {imgMatch[1] && <figcaption className="text-center text-xs text-soil-300 mt-2">{imgMatch[1]}</figcaption>}
        </figure>
      );
      i++; continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,4} /.test(lines[i]) &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !lines[i].startsWith("> ") &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^!\[/.test(lines[i]) &&
      !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|"))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={k++} className="text-soil-500 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: parseInline(paraLines.join(" ")) }} />
      );
    }
  }

  return elements;
}

async function getPublishedPosts() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/blog`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return data.posts || [];
    }
  } catch (e) {
    console.error("Failed to fetch blog posts from API:", e);
  }
  return [];
}

export default async function DynamicBlogPost({ params }: PageProps) {
  const { slug } = await params;
  if (STATIC_SLUGS.includes(slug)) notFound();

  const post = await getPost(slug);
  if (!post) notFound();

  const faqItems = extractFAQs(post.content);
  const tocItems = extractTOCItems(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: "Polycarp Andabwa", url: `${SITE_URL}/about` },
    publisher: {
      "@type": "Organization",
      name: "ShambaIQ",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/shambaiq-logo.png` },
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    image: post.featured_image || `${SITE_URL}/api/og`,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    keywords: post.focus_keyword || post.category,
  };

  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "ShambaIQ",
    },
    jsonLd,
  ];
  if (faqSchema) schemas.push(faqSchema);

  // Load related posts from dynamic DB
  const dynamicPosts = await getPublishedPosts();
  const allRelatedPosts = dynamicPosts.map((p: any) => ({
    slug: p.slug,
    title: p.title,
    category: p.category || "Guide",
    metaDescription: p.meta_description || p.excerpt || "",
    readingTimeMin: 6,
    wordCount: 1200,
  }));
  const related = allRelatedPosts
    .filter((p: any) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd schemas={schemas} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Main Article */}
          <article className="min-w-0" itemScope itemType="https://schema.org/BlogPosting">
            <header className="mb-10">
              <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">{post.category}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3" itemProp="headline">{post.title}</h1>
              {post.excerpt && <p className="text-soil-400 leading-relaxed max-w-2xl" itemProp="description">{post.excerpt}</p>}
              
              <div className="flex items-center gap-3 text-xs text-soil-300 mt-4 flex-wrap pb-6 border-b border-cream-300">
                <AuthorCard compact />
                <span className="text-soil-300">·</span>
                {post.published_at && (
                  <time dateTime={post.published_at} itemProp="datePublished">
                    {new Date(post.published_at).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                )}
                {post.read_time && <span>· {post.read_time}</span>}
              </div>

              {post.featured_image && (
                <div className="mt-6 rounded-2xl overflow-hidden bg-cream-200">
                  <img src={post.featured_image} alt={post.title} className="w-full object-cover max-h-96" itemProp="image" />
                </div>
              )}
            </header>

            <div className="prose prose-forest max-w-none">
              {renderContent(post.content)}
            </div>

            {/* Accordion FAQ Section */}
            {faqItems.length > 0 && (
              <section id="faq" aria-labelledby="faq-heading" className="mt-12">
                <h2 id="faq-heading" className="text-2xl font-display font-bold text-forest-800 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqItems.map((item, i) => (
                    <details
                      key={i}
                      className="group bg-white border border-cream-300 rounded-xl"
                      itemScope
                      itemType="https://schema.org/Question"
                    >
                      <summary
                        className="flex justify-between items-center gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-forest-800 hover:text-forest-600"
                        itemProp="name"
                      >
                        {item.question}
                        <span className="text-gold-500 flex-shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <div
                        className="px-5 pb-4 text-sm text-soil-600 leading-relaxed border-t border-cream-200"
                        itemProp="acceptedAnswer"
                        itemScope
                        itemType="https://schema.org/Answer"
                      >
                        <div itemProp="text">{item.answer}</div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Author Card Bio */}
            <div className="mt-12">
              <AuthorCard />
            </div>

            {/* Related Posts */}
            {related.length > 0 && (
              <RelatedPosts posts={related as any} />
            )}

            {/* CTA Box */}
            <div className="mt-12 bg-forest-700 text-white rounded-2xl p-8 text-center">
              <h2 className="font-display text-2xl font-bold mb-3">Get personalized soil advice</h2>
              <p className="text-cream-400 mb-6">Free precision fertilizer recommendations for your county and crop.</p>
              <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">
                Get Free Advice →
              </Link>
            </div>
          </article>

          {/* Sidebar TOC */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} />
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
