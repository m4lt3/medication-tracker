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
const fileList = [
"./android-chrome-192x192.png",
"./android-chrome-512x512.png",
"./apple-touch-icon.png",
"./browserconfig.xml",
"./favicon-16x16.png",
"./favicon-32x32.png",
"./favicon.ico",
"./index.html",
"./mstile-150x150.png",
"./safari-pinned-tab.svg",
"./site.webmanifest",
"./assets/Default.382618f0.css",
"./assets/Default.ffcac1aa.js",
"./assets/History.b774a065.js",
"./assets/Home.d517f28b.js",
"./assets/Settings.7e711587.js",
"./assets/Settings.dbfbc5a1.css",
"./assets/VChip.563f6689.js",
"./assets/VChip.b842bf51.css",
"./assets/VContainer.0e6f66d5.js",
"./assets/VForm.94c3fd6c.js",
"./assets/VGrid.9b4c590c.css",
"./assets/VList.33efd938.js",
"./assets/VList.d18cbcf7.css",
"./assets/VRow.728c9e3d.js",
"./assets/VSelect.764374fb.js",
"./assets/VSelect.e537e78f.css",
"./assets/VSelectionControl.6fd971f3.css",
"./assets/VSelectionControl.b676dcd8.js",
"./assets/VTable.3082b37a.js",
"./assets/VTable.3ec52106.css",
"./assets/config.5ac62d0a.js",
"./assets/deleteModal.554ad063.js",
"./assets/export.322ef12c.css",
"./assets/export.d2005749.js",
"./assets/index.18c2bcd3.css",
"./assets/index.c008f4b7.js",
"./assets/ingredients.c1ffc6df.js",
"./assets/intakeVisualizer.a341b0c9.css",
"./assets/intakeVisualizer.c6bee035.js",
"./assets/language.58034bdf.js",
"./assets/layout.e59b704c.js",
"./assets/materialdesignicons-webfont.48d3eec6.woff",
"./assets/materialdesignicons-webfont.861aea05.eot",
"./assets/materialdesignicons-webfont.bd725a7a.ttf",
"./assets/materialdesignicons-webfont.e52d60f6.woff2",
"./assets/pills.39f6a2b6.js",
"./assets/security.2ede84e8.css",
"./assets/security.6d34c30c.js",
"./assets/ssrBoot.472001c1.js",
"./assets/webfontloader.b777d690.js",
];
