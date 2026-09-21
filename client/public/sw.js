self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch just to satisfy PWA requirements
  event.respondWith(fetch(event.request));
});
