'use strict';

/* ==========================================================
   18 BANI HASHIM
   SHORTS ENGINE
   Version : V1.0.0
   ========================================================== */

const ShortsEngine = {

    container: null,

    items: [],

    loading: false

};

/* ==========================================================
   INIT SHORTS
========================================================== */

function initShorts() {

    ShortsEngine.container =
        document.getElementById('shorts-container');

    loadShorts();

}

/* ==========================================================
   LOAD SHORTS (YouTube API FILTER)
========================================================== */

async function loadShorts() {

    if (ShortsEngine.loading) return;

    ShortsEngine.loading = true;

    try {

        const data = await getLatestVideos();

        const items = data?.items || [];

        // Shorts filter (vertical / #shorts keyword based)
        ShortsEngine.items = items.filter(v => {

            const title = v?.snippet?.title || '';

            return title.toLowerCase().includes('short');

        });

        renderShorts(ShortsEngine.items);

    } catch (err) {

        console.error('Shorts load failed:', err);

    } finally {

        ShortsEngine.loading = false;

    }

}

/* ==========================================================
   RENDER SHORTS
========================================================== */

function renderShorts(items) {

    if (!ShortsEngine.container) return;

    ShortsEngine.container.innerHTML = items.map(video => {

        const id = video?.id?.videoId;

        const snippet = video?.snippet || {};

        return `

            <div class="short-card" data-id="${id}">

                <img src="${snippet?.thumbnails?.medium?.url}" alt="short">

                <div class="short-overlay">

                    <span>${snippet.title || ''}</span>

                </div>

            </div>

        `;

    }).join('');

    bindShortClicks();

}

/* ==========================================================
   CLICK HANDLER
========================================================== */

function bindShortClicks() {

    document.querySelectorAll('.short-card').forEach(card => {

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

document.addEventListener('DOMContentLoaded', initShorts);
