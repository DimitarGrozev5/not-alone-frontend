const staticCacheVersion = "static-v2";

self.addEventListener("install", (event) => {
  // console.log("[Service worker] Instaling service worker");
  event.waitUntil(
    caches.open(staticCacheVersion).then((cache) => {
      // console.log("[Servce worker] Precaching app shell");
      cache.addAll([
        "/",
        "/profile",
        "/planned-trips",
        "/watching",
        "/ongoing-trip",
        "/plan-trip",
        "/road.png",
        // {{{Inject static folder files here}}}
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  // console.log("[Service worker] Activating service worker");
  // Clear old cashes when service worker updates
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== staticCacheVersion /*  && key !== "dynamic" */) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // console.log("[Service worker] Fetching");
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
