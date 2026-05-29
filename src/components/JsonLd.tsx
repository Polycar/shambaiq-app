// Injects one or more JSON-LD blocks as <script type="application/ld+json">
// Usage: <JsonLd schemas={[articleSchema, breadcrumbSchema, faqSchema]} />
// Google recommends one script tag per schema type on the same page.

interface JsonLdProps {
  schemas: object | object[];
}

export default function JsonLd({ schemas }: JsonLdProps) {
  const list = Array.isArray(schemas) ? schemas : [schemas];
  return (
    <>
      {list.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
    </>
  );
}
