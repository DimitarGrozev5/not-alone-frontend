importScripts("./localforage.js");

const staticCacheVersion = "static-v17";
const dynamicCacheVersion = "dynamic-v17";

const staticRoutes = [
  "/",
  "/index.html",
  "/register",
  "/login",
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
  else if (event.request.method === "GET") {
    networkWithDynamicCaching(event);
  }
  // In all other cases - network only
  else {
    networkOnly(event);
  }

  // event.respondWith(fetch(event.request));
});

// Handle push notifications
self.addEventListener("push", (event) => {
  let data = {
    title: "Съобщение",
    body: "Проверете кой е На път",
    url: "/",
    type: "NOTIFICATION",
  };
  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  let options;
  switch (data.type) {
    case "TRIP_REQUEST":
      options = {
        body: data.body,
        icon: "/road.png",
        vibrate: [100, 50, 200],
        tag: "confirm-trip", // Acts as an id, to replace notifications with newer one
        renotify: true, // New notifications with the same tag will alert again
        data: {
          url: data.url,
        },
      };
      break;
    case "CONNECTION_REQUEST":
      options = {
        body: data.body,
        icon: "/road.png",
        vibrate: [100, 50, 200],
        tag: "confirm-connection", // Acts as an id, to replace notifications with newer one
        renotify: true, // New notifications with the same tag will alert again
        data: {
          url: data.url,
        },
      };
    case "ALERT":
      options = {
        body: data.body,
        icon: "/road.png",
        vibrate: [400, 50, 400],
        data: {
          url: data.url,
        },
      };
      break;

    default:
      options = {
        body: data.body,
        icon: "/road.png",
        vibrate: [100, 50, 200],
        tag: "generic-notification", // Acts as an id, to replace notifications with newer one
        renotify: true, // New notifications with the same tag will alert again
        data: {
          url: data.url,
        },
      };
      break;
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;

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
});

// Handle Sync Tasks
self.addEventListener("sync", (event) => {
  console.log("sync");
  if (event.tag === "sync-outgoing-request") {
    event.waitUntil(
      (async () => {
        // Open data store
        const dataStore = await self.localforage.getItem("sync-store");
        if (!dataStore) {
          return;
        }

        // Get all sync tasks
        const allTasks = Object.values(dataStore).flatMap((val) => val);

        // Make fetch requests
        await Promise.allSettled(allTasks.map((task) => fetch(...task)));

        // Remove tasks from store
        await self.localforage.removeItem("sync-store");
      })()
    );
  }
});

////////// Caching strategies

// Return imidiatly response from cache if available
// Fetch data from network and update the cache
function cacheFirst(event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Send request for updating the cache
        caches.open(staticCacheVersion).then((cache) => {
          // cache.add(event.request.url);
          fetch(event.request)
            .then((response) => {
              if (response.ok) {
                return cache.put(event.request, response);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });

        return response;
      }
      return fetch(event.request);
    })
  );
}

// Fetch from network and return response
// Cache response
function networkWithDynamicCaching(event) {
  event.respondWith(
    fetch(event.request).then((response) => {
      caches.open(dynamicCacheVersion).then((cache) => {
        cache.put(event.request, response);
      });
      return response.clone();
    })
  );
}

// Fetch from network and return response
// Cache response
// If there is an error return previous cached response
function networkThenDynamicCaching(event) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        caches.open(dynamicCacheVersion).then((cache) => {
          cache.put(event.request, response);
        });
        return response.clone();
      })
      .catch(() => caches.match(event.request))
  );
}

function networkOnly(event) {
  event.respondWith(fetch(event.request));
}
