const CACHE_NAME = 'farid-portfolio-v1';
const CORE_ASSETS = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/cv',
  '/hire',
  '/robots.txt',
  '/sitemap.xml',
  '/feed.xml',
  '/offline.html'
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: offline-first, no network fetch to comply with "no HTTP(s) at runtime)"
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      // For navigations or HTML requests not in cache, show offline fallback
      if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
        return caches.match('/offline.html');
      }

      // For other non-cached assets, just fail quietly (no network)
      return new Response('', { status: 504, statusText: 'Offline' });
    })
  );
});