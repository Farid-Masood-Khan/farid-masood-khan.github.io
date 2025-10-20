# Muhammad Farid Masood Khan — Offline Portfolio

Offline-only personal portfolio built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Framer Motion. No external APIs or remote assets; all content is local (JSON + localStorage). Admin area (demo only) lets you edit projects, blog posts, and site meta in the browser with persistence to localStorage.

Highlights:
- 100% offline, static export (`output: 'export'`)
- Dark, glassy UI with smooth motion and accessible navigation
- Blog, Projects, CV viewer, Hire form (stores to localStorage + mailto)
- Local Admin with CRUD + import/export, Zod validation and autosave
- SEO-ready metadata + JSON-LD, `robots.txt`, generated `sitemap.xml`
- RSS feed generated at `public/feed.xml` (linked in `<head>`)
- Optional PWA: service worker + manifest for offline caching of core pages

## Quick start

1) Install
- Node 18+
- npm i

2) Dev
- npm run dev
- Open http://localhost:3000

3) Static export
- npm run build && npm run export
- Open `out/index.html` in a browser (works offline)

## Project structure

- app/
  - page.tsx (Home)
  - about/page.tsx
  - projects/page.tsx
  - blog/page.tsx (search/filters)
  - blog/page/[page]/page.tsx (static pagination)
  - blog/tag/[tag]/page.tsx (static tag list pages)
  - blog/[slug]/page.tsx (post detail)
  - cv/page.tsx (PDF viewer)
  - hire/page.tsx (contact form)
  - admin/page.tsx (demo-only local admin; also aliased as /admin/admin/123/rrr/poi/xx/admin)
  - error.tsx, not-found.tsx
- components/ (UI bits, search inputs, markdown, JSON-LD injector)
- lib/ (schemas, search, pagination, structured data, storage helpers)
- data/
  - projects.json
  - blog.json
  - site-meta.json
- public/
  - robots.txt
  - feed.xml (generated)
  - manifest.webmanifest (PWA)
  - sw.js (PWA service worker)
  - offline.html (offline fallback page)
  - cv/README.txt (put `Farid_Masood_CV.pdf` here)
  - og/ (create `og-image.png` here)
- scripts/
  - validate-content.mjs (Zod content check)
  - generate-sitemap.mjs (creates public/sitemap.xml excluding admin, draft posts)
  - generate-rss.mjs (creates public/feed.xml from published posts)

## Editing content (local JSON)

- Projects: data/projects.json
- Blog: data/blog.json
- Site Meta: data/site-meta.json

All pages import JSON via ES imports. On client, if a corresponding localStorage key exists, pages will prefer the localStorage copy.

LocalStorage keys:
- `farid.site.meta` → `{ title, description, ogImage, baseUrl?, jsonLd? }`
- `farid.projects` → array like `projects.json`
- `farid.blog` → array like `blog.json`
- `farid.admin.session` → `{ email }` (demo only)
- `farid.hire.inbox` → array of submitted messages

## Admin (demo only)

- Visit /admin (or the deep alias).
- Login: email `admin@local`, password `admin123`.
- Tabs:
  - Content: CRUD for Projects and Blog (with autosave, Undo, Zod validation).
  - Site Meta: edit title, description, OG image, base URL (canonical).
- Import/Export: download full site content as JSON; upload to replace (with validation).
- Note: New blog posts created in Admin after you export won’t have pre-rendered slug pages. Re-export to add them as static routes.

## Blog

- Markdown is rendered client-side with `marked` and sanitized with `dompurify`.
- Drafts: `published: false` are hidden by default. Use “Preview drafts” toggle on the blog list.
- Static routes are generated for:
  - `/blog/page/1..N` (pagination, 6 per page)
  - `/blog/tag/[tag]` (from tags of published posts)
  - `/blog/[slug]` (published posts only)

## CV

- Put your PDF at `public/cv/Farid_Masood_CV.pdf`.
- If missing, the page shows a friendly message and a placeholder link.

## SEO

- Next Metadata API default values are set from `data/site-meta.json`.
- Admin changes to site meta apply on the client at runtime via a simple head-updater.
- JSON-LD:
  - Person on Home/About (see lib/structuredData.ts and components/JsonLd.tsx).
  - Article + Breadcrumb on Blog posts.
- Robots, Sitemap, and RSS:
  - `public/robots.txt` blocks `/admin*`.
  - `scripts/generate-sitemap.mjs` creates `public/sitemap.xml` excluding admin and draft posts.
  - `scripts/generate-rss.mjs` creates `public/feed.xml` (RSS 2.0). A `<link rel="alternate" type="application/rss+xml">` is added in layout.
  - Set `SITE_BASE_URL=https://yourdomain.com` when generating the sitemap and RSS for production URLs.

## Accessibility

- Keyboard-accessible nav and focus outlines
- Skip-to-content link
- WCAG-minded color contrast
- Respects prefers-reduced-motion for calmer animations

## Build discipline

- ESLint + Prettier configs (`npm run lint`, `npm run format`)
- Pre-build Zod validation for JSON (`npm run validate:content`)
- Static export (no server-only APIs, no remote fetch)

## Theming and motion

- Theme toggle supports System/Dark/Light; persists in localStorage and respects system preference.
- Animations are mild and respect `prefers-reduced-motion`.

## Images

- Keep images in `public/images` and reference with `next/image` using fixed `width`/`height` to avoid CLS.
- Do not use remote images; if content contains remote URLs, replace locally.

## Notes

- No external API calls or external fonts. System font stack only.
- To update canonical/OG image origins, set `baseUrl` in `data/site-meta.json` (or via Admin → Site Meta).