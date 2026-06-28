'use strict';

/* ==========================================================
   18 BANI HASHIM
   PLAYLIST ENGINE
   Version : V1.0.0
   ========================================================== */

const PlaylistEngine = {

    container: null,

    items: [],

    loading: false

};

/* ==========================================================
   INIT PLAYLIST PAGE
========================================================== */

function initPlaylistPage() {

    PlaylistEngine.container =
        document.getElementById('playlist-container');

    loadPlaylists();

}

/* ==========================================================
   LOAD PLAYLISTS
========================================================== */

async function loadPlaylists() {

    if (PlaylistEngine.loading) return;

    PlaylistEngine.loading = true;

    try {

        const data = await getPlaylists();

        PlaylistEngine.items =
            data?.items || [];

        renderPlaylists(PlaylistEngine.items);

    } catch (err) {

        console.error('Playlist load failed:', err);

    } finally {

        PlaylistEngine.loading = false;

    }

}

/* ==========================================================
   RENDER PLAYLISTS
========================================================== */

function renderPlaylists(items) {

    if (!PlaylistEngine.container) return;

    PlaylistEngine.container.innerHTML = items.map(pl => {

        const snippet = pl.snippet || {};

        const id = pl.id;

        const thumb =
            snippet?.thumbnails?.medium?.url;

        return `

            <div class="playlist-card" data-id="${id}">

                <img src="${thumb}" alt="${snippet.title}">

                <div class="playlist-info">

                    <h3>${snippet.title}</h3>

                    <p>${snippet.channelTitle || ''}</p>

                </div>

            </div>

        `;

    }).join('');

    bindPlaylistClicks();

}

/* ==========================================================
   CLICK HANDLER
========================================================== */

function bindPlaylistClicks() {

    document.querySelectorAll('.playlist-card').forEach(card => {

        card.addEventListener('click', () => {

            const id = card.getAttribute('data-id');

            if (id) {

                window.location.href = `playlist-view.html?id=${id}`;

            }

        });

    });

}

/* ==========================================================
   AUTO INIT
========================================================== */

document.addEventListener('DOMContentLoaded', initPlaylistPage);
