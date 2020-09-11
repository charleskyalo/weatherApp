self.addEventListener('install', e => {
    console.log("install");

    e.waitUntil(
        caches.open('static').then(cache => {
            return cache.addAll(["./", "./src/main.css", "./src/app.js", "./images/smashit512.png", "./images/smashit192.png"])
        })
    )
})

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    )
})

/* cache static resources */