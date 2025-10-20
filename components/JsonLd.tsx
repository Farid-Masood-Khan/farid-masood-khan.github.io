'use client';

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Stringify at render to avoid hydration mismatch in app router
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}