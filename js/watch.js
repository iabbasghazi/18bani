'use strict';

/* ==========================================================
   18 BANI HASHIM
   WATCH ENGINE
   Version : V1.0.0
   ========================================================== */

const WatchEngine = {

    videoId: null,

    player: null,

    relatedContainer: null

};

/* ==========================================================
   INIT WATCH PAGE
========================================================== */

function initWatchPage() {

    const params =
        new URLSearchParams(window.location.search);

    WatchEngine.videoId =
        params.get('id');

    if (!WatchEngine.videoId) {

        console.error('No Video ID found');

        return;

    }

    loadPlayer();

    loadRelatedVideos();

}

/* ==========================================================
   LOAD YOUTUBE PLAYER
========================================================== */

function loadPlayer() {

    const container =
        document.getElementById('player');

    if (!container) return;

    const iframe =
        document.createElement('iframe');

    iframe.width = '100%';

    iframe.height = '100%';

    iframe.src =
        `https://www.youtube.com/embed/${WatchEngine.videoId}?autoplay=1&mute=1`;

    iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

    iframe.allowFullscreen = true;

    container.appendChild(iframe);

}

/* ==========================================================
   LOAD RELATED VIDEOS
========================================================== */

async function loadRelatedVideos() {

    WatchEngine.relatedContainer =
        document.getElementById('related-videos');

    if (!WatchEngine.relatedContainer) return;

    try {

        const data = await getLatestVideos();

        const items = data?.items || [];

        renderRelated(items);

    } catch (err) {

        console.error('Related load failed:', err);

    }

}

/* ==========================================================
   RENDER RELATED
========================================================== */

function renderRelated(items) {

    if (!WatchEngine.relatedContainer) return;

    WatchEngine.relatedContainer.innerHTML = items.map(video => {

        const snippet = video.snippet || {};

        const id = video?.id?.videoId;

        return `

            <div class="related-card" data-id="${id}">

                <img src="${snippet?.thumbnails?.medium?.url}" alt="">

                <div class="related-info">

                    <h4>${snippet?.title || ''}</h4>

                </div>

            </div>

        `;

    }).join('');

    bindRelatedClicks();

}

/* ==========================================================
   RELATED CLICK
========================================================== */

function bindRelatedClicks() {

    document.querySelectorAll('.related-card').forEach(card => {

        card.addEventListener('click', () => {

            const id = card.getAttribute('data-id');

            if (id) {

                window.location.href = `watch.html?id=${id}`;

            }

        });

    });

}

/* ==========================================================
   INIT AUTO
========================================================== */

document.addEventListener('DOMContentLoaded', initWatchPage);
