// 네트워크 우선, 오프라인이면 캐시로 앱 화면을 연다
const C = 'soonnote-v12';
const FILES = ['./', './index.html', './app.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './vendor/anthropic-sdk.mjs', './vendor/standardwebhooks.mjs', './vendor/stablelib-base64.mjs', './vendor/fast-sha256.mjs', './vendor/qrcode.mjs'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request)));
});
