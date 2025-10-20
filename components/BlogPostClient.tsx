'use client';

import { useEffect, useState } from 'react';
import { LS_KEYS, readLocal } from '@/lib/storage';
import type { BlogRecord } from '@/lib/search';
import Markdown from '@/components/Markdown';
import Link from 'next/link';

export default function BlogPostClient({
  slug,
  initial
}: {
  slug: string;
  initial: BlogRecord;
}) {
  const [post, setPost] = useState<BlogRecord>(initial);

  useEffect(() => {
    const local = readLocal<BlogRecord[]>(LS_KEYS.blog);
    if (local && Array.isArray(local)) {
      const found = (local as BlogRecord[]).find((p) => p.slug === slug);
      if (found) setPost(found);
    }
  }, [slug]);

  return (
    <>
      <h1 className="text-3xl font-extrabold mb-2">{post.title}</h1>
      <p className="text-sm text-neutral-400">{new Date(post.date).toDateString()}</p>
      {post.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link
              key={t}
              className="px-2 py-0.5 text-xs rounded-full bg-neutral-900 border border-neutral-800 hover:border-primary"
              href={`/blog/tag/${encodeURIComponent(t)}`}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null}
      <div className="mt-6">
        <Markdown content={post.bodyMarkdown || ''} />
      </div>
      <div className="mt-8">
        <Link href="/blog" className="rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary">
          ← Back to blog
        </Link>
      </div>
    </>
  );
}