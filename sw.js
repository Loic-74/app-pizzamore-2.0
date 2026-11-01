// Service worker minimal : permet l'installation PWA et un fonctionnement
// basique hors-ligne (les réglages/ventes restent de toute façon en local).
const CACHE = 'pizzamore2-v2';
const FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // supprime les anciens caches (évite de servir une vieille version de l'appli
  // après une mise à jour, même si le nom du cache a changé)
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // réseau en priorité pour index.html (toujours la dernière version si en ligne),
  // cache en secours seulement si hors-ligne
  e.respondWith(
    fetch(e.request).then(resp => {
      caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
