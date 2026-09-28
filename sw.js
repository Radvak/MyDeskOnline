/* Service worker : rend l'app installable et utilisable hors ligne.
   Stratégie « réseau d'abord » pour toujours servir la dernière version,
   avec repli sur le cache hors connexion. */
const CACHE_NAME = 'mydesk-shell-v6';
const APP_SHELL = [
  './',
  'index.html',
  'styles.css',
  'script.js',
  'sync.js',
  'ical.js',
  'print.js',
  'undo.js',
  'sport.js',
  'version.json',
  'manifest.webmanifest',
  'MyDeskOnlineLogo.png',
  'settings_icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Ne gère que les fichiers de l'app (pas l'API GitHub, les polices, etc.).
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    // no-cache : toujours revalider auprès du serveur (évite un CSS/JS périmé).
    fetch(request, { cache: 'no-cache' })
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }).then((cached) => cached || caches.match('index.html')))
  );
});
