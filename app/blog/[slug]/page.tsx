import posts from '@/data/blog.json';
import JsonLd from '@/components/JsonLd';
import siteMeta from '@/data/site-meta.json';
import { buildArticleLd, buildBreadcrumbLd, type BlogPostLite } from '@/lib/structuredData';
import Link from 'next/link';
import BlogPostClient from '@/components/BlogPostClient';

export function generateStaticParams() {
  return (posts as BlogPostLite[])
    .filter(p => p.published !== false)
    .map(p => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const all = posts as BlogPostLite[];
  const post = all.find(p => p.slug === params.slug);

  if (!post || post.published === false) {
    // Could render a NotFound here, but keep the UI minimal
    return (
      <section>
        <p className="text-neutral-400">Post not found.</p>
        <Link href="/blog" className="inline-block mt-4 rounded-lg border border-neutral-800 px-4 py-2 hover:border-primary">
          ← Back to blog
        </Link>
      </section>
    );
  }

  const articleLd = buildArticleLd({ site: siteMeta as any, post });
  const breadcrumbLd = buildBreadcrumbLd({
    site: siteMeta as any,
    trail: [
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: post.title, href: `/blog/${post.slug}` }
    ]
  });

  return (
    <section className="max-w-3xl mx-auto">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />

      <BlogPostClient slug={params.slug} initial={post as any} />
    </section>
  );
}