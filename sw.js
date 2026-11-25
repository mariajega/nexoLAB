const CACHE_PREFIX = 'nexolab-shell-';
const CACHE_VERSION = 'v3-professional-20261125';
const CACHE = CACHE_PREFIX + CACHE_VERSION;
const SHELL = ['./', './index.html', './manifest.json', './version.json', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // The browser must fetch the worker script directly to detect a new worker version.
  if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('/version.json')) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        // Bypass the HTTP cache so an installed iPhone app receives the current HTML.
        const freshRequest = new Request(request, { cache: 'no-store' });
        const fresh = await fetch(freshRequest);
        if (fresh && fresh.ok) {
          cache.put('./index.html', fresh.clone()).catch(() => {});
          return fresh;
        }
        throw new Error('Navigation request failed');
      } catch (error) {
        return (await caches.match(request)) ||
          (await cache.match('./index.html')) ||
          new Response('NexoLab no está disponible sin conexión.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const fresh = await fetch(request);
      if (fresh && fresh.ok) cache.put(request, fresh.clone()).catch(() => {});
      return fresh;
    } catch (error) {
      return cached || Response.error();
    }
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const client = list.find(item => 'focus' in item);
    if (client) return client.focus();
    if (self.clients.openWindow) return self.clients.openWindow('./');
  }));
});
