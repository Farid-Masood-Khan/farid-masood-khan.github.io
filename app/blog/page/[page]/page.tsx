import posts from '@/data/blog.json';
import type { BlogRecord } from '@/lib/search';
import Link from 'next/link';
import { paginate } from '@/lib/paginate';

const PER_PAGE = 6;

export default function BlogPagePaged({ params }: { params: { page: string } }) {
  const pageNum = Math.max(1, parseInt(params.page || '1', 10) || 1);

  const all = posts as unknown as BlogRecord[];
  const published = all.filter(p => p.published !== false);
  const sorted = published.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  const pageData = paginate(sorted, pageNum, PER_PAGE);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold">Blog</h1>
        <Link href="/blog" className="text-sm hover:text-primary">Search &amp; filters →</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {pageData.items.map(p => (
          <article key={p.id} className="rounded-xl border border-neutral-800 p-4 hover:border-primary transition">
            <h3 className="text-lg font-bold">
              <Link href={`/blog/${p.slug}`} className="underline hover:no-underline">
                {p.title}
              </Link>
            </h3>
            <p className="text-xs text-neutral-500 mt-1">{new Date(p.date).toDateString()}</p>
            {p.summary && <p className="text-neutral-300 text-sm mt-2">{p.summary}</p>}
            {p.tags && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-neutral-900 border border-neutral-800">{t}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Link
          href={`/blog/page/${Math.max(1, pageData.page - 1)}`}
          className={`rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary ${pageData.page === 1 ? 'pointer-events-none opacity-50' : ''}`}
        >
          ← Prev
        </Link>
        <span className="text-sm text-neutral-400">Page {pageData.page} of {pageData.pages}</span>
        <Link
          href={`/blog/page/${Math.min(pageData.pages, pageData.page + 1)}`}
          className={`rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary ${pageData.page >= pageData.pages ? 'pointer-events-none opacity-50' : ''}`}
        >
          Next →
        </Link>
      </div>
    </section>
  );
}

export function generateStaticParams() {
  const published = (posts as unknown as BlogRecord[]).filter(p => p.published !== false);
  const pages = Math.max(1, Math.ceil(published.length / PER_PAGE));
  return Array.from({ length: pages }, (_, i) => ({ page: String(i + 1) }));
}