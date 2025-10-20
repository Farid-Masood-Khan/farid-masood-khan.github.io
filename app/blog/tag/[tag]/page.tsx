import posts from '@/data/blog.json';
import type { BlogRecord } from '@/lib/search';
import Link from 'next/link';

export default function BlogTagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag || '');
  const all = posts as unknown as BlogRecord[];
  const filtered = all
    .filter(p => p.published !== false)
    .filter(p => (p.tags || []).map(t => t.toLowerCase()).includes(tag.toLowerCase()))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Posts tagged “{tag}”</h1>
        <Link href="/blog" className="text-sm hover:text-primary">← All posts</Link>
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-400">No posts yet for this tag.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(p => (
            <article key={p.id} className="rounded-xl border border-neutral-800 p-4 hover:border-primary transition">
              <h3 className="text-lg font-bold">
                <Link href={`/blog/${p.slug}`} className="underline hover:no-underline">
                  {p.title}
                </Link>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">{new Date(p.date).toDateString()}</p>
              {p.summary && <p className="text-neutral-300 text-sm mt-2">{p.summary}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function generateStaticParams() {
  const all = posts as unknown as BlogRecord[];
  const tags = new Set<string>();
  for (const p of all) {
    if (p.published === false) continue;
    for (const t of (p.tags || [])) tags.add(t);
  }
  return Array.from(tags).map(t => ({ tag: t }));
}