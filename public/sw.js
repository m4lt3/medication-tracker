// mostly copied from https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const currentCacheVersion = "v1.1.1";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(currentCacheVersion);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(currentCacheVersion);
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = [currentCacheVersion];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("install", (event) => {
  event.waitUntil(async () => {
    await addResourcesToCache(fileList);
    await clients.claim()
  });
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([deleteOldCaches()]));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});
