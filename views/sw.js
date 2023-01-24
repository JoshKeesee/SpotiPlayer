const CACHE_LIST = [
  "style.css",
  "/",
  "app.js",
  "jsmediatags.min.js",
  "spotify-logo.png",
  "album-placeholder.webp",
];

const STATIC_CACHE_VERSION = `static-v1-${new Date().getTime()}`;

self.addEventListener("install", function (event) {
  const onSuccessCachesOpen = (cache) => {
    return cache.addAll(CACHE_LIST);
  }

  event.waitUntil(
    caches.open(STATIC_CACHE_VERSION).then(onSuccessCachesOpen)
  );
});

self.addEventListener("activate", (event) => {
  const onSuccessCachesKeys = (cacheNames) => {
    return Promise.all(
      cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE_VERSION) {
            return caches.delete(cache)
          }
      })
    )
  }

  event.waitUntil(caches.keys().then(onSuccessCachesKeys));
});

self.addEventListener("fetch", (event) => {
  const FALLBACK_URL = CACHE_LIST[0];

  const onSuccessFetch = response => {
    if (CACHE_LIST.includes(new URL(event.request.url).pathname)) return response
      const onSuccessDynamicCacheOpen = cache => {
      cache.put(event.request.url, response.clone())
      return response
    }

    return caches
    .open(STATIC_CACHE_VERSION)
    .then(onSuccessDynamicCacheOpen)
    .catch(() => caches.match(FALLBACK_URL))
  }

  const onErrorFetch = () => {
    const onSuccessCacheMatch = response => {
      if (response) return response
      else return caches.match(FALLBACK_URL)
    }

    return caches.match(event.request).then(onSuccessCacheMatch)
  }

  event.respondWith(
    fetch(event.request)
    .then(onSuccessFetch)
    .catch(onErrorFetch)
  );
});