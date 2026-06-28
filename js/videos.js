'use strict';

/* ==========================================================
   18 BANI HASHIM
   VIDEOS ENGINE
   Version : V1.0.0
   ========================================================== */

const VideosEngine = {

    items: [],

    container: null,

    loading: false,

    nextPageToken: null

};

/* ==========================================================
   INIT VIDEOS
========================================================== */

function initVideos() {

    VideosEngine.container =
        document.getElementById('videos-container');

    loadLatestVideos();

}

/* ==========================================================
   LOAD LATEST VIDEOS
========================================================== */

async function loadLatestVideos() {

    if (VideosEngine.loading) return;

    VideosEngine.loading = true;

    try {

        const data = await getLatestVideos();

        VideosEngine.items =
            data?.items || [];

        VideosEngine.nextPageToken =
            data?.nextPageToken || null;

        renderVideos(VideosEngine.items);

    } catch (err) {

        console.error('Videos load failed:', err);

    } finally {

        VideosEngine.loading = false;

    }

}

/* ==========================================================
   RENDER VIDEOS GRID
========================================================== */

function renderVideos(items) {

    if (!VideosEngine.container) return;

    VideosEngine.container.innerHTML = items.map(video => {

        const snippet = video.snippet || {};

        const videoId = video?.id?.videoId;

        const title = snippet.title || '';

        const thumb =
            snippet?.thumbnails?.high?.url ||
            snippet?.thumbnails?.medium?.url;

        const date = formatDate(snippet.publishedAt);

        return `

            <div class="video-card" data-id="${videoId}">

                <div class="video-thumb">

                    <img src="${thumb}" alt="${title}" loading="lazy">

                </div>

                <div class="video-info">

                    <h3 class="video-title">${title}</h3>

                    <span class="video-date">${date}</span>

                </div>

            </div>

        `;

    }).join('');

    bindVideoClicks();

}

/* ==========================================================
   CLICK HANDLER
========================================================== */

function bindVideoClicks() {

    document.querySelectorAll('.video-card').forEach(card => {

        card.addEventListener('click', () => {

            const id = card.getAttribute('data-id');

            if (id) {

                window.location.href = `watch.html?id=${id}`;

            }

        });

    });

}

/* ==========================================================
   AUTO INIT
========================================================== */

document.addEventListener('DOMContentLoaded', initVideos);
