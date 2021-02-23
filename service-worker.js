//menyimpan aset cache
const CACHE_NAME = "firstpwa-v1";
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/pages/home.html",
    "/pages/about.html",
    "/pages/contact.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/icon.png",
    "/manifest.json",
    "/js/api.js",
    "/article.html"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

//menggunakan aset cache
self.addEventListener("fetch", function(event) {
    const base_url = "https://reader-api.dicoding.dev/"

    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME)
            .then(function(cache) {
                return fetch(event.request)
                .then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, {ignoreSearch: true})
            .then(function(response) {
                return response || fetch(event.request);
            })
        )
    }
});

//Menghapus Caches yg dulu
self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys()
        .then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker : chace "+ cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

