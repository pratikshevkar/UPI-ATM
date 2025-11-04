// Define a name for our cache
const CACHE_NAME = 'upi-atm-v1';

// List all the files your app needs to work offline
const FILES_TO_CACHE = [
  '/', // This caches your main index.html file
  'manifest.json',
  'icon-192.png', // Added icon
  'icon-512.png', // Added icon
  'https://cdn.tailwindcss.com', // Caches the Tailwind CSS file
  'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js' // Caches the QR code library
];

// 1. On "install" (when the service worker is first registered)
// We open the cache and add all our essential files to it.
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. On "activate" (when the new service worker takes over)
// We clean up any old, unused caches.
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. On "fetch" (when the app tries to get any file, like an image or CSS)
// We try to get it from the cache first. If it's not in the cache,
// we then try to get it from the network.
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      // If we have it in the cache, return it.
      // Otherwise, fetch it from the network.
      return response || fetch(evt.request);
    })
  );
});