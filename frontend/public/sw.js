const CACHE_NAME = 'wa-pdf-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(()=>{})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle GET
  if (req.method !== 'GET') return;

  // Try network first, fallback to cache
  event.respondWith(
    fetch(req).then((res) => {
      // optionally cache responses for same-origin
      if (res && res.status === 200 && req.url.startsWith(self.location.origin)) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
      }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/')))
  );
});
