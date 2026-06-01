const CACHE_VERSION = 'shambaiq-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

// Core app shell — always cached at install
const STATIC_ASSETS = [
  '/',
  '/app',
  '/soil',
  '/crops',
  '/offline',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate: clean up old caches ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('shambaiq-') && k !== STATIC_CACHE && k !== PAGE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch strategy ──────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin API calls
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin && !url.pathname.startsWith('/api')) return;
  // Skip Next.js internal routes and analytics
  if (url.pathname.startsWith('/_next/') && url.pathname.includes('webpack')) return;
  if (url.hostname.includes('google-analytics') || url.hostname.includes('googleapis')) return;

  // API calls: network-first, no cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline — no cached data for this request' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Static assets (_next/static): cache-first forever
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Navigation and soil/crop/blog pages: network-first, fallback to cache, then /offline
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful page navigations for offline use
        if (response.ok && request.mode === 'navigate') {
          const clone = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          // Return offline page for navigations, nothing for assets
          if (request.mode === 'navigate') {
            return caches.match('/offline');
          }
        })
      )
  );
});
