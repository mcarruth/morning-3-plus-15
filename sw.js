// Offline support. A basement gym with no signal must not break the workout.
const CACHE = 'morning315-v7';

const ASSETS = [
  '/', '/index.html', '/styles.css',
  '/app.js', '/data.js', '/store.js', '/schedule.js', '/timer.js',
  '/manifest.json', '/icon-192.svg', '/icon-180.png', '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache first so the app opens instantly and works with no signal, with a
// background refresh so a deploy is picked up on the next launch.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(hit => {
      const network = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);

      return hit || network;
    })
  );
});
