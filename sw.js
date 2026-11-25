const CACHE = 'nexolab-shell-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) caches.open(CACHE).then(cache => cache.put(req, res.clone()));
    return res;
  }).catch(() => caches.match('./index.html'))));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type:'window', includeUncontrolled:true }).then(list => {
    const client = list.find(c => 'focus' in c);
    if (client) return client.focus();
    if (clients.openWindow) return clients.openWindow('./');
  }));
});
