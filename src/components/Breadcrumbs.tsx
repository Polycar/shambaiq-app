import Link from "next/link";
import JsonLd from "./JsonLd";

interface BreadcrumbItem {
  label?: string;
  name?: string;
  href?: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Normalize each crumb so both name/url and label/href are supported
  const normalizedItems = items.map(item => ({
    name: item.name || item.label || "",
    url: item.url || item.href || "",
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: normalizedItems.map((item, i) => {
      const element: any = {
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
      };
      if (item.url) {
        element.item = item.url.startsWith("http")
          ? item.url
          : `https://shambaiq.com${item.url}`;
      }
      return element;
    }),
  };

  return (
    <>
      <JsonLd schemas={jsonLd} />
      <nav aria-label="breadcrumb" className="text-sm text-soil-500 mb-6">
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex flex-wrap items-center gap-1.5"
        >
          {normalizedItems.map((item, i) => {
            const isLast = i === normalizedItems.length - 1;
            return (
              <li
                key={i}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-1.5"
              >
                {i > 0 && (
                  <span aria-hidden="true" className="text-cream-400 select-none">
                    ›
                  </span>
                )}
                {isLast || !item.url ? (
                  <span
                    itemProp="name"
                    aria-current="page"
                    className="text-forest-700 font-medium truncate max-w-[200px]"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    itemProp="item"
                    className="hover:text-gold-700 transition-colors duration-150"
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                )}
                <meta itemProp="position" content={String(i + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
