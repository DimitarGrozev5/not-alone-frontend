const staticCacheVersion = "static-v2";
const dynamicCacheVersion = "dynamic-v1";

const staticRoutes = [
  "/",
  "/profile",
  "/planned-trips",
  "/watching",
  "/ongoing-trip",
  "/plan-trip",
  "/road.png",
  // {{{Inject static folder files here}}}
];

self.addEventListener("install", (event) => {
  // console.log("[Service worker] Instaling service worker");
  event.waitUntil(
    caches.open(staticCacheVersion).then((cache) => {
      // console.log("[Servce worker] Precaching app shell");
      cache.addAll(staticRoutes);
    })
  );
});

self.addEventListener("activate", (event) => {
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
  // console.log("[Service worker]", event);

  // Parse request URL
  const url = new URL(event.request.url);

  // If static file - cache first
  if (staticRoutes.indexOf(url.pathname) > -1) {
    cacheFirst(event);
  }
  // If GET Request - Cache first on page, then network and dynamic caching
  // else if (event.request.method === "GET") {
  //   networkThenDynamicCaching(event)
  // }
  // In all other cases - network only
  else {
    networkOnly(event);
  }

  // event.respondWith(fetch(event.request));
});

self.addEventListener("push", (event) => {
  let data = { title: "Съобщение", body: "Проверете кой е На път", url: "/" };
  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  event.waitUntil(self.registration.showNotification(data.title, data));
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;

  console.log(notification);
  if (action === "confirm") {
    console.log("open confirm link");
    notification.close();
  } else {
    event.waitUntil(
      clients.matchAll().then((clis) => {
        const client = clis.find((c) => c.visibilityState === "visible");

        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

////////// Caching strategies
function cacheFirst(event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
}

function networkThenDynamicCaching(event) {
  // event.respondWith(
  //   fetch(event.request).then((response) => {
  //     caches.open(dynamicCacheVersion).then((cache) => {
  //       cache.put(response.clone());
  //     });
  //     return response;
  //   })
  // );
}

function networkOnly(event) {
  event.respondWith(fetch(event.request));
}
