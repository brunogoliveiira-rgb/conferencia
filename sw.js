// Service Worker - Art Conferência
// Dica: ao publicar uma nova versão do index.html, aumente o número abaixo
// para que os celulares baixem a atualização.
const VERSION = 'v1';
const CACHE = `art-conferencia-${VERSION}`;

const LOCAL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

// Biblioteca de leitura de PDF (precisa funcionar offline)
const CDN_FILES = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(LOCAL_FILES);
    // CDN: tenta guardar, mas não falha a instalação se estiver sem internet
    await Promise.all(CDN_FILES.map(async url => {
      try { await cache.add(new Request(url, { mode: 'cors' })); } catch (e) { /* tenta de novo no primeiro uso */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('art-conferencia-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navegação: rede primeiro (pega versão nova), cache se estiver offline
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  // Demais arquivos (locais e CDN do PDF.js): cache primeiro, rede como reserva
  const isLocal = url.origin === self.location.origin;
  const isPdfJs = url.hostname === 'cdnjs.cloudflare.com';
  if (!isLocal && !isPdfJs) return;

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});
