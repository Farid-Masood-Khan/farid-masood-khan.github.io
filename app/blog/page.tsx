'use client';

import { useEffect, useMemo, useState } from 'react';
import postsSeed from '@/data/blog.json';
import { searchBlog, type BlogRecord } from '@/lib/search';
import SearchInput from '@/components/SearchInput';
import TagChips from '@/components/TagChips';
import SortMenu from '@/components/SortMenu';
import Link from 'next/link';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { paginate } from '@/lib/paginate';
import { LS_KEYS, readLocal } from '@/lib/storage';
import { useSearchParams } from 'next/navigation';

const PER_PAGE = 6;

export default function BlogPage() {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<boolean>(() => {
    try { return localStorage.getItem('farid.blog.preview') === '1'; } catch { return false; }
  });

  // newest by default; title + relevance optional
  const [sort, setSort] = useState<'newest' | 'title' | 'relevance'>('newest');

  const [all, setAll] = useState<BlogRecord[]>(postsSeed as unknown as BlogRecord[]);
  useEffect(() => {
    const local = readLocal<BlogRecord[]>(LS_KEYS.blog);
    if (local && Array.isArray(local)) setAll(local as any);
  }, []);

  // Support ?preview=1 to toggle drafts preview
  const sp = useSearchParams();
  useEffect(() => {
    const pv = sp.get('preview');
    if (pv === '1') {
      setPreview(true);
      try { localStorage.setItem('farid.blog.preview', '1'); } catch {}
    } else if (pv === '0') {
      setPreview(false);
      try { localStorage.setItem('farid.blog.preview', '0'); } catch {}
    }
  }, [sp]);

  const qDebounced = useDebouncedValue(q, 250);

  const allTags = all.flatMap(p => p.tags || []);

  // relevance order comes from search; when q is empty, searchBlog returns published (or all if preview)
  const searched = useMemo(() => searchBlog(all, qDebounced, tag, preview), [all, qDebounced, tag, preview]);

  const sorted = useMemo(() => {
    const copy = [...searched];
    if (sort === 'newest') {
      copy.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    } else if (sort === 'title') {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    } // relevance = keep search order
    return copy;
  }, [searched, sort]);

  const pageData = paginate(sorted, 1, PER_PAGE);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-extrabold">Blog</h1>
        <div className="flex items-center gap-4">
          <label className="text-sm text-neutral-400 flex items-center gap-2">
            <input
              type="checkbox"
              checked={preview}
              onChange={(e) => {
                const v = e.target.checked;
                setPreview(v);
                try { localStorage.setItem('farid.blog.preview', v ? '1' : '0'); } catch {}
              }}
            />
            Preview drafts
          </label>
          <SortMenu
            value={sort}
            onChange={(v) => setSort(v as any)}
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'relevance', label: 'Relevance' },
              { value: 'title', label: 'Title (A–Z)' }
            ]}
          />
        </div>
      </div>

      <SearchInput value={q} onChange={setQ} persistKey="farid.search.blog" placeholder="Search posts by title, tags, summary…" />
      <TagChips tags={allTags} active={tag} onChange={setTag} />

      <p className="text-sm text-neutral-400">{sorted.length} post{sorted.length === 1 ? '' : 's'}</p>

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
            {p.published === false && <span className="mt-3 inline-block text-xs text-amber-400">Draft</span>}
          </article>
        ))}
      </div>

      {pageData.pages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <span className="text-sm text-neutral-400">Page 1 of {pageData.pages}</span>
          <Link href={`/blog/page/2`} className="rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary">
            Next →
          </Link>
        </div>
      )}
    </section>
  );
}