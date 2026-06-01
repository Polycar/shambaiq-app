import Link from "next/link";
import { BlogPost } from "@/lib/blog-data";

interface RelatedPostsProps {
  posts: BlogPost[];
  heading?: string;
}

export default function RelatedPosts({ posts, heading = "Continue Reading" }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="mt-12 pt-8 border-t border-cream-300" aria-label="Related articles">
      <h2 className="text-lg font-display font-bold text-forest-800 mb-5">{heading}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white border border-cream-300 rounded-xl p-5 hover:border-gold-400 hover:shadow-sm transition-all duration-150"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-700 mb-2 block">
              {post.category}
            </span>
            <h3 className="text-sm font-semibold text-forest-800 leading-snug group-hover:text-gold-700 transition-colors">
              {post.title}
            </h3>
            <p className="text-xs text-soil-500 mt-2 line-clamp-2">{post.metaDescription}</p>
            <span className="text-xs text-gold-700 font-medium mt-3 block">
              {post.readingTimeMin} min read →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
