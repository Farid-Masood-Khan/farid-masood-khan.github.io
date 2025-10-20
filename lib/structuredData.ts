// Offline JSON-LD builders for Person, Article, Breadcrumb
// Works with static export (no network).

export type SiteMeta = {
  title: string;
  description: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
  baseUrl?: string; // optional, e.g. "https://faridmasood.com"
};

export type BlogPostLite = {
  title: string;
  slug: string;
  date: string;            // ISO date string "2025-06-18"
  tags?: string[];
  summary?: string;
  bodyMarkdown?: string;
  published?: boolean;
};

export function buildPersonLd({
  name,
  description,
  email,
  url,
  image,
  sameAs = [],
  locality,
  region,
  country
}: {
  name: string;
  description: string;
  email: string;
  url: string;
  image?: string;
  sameAs?: string[];
  locality?: string;
  region?: string;
  country?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description,
    email: `mailto:${email}`,
    url,
    image,
    sameAs,
    address: locality || region || country ? {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressRegion: region,
      addressCountry: country
    } : undefined
  };
}

export function buildArticleLd({
  site,
  post,
  authorName = "Muhammad Farid Masood Khan"
}: {
  site: SiteMeta;
  post: BlogPostLite;
  authorName?: string;
}) {
  const base = site.baseUrl?.replace(/\/$/, "") || "https://example.com";
  const url = `${base}/blog/${post.slug}`;
  const headline = post.title;
  // If you have an OG image per post, inject it here; otherwise fallback to site OG
  const image = site.ogImage ? [`${base}${site.ogImage}`] : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline,
    author: { "@type": "Person", "name": authorName },
    datePublished: post.date,
    dateModified: post.date,
    image,
    keywords: (post.tags || []).join(", "),
    description: post.summary || "",
    url
  };
}

export function buildBreadcrumbLd({
  site,
  trail
}: {
  site: SiteMeta;
  trail: Array<{ name: string; href: string }>;
}) {
  const base = site.baseUrl?.replace(/\/$/, "") || "https://example.com";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${base}${t.href}`
    }))
  };
}