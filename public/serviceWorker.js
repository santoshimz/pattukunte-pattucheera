const CACHE_NAME = "version-1";
const urlsToCache = ["/", "/timetravel"];

const self = this;

self.addEventListener("install", (event) => {
  event.waitUntil(async () => {
    await caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    });
  });
});

self.addEventListener("fetch", (event) => {
  event.respondWith(async () => {
    await caches.match(event.request).then(() => {
      console.log(event);
      return fetch(event.request).catch(() => caches.match("offline.html"));
    });
  });
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(async () => {
    await caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          console.log(cacheName);
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    );
  });
});
