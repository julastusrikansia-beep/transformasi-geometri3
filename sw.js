const CACHE_NAME = 'geometri-v7'; // <--- Naikkan ke v7

const assetsToCache = [
  '/',
  '/index.html',
  
  // Versi dengan .html
  '/01-1-materi-pengantar.html',
  '/01-1-1-translasi.html',
  '/01-1-2-refleksi.html',
  '/01-1-3-rotasi.html',
  '/01-1-4-dilatasi.html',
  '/02-simulasi.html',
  '/03-kuis.html',

  // Versi Tanpa .html (Untuk mengantisipasi Pretty URLs Netlify)
  '/01-1-materi-pengantar',
  '/01-1-1-translasi',
  '/01-1-2-refleksi',
  '/01-1-3-rotasi',
  '/01-1-4-dilatasi',
  '/02-simulasi',
  '/03-kuis',

  // File Assets CSS dan JS
  '/assets/css/style.css',
  '/assets/css/simulasi.css',
  '/assets/css/materi-pengantar.css',
  '/assets/css/main-menu.css',
  '/assets/css/kuis.css',
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
      // Menggunakan Promise.all + catch per file agar jika ada kendala di salah satu file, 
      // proses offline file lainnya tidak ikut digagalkan oleh browser.
      return Promise.all(
        assetsToCache.map(url => {
          return cache.add(url).catch(err => console.warn('Gagal memuat file ke cache:', url, err));
        })
      );
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
      // Ambil dari cache jika ada (offline), jika tidak ada baru ambil dari internet (online)
      return cachedResponse || fetch(event.request);
    })
  );
});