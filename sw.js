const CACHE_NAME = 'geometri-v12';

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

  // Versi Tanpa .html (Untuk Netlify Pretty URLs)
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
  '/manifest.json',

  // --- DAFTAR GAMBAR SESUAI STRUKTUR FOLDER KM ---
  '/assets/img/dilatasi.png',
  '/assets/img/icon-192.png',
  '/assets/img/icon-512.png',
  '/assets/img/mudah.jpg',
  '/assets/img/refleksi.png',
  '/assets/img/rotasi.png',
  '/assets/img/sedang.jpg',
  '/assets/img/sulit.jpg',
  '/assets/img/translasi.png',
  
  // File yang menggunakan spasi diubah menjadi %20
  '/assets/img/Ilustrasi%20dilatasi%20Geometri%201.png',
  '/assets/img/Ilustrasi%20refleksi%20Geometri.png',
  '/assets/img/Ilustrasi%20rotasi%20Geometri%201.png',
  '/assets/img/Ilustrasi%20Translasi%20Geometri%201.png'
];

// Proses Install & Pre-caching
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        assetsToCache.map(url => {
          return cache.add(url).catch(err => console.warn('Gagal memuat file ke cache:', url, err));
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Proses Aktivasi & Pembersihan Cache Lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Proses Fetching (Strategi Cache First, dengan auto-cache untuk gambar baru)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (event.request.destination === 'image') {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(err => {
        console.error('File tidak ditemukan di cache maupun internet:', err);
      });
    })
  );
});