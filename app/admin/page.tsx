'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { LS_KEYS, readLocal, writeLocal } from '@/lib/storage';
import siteMetaSeed from '@/data/site-meta.json';
import projectsSeed from '@/data/projects.json';
import blogSeed from '@/data/blog.json';
import { Blog, Projects } from '@/lib/schemas';

type SiteMeta = typeof siteMetaSeed;

const DEMO_EMAIL = 'admin@local';
const DEMO_PASS = 'admin123';

function useUndoStack<T>(initial: T, limit = 5) {
  const [state, setState] = useState<T>(initial);
  const stackRef = useRef<T[]>([]);
  function push(next: T) {
    stackRef.current = [state, ...stackRef.current].slice(0, limit);
    setState(next);
  }
  function undo() {
    const [last, ...rest] = stackRef.current;
    if (last !== undefined) {
      stackRef.current = rest;
      setState(last);
    }
  }
  return { state, setState: push, undo, canUndo: stackRef.current.length > 0, rawSet: setState };
}

function TextInput(props: any) {
  return (
    <input
      {...props}
      className={`mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${props.className || ''}`}
    />
  );
}

function TextArea(props: any) {
  return (
    <textarea
      {...props}
      className={`mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${props.className || ''}`}
    />
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [tab, setTab] = useState<'content' | 'meta'>('content');
  const [lastSaved, setLastSaved] = useState<string>('');

  // Load initial data (from localStorage or seed)
  const initialMeta: SiteMeta = useMemo(() => {
    if (typeof window === 'undefined') return siteMetaSeed as SiteMeta;
    return readLocal<SiteMeta>(LS_KEYS.siteMeta) || (siteMetaSeed as SiteMeta);
  }, []);
  const initialProjects = useMemo(() => {
    if (typeof window === 'undefined') return projectsSeed as any[];
    return readLocal(LS_KEYS.projects) || (projectsSeed as any[]);
  }, []);
  const initialBlog = useMemo(() => {
    if (typeof window === 'undefined') return blogSeed as any[];
    return readLocal(LS_KEYS.blog) || (blogSeed as any[]);
  }, []);

  const meta = useUndoStack<SiteMeta>(initialMeta);
  const projects = useUndoStack<any[]>(initialProjects);
  const posts = useUndoStack<any[]>(initialBlog);

  // Demo session
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.adminSession);
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);

  // Autosave (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      writeLocal(LS_KEYS.siteMeta, meta.state);
      writeLocal(LS_KEYS.projects, projects.state);
      writeLocal(LS_KEYS.blog, posts.state);
      setLastSaved(new Date().toLocaleTimeString());
    }, 400);
    return () => clearTimeout(t);
  }, [meta.state, projects.state, posts.state]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    if (email === DEMO_EMAIL && password === DEMO_PASS) {
      const sess = { email };
      setSession(sess);
      writeLocal(LS_KEYS.adminSession, sess);
    } else {
      alert('Invalid credentials (hint: admin@local / admin123)');
    }
  }

  function logout() {
    setSession(null);
    try { localStorage.removeItem(LS_KEYS.adminSession); } catch {}
  }

  function validateAndSetProjects(next: any[]) {
    const parsed = Projects.safeParse(next);
    if (!parsed.success) {
      console.error(parsed.error);
      alert('Projects validation failed. Check console for details.');
      return;
    }
    projects.setState(parsed.data);
  }

  function validateAndSetBlog(next: any[]) {
    const parsed = Blog.safeParse(next);
    if (!parsed.success) {
      console.error(parsed.error);
      alert('Blog validation failed. Check console for details.');
      return;
    }
    posts.setState(parsed.data);
  }

  function exportAll() {
    const data = {
      meta: meta.state,
      projects: projects.state,
      blog: posts.state
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importAll(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || '{}'));
        if (data.meta) meta.setState(data.meta);
        if (data.projects) validateAndSetProjects(data.projects);
        if (data.blog) validateAndSetBlog(data.blog);
      } catch (e) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  }

  

  if (!session) {
    return (
      <section className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold">Admin</h1>
        <div className="rounded-xl border border-neutral-800 p-4">
          <p className="text-xs text-amber-400 mb-3">Demo only — not for production auth.</p>
          <form onSubmit={login} className="space-y-3">
            <label className="block">
              <span className="text-sm text-neutral-400">Email</span>
              <TextInput name="email" defaultValue="admin@local" />
            </label>
            <label className="block">
              <span className="text-sm text-neutral-400">Password</span>
              <TextInput name="password" type="password" defaultValue="admin123" />
            </label>
            <button type="submit" className="rounded-xl bg-primary px-5 py-2 font-semibold text-white">
              Sign in
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Admin</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">Last saved: {lastSaved || '—'}</span>
          <button onClick={exportAll} className="rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary">Export</button>
          <label className="rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary cursor-pointer">
            Import
            <input type="file" accept="application/json" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importAll(f);
            }} />
          </label>
          <button onClick={logout} className="rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary">Sign out</button>
        </div>
      </div>

      <p className="text-xs text-amber-400">Demo only — not for production auth.</p>

      <div className="flex gap-2">
        <button
          className={`rounded-lg border px-3 py-1 ${tab === 'content' ? 'border-primary' : 'border-neutral-800 hover:border-primary'}`}
          onClick={() => setTab('content')}
        >Content</button>
        <button
          className={`rounded-lg border px-3 py-1 ${tab === 'meta' ? 'border-primary' : 'border-neutral-800 hover:border-primary'}`}
          onClick={() => setTab('meta')}
        >Site Meta</button>
      </div>

      {tab === 'content' ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-neutral-800 p-4">
            <h2 className="font-bold mb-3">Projects</h2>
            <button
              onClick={() => {
                const next = [
                  ...projects.state,
                  {
                    id: Date.now(),
                    title: 'Untitled Project',
                    slug: `project-${projects.state.length + 1}`,
                    description: 'Describe your project…',
                    tags: [],
                    stars: 0
                  }
                ];
                validateAndSetProjects(next);
              }}
              className="mb-3 rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary"
            >Add New</button>

            <ul className="space-y-3">
              {projects.state.map((p: any, i: number) => (
                <li key={p.id} className="border border-neutral-800 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <strong className="flex-1">{p.title}</strong>
                    <button
                      onClick={() => {
                        if (!confirm('Delete this project?')) return;
                        const next = projects.state.filter((_, idx) => idx !== i);
                        validateAndSetProjects(next);
                      }}
                      className="text-sm text-rose-400 hover:text-rose-300"
                    >Delete</button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <label className="block"><span className="text-xs text-neutral-400">Title</span>
                      <TextInput value={p.title} onChange={(e: any) => {
                        const next = [...projects.state]; next[i] = { ...p, title: e.target.value }; validateAndSetProjects(next);
                      }} /></label>
                    <label className="block"><span className="text-xs text-neutral-400">Slug</span>
                      <TextInput value={p.slug} onChange={(e: any) => {
                        const next = [...projects.state]; next[i] = { ...p, slug: e.target.value }; validateAndSetProjects(next);
                      }} /></label>
                    <label className="block sm:col-span-2"><span className="text-xs text-neutral-400">Description</span>
                      <TextArea rows={3} value={p.description} onChange={(e: any) => {
                        const next = [...projects.state]; next[i] = { ...p, description: e.target.value }; validateAndSetProjects(next);
                      }} /></label>
                    <label className="block"><span className="text-xs text-neutral-400">Repo URL</span>
                      <TextInput value={p.repoUrl || ''} onChange={(e: any) => {
                        const next = [...projects.state]; next[i] = { ...p, repoUrl: e.target.value }; validateAndSetProjects(next);
                      }} /></label>
                    <label className="block"><span className="text-xs text-neutral-400">Demo URL</span>
                      <TextInput value={p.demoUrl || ''} onChange={(e: any) => {
                        const next = [...projects.state]; next[i] = { ...p, demoUrl: e.target.value }; validateAndSetProjects(next);
                      }} /></label>
                    <label className="block"><span className="text-xs text-neutral-400">Tags (comma‑sep)</span>
                      <TextInput value={(p.tags || []).join(', ')} onChange={(e: any) => {
                        const next = [...projects.state]; next[i] = { ...p, tags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }; validateAndSetProjects(next);
                      }} /></label>
                    <label className="block"><span className="text-xs text-neutral-400">Stars</span>
                      <TextInput type="number" value={p.stars || 0} onChange={(e: any) => {
                        const next = [...projects.state]; next[i] = { ...p, stars: Number(e.target.value) || 0 }; validateAndSetProjects(next);
                      }} /></label>
                  </div>
                </li>
              ))}
            </ul>

            {projects.canUndo && (
              <button onClick={projects.undo} className="mt-3 rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary">Undo</button>
            )}
          </div>

          <div className="rounded-xl border border-neutral-800 p-4">
            <h2 className="font-bold mb-3">Blog Posts</h2>
            <button
              onClick={() => {
                const next = [
                  ...posts.state,
                  {
                    id: Date.now(),
                    title: 'Untitled Post',
                    slug: `post-${posts.state.length + 1}`,
                    date: new Date().toISOString().slice(0,10),
                    tags: [],
                    summary: '',
                    bodyMarkdown: '# Title\n\nWrite here…',
                    published: false
                  }
                ];
                validateAndSetBlog(next);
              }}
              className="mb-3 rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary"
            >Add New</button>

            <ul className="space-y-3">
              {posts.state.map((p: any, i: number) => (
                <li key={p.id} className="border border-neutral-800 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <strong className="flex-1">{p.title}</strong>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-neutral-700">{p.published === false ? 'Draft' : 'Published'}</span>
                    <button
                      onClick={() => {
                        if (!confirm('Delete this post?')) return;
                        const next = posts.state.filter((_, idx) => idx !== i);
                        validateAndSetBlog(next);
                      }}
                      className="text-sm text-rose-400 hover:text-rose-300"
                    >Delete</button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <label className="block"><span className="text-xs text-neutral-400">Title</span>
                      <TextInput value={p.title} onChange={(e: any) => {
                        const next = [...posts.state]; next[i] = { ...p, title: e.target.value }; validateAndSetBlog(next);
                      }} /></label>
                    <label className="block"><span className="text-xs text-neutral-400">Slug</span>
                      <TextInput value={p.slug} onChange={(e: any) => {
                        const next = [...posts.state]; next[i] = { ...p, slug: e.target.value }; validateAndSetBlog(next);
                      }} /></label>
                    <label className="block"><span className="text-xs text-neutral-400">Date (YYYY-MM-DD)</span>
                      <TextInput value={p.date} onChange={(e: any) => {
                        const next = [...posts.state]; next[i] = { ...p, date: e.target.value }; validateAndSetBlog(next);
                      }} /></label>
                    <label className="block"><span className="text-xs text-neutral-400">Tags (comma‑sep)</span>
                      <TextInput value={(p.tags || []).join(', ')} onChange={(e: any) => {
                        const next = [...posts.state]; next[i] = { ...p, tags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }; validateAndSetBlog(next);
                      }} /></label>
                    <label className="block sm:col-span-2"><span className="text-xs text-neutral-400">Summary</span>
                      <TextArea rows={2} value={p.summary || ''} onChange={(e: any) => {
                        const next = [...posts.state]; next[i] = { ...p, summary: e.target.value }; validateAndSetBlog(next);
                      }} /></label>
                    <label className="block sm:col-span-2"><span className="text-xs text-neutral-400">Body (Markdown)</span>
                      <TextArea rows={6} value={p.bodyMarkdown || ''} onChange={(e: any) => {
                        const next = [...posts.state]; next[i] = { ...p, bodyMarkdown: e.target.value }; validateAndSetBlog(next);
                      }} /></label>
                    <label className="block">
                      <span className="text-xs text-neutral-400">Published</span>
                      <input type="checkbox" className="ml-2 align-middle" checked={p.published !== false} onChange={(e: any) => {
                        const next = [...posts.state]; next[i] = { ...p, published: e.target.checked }; validateAndSetBlog(next);
                      }} />
                    </label>
                  </div>
                </li>
              ))}
            </ul>

            {posts.canUndo && (
              <button onClick={posts.undo} className="mt-3 rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary">Undo</button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 p-4 max-w-2xl">
          <h2 className="font-bold mb-3">Site Meta</h2>

          <div className="grid gap-3">
            <label className="block"><span className="text-xs text-neutral-400">Title</span>
              <TextInput value={meta.state.title} onChange={(e: any) => meta.setState({ ...meta.state, title: e.target.value })} /></label>
            <label className="block"><span className="text-xs text-neutral-400">Description</span>
              <TextArea rows={3} value={meta.state.description} onChange={(e: any) => meta.setState({ ...meta.state, description: e.target.value })} /></label>
            <label className="block"><span className="text-xs text-neutral-400">OG Image (path)</span>
              <TextInput value={meta.state.ogImage || ''} onChange={(e: any) => meta.setState({ ...meta.state, ogImage: e.target.value })} /></label>
            <label className="block"><span className="text-xs text-neutral-400">Base URL (canonical)</span>
              <TextInput value={(meta.state as any).baseUrl || ''} onChange={(e: any) => meta.setState({ ...meta.state, baseUrl: e.target.value })} /></label>
          </div>

          {meta.canUndo && (
            <button onClick={meta.undo} className="mt-3 rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary">Undo</button>
          )}

          <p className="mt-3 text-sm text-neutral-400">Changes apply immediately on the client and persist to localStorage.</p>
        </div>
      )}
    </section>
  );
}