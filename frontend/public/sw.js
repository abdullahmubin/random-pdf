// Avoid aggressive caching on localhost during development.
const DEV_HOSTNAMES = ['localhost', '127.0.0.1'];
const IS_DEV = DEV_HOSTNAMES.includes(self.location.hostname);

if (IS_DEV) {
  // No-op service worker for development: don't cache assets, just passthrough.
  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    // Claim clients so the SW is active immediately but it won't cache.
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener('fetch', (event) => {
    // Always try network and do not store responses in cache.
    event.respondWith(fetch(event.request));
  });

} else {
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
    if (req.method !== 'GET') return;

    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.status === 200 && req.url.startsWith(self.location.origin)) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/')))
    );
  });

}
