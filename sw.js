const CACHE_NAME = 'geometri-v3';

const assetsToCache = [
  '/',                     
  '/index.html',           
  '/01-1-materi-pengantar.html',
  '/01-1-1-translasi.html',
  '/01-1-2-refleksi.html',
  '/01-1-3-rotasi.html',
  '/01-1-4-dilatasi.html',
  '/02-simulasi.html',
  '/03-kuis.html',
  '/assets/css/style.css',
  '/assets/css/simulasi.css',
  '/assets/css/materi-pengantar.css',
  '/assets/js/background.js',
  '/assets/js/main-menu.js',
  '/assets/js/landscape-guard.js',
  '/assets/js/kuis-data.js',
  '/assets/js/kuis-konten.js',
  '/assets/js/materi.js',
  '/assets/js/scroll-animation.js',
  '/assets/js/simulasi.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});