import Link from "next/link";
import JsonLd from "./JsonLd";
import { makeBreadcrumbSchema, BreadcrumbItem } from "@/lib/schema";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

// ── Visual breadcrumbs ────────────────────────────────────────────────────────
// Renders <nav aria-label="breadcrumb"> matching exactly the BreadcrumbList
// schema so Google can verify both the visual and structured data are aligned.
// ─────────────────────────────────────────────────────────────────────────────

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = makeBreadcrumbSchema(items);

  return (
    <>
      <JsonLd schemas={schema} />
      <nav aria-label="breadcrumb" className="breadcrumbs-nav">
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex flex-wrap items-center gap-1 text-sm text-soil-400"
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li
                key={item.url}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-1"
              >
                {isLast ? (
                  // Last crumb — current page, no link (aria-current)
                  <span
                    itemProp="name"
                    aria-current="page"
                    className="text-forest-700 font-medium truncate max-w-[200px]"
                  >
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.url}
                      itemProp="item"
                      className="hover:text-gold-600 transition-colors duration-150"
                    >
                      <span itemProp="name">{item.name}</span>
                    </Link>
                    {/* Separator — decorative, hidden from screen readers */}
                    <span aria-hidden="true" className="text-soil-300 select-none">
                      /
                    </span>
                  </>
                )}
                {/* Hidden position meta for Microdata fallback */}
                <meta itemProp="position" content={String(i + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
