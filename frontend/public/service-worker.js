// Service Worker for SolarHelper PWA
const CACHE_NAME = 'solar-helper-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css',
  '/assets/index.js',
];

// Install event - cache the essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache if available, otherwise fetch and cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from cache
        if (response) {
          return response;
        }

        // Clone the request - request is a stream and can only be consumed once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response - response is a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              // Don't cache if request method isn't 'GET'
              if (event.request.method === 'GET') {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, show a fallback page if it's a navigation request
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});

const PYODIDE_CACHE_NAME = 'pyodide-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('/pyodide-pkg/') || url.includes('cdn.jsdelivr.net/pyodide/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          // already in cache, return it
          return cached;
        }
        // not cached → fetch and then cache
        return fetch(event.request).then((networkRes) => {
          if (networkRes.ok) {
            caches.open(PYODIDE_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkRes.clone());
            });
          }
          return networkRes;
        });
      })
    );
  }
});