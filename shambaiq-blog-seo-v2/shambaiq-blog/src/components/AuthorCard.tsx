import Link from "next/link";

interface AuthorCardProps {
  compact?: boolean; // compact = single line for article header; full = sidebar bio
}

export default function AuthorCard({ compact = false }: AuthorCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm text-soil-400">
        <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          PA
        </div>
        <div>
          <Link href="/about" className="font-medium text-forest-700 hover:text-gold-600 transition-colors">
            Polycarp Andabwa
          </Link>
          <span className="mx-1.5 text-soil-300">·</span>
          <span>MSc agricultural environmental engineering</span>
          <span className="mx-1.5 text-soil-300">·</span>
          <span>founder, ShambaIQ</span>
        </div>
      </div>
    );
  }

  return (
    <aside
      className="bg-cream-100 border border-cream-300 rounded-2xl p-6 mt-10"
      aria-label="About the author"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-forest-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          PA
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-1">
            Written by
          </p>
          <Link
            href="/about"
            className="text-lg font-display font-bold text-forest-800 hover:text-gold-600 transition-colors"
          >
            Polycarp Andabwa
          </Link>
          <p className="text-sm text-soil-500 mt-1 leading-relaxed">
            MSc agricultural environmental engineering,{" "}
            <span className="text-forest-700 font-medium">University of Debrecen</span>. 
            Founder of ShambaIQ — Kenya&rsquo;s precision soil intelligence platform built 
            on precision 30-metre satellite soil mapping. Former researcher in geostatistical 
            heavy-metal soil analysis. Coursera SEO certified.
          </p>

          {/* Credential badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "MSc agri. environmental engineering",
              "BBA",
              "EASA licensed drone pilot",
              "SEO expert",
            ].map((badge) => (
              <span
                key={badge}
                className="text-xs bg-white border border-cream-300 text-soil-500 px-2.5 py-1 rounded-full font-medium"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
