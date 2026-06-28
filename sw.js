'use strict';

/* ==========================================================
   18 BANI HASHIM
   SERVICE WORKER
   Version : V1.0.0
   ========================================================== */

const CACHE_NAME = '18bh-cache-v1';

const OFFLINE_URL = 'offline.html';

const ASSETS_TO_CACHE = [

    '/',
    '/index.html',
    '/videos.html',
    '/watch.html',
    '/shorts.html',
    '/playlist.html',
    '/about.html',
    '/offline.html',

    '/css/style.css',
    '/css/watch.css',
    '/css/videos.css',
    '/css/shorts.css',
    '/css/playlist.css',
    '/css/about.css',
    '/css/themes.css',
    '/css/responsive.css',

    '/js/app.js',
    '/js/api.js',
    '/js/watch.js',
    '/js/search.js',
    '/js/live.js',
    '/js/notification.js',
    '/js/themes.js',
    '/js/utils.js',
    '/js/config.js',
    '/js/pwa.js',

    '/assets/logos/logo.svg'

];

/* ==========================================================
   INSTALL EVENT
========================================================== */

self.addEventListener('install', (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            return cache.addAll(ASSETS_TO_CACHE);

        })

    );

    self.skipWaiting();

});

/* ==========================================================
   ACTIVATE EVENT
========================================================== */

self.addEventListener('activate', (event) => {

    event.waitUntil(

        caches.keys().then((keys) => {

            return Promise.all(

                keys.map((key) => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* ==========================================================
   FETCH EVENT (CACHE FIRST STRATEGY)
========================================================== */

self.addEventListener('fetch', (event) => {

    event.respondWith(

        caches.match(event.request).then((cached) => {

            if (cached) return cached;

            return fetch(event.request).catch(() => {

                if (event.request.mode === 'navigate') {

                    return caches.match(OFFLINE_URL);

                }

            });

        })

    );

});
