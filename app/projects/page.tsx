'use client';

import { useEffect, useMemo, useState } from 'react';
import projectsSeed from '@/data/projects.json';
import { searchProjects, type ProjectRecord } from '@/lib/search';
import SearchInput from '@/components/SearchInput';
import TagChips from '@/components/TagChips';
import SortMenu from '@/components/SortMenu';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { LS_KEYS, readLocal } from '@/lib/storage';
import Markdown from '@/components/Markdown';
import Modal from '@/components/Modal';

export default function ProjectsPage() {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<'relevance' | 'stars' | 'title'>('relevance');
  const [openReadme, setOpenReadme] = useState<number | null>(null);

  const [all, setAll] = useState<ProjectRecord[]>(projectsSeed as unknown as ProjectRecord[]);
  useEffect(() => {
    const local = readLocal<ProjectRecord[]>(LS_KEYS.projects);
    if (local && Array.isArray(local)) setAll(local as any);
  }, []);

  const qDebounced = useDebouncedValue(q, 250);

  const allTags = all.flatMap(p => p.tags || []);

  const searched = useMemo(() => searchProjects(all, qDebounced, tag), [all, qDebounced, tag]);

  const results = useMemo(() => {
    const copy = [...searched];
    if (sort === 'stars') {
      copy.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    } else if (sort === 'title') {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    } // relevance = keep search order
    return copy;
  }, [searched, sort]);

  const active = results.find(r => r.id === openReadme);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-extrabold">Projects</h1>
        <SortMenu
          value={sort}
          onChange={(v) => setSort(v as any)}
          options={[
            { value: 'relevance', label: 'Relevance' },
            { value: 'stars', label: 'Stars' },
            { value: 'title', label: 'Title (A–Z)' }
          ]}
        />
      </div>

      <SearchInput
        value={q}
        onChange={setQ}
        persistKey="farid.search.projects"
        placeholder="Search projects by title, tags, language…"
      />

      <TagChips tags={allTags} active={tag} onChange={setTag} />

      <p className="text-sm text-neutral-400">
        {results.length} result{results.length === 1 ? '' : 's'}
      </p>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {results.map(pr => (
          <article key={pr.id} className="rounded-xl border border-neutral-800 p-4 hover:border-primary transition">
            <h3 className="text-lg font-bold">{pr.title}</h3>
            <p className="text-neutral-400 text-sm mt-1">{pr.description}</p>
            {pr.tags && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pr.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-neutral-900 border border-neutral-800">{t}</span>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-3 text-sm">
              {pr.repoUrl && <a className="underline hover:no-underline" href={pr.repoUrl} target="_blank">Repo</a>}
              {pr.demoUrl && <a className="underline hover:no-underline" href={pr.demoUrl} target="_blank">Demo</a>}
              {'stars' in pr && pr.stars !== undefined && (
                <span className="ml-auto text-neutral-500">★ {pr.stars}</span>
              )}
            </div>
            {pr.readme && (
              <div className="mt-3">
                <button
                  onClick={() => setOpenReadme(pr.id)}
                  className="text-xs rounded-lg border border-neutral-800 px-2 py-1 hover:border-primary"
                >
                  Preview README
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <Modal
        open={openReadme !== null && !!active}
        onClose={() => setOpenReadme(null)}
        title={active?.title ? `${active.title} — README` : 'README'}
      >
        <div className="md-prose">
          <Markdown content={active?.readme || 'No README provided.'} />
        </div>
      </Modal>
    </section>
  );
}