'use strict';

/* ==========================================================
   18 BANI HASHIM
   SEARCH ENGINE
   Version : V1.0.0
   ========================================================== */

const SearchEngine = {

    query: '',

    results: [],

    history: JSON.parse(localStorage.getItem('search_history') || '[]'),

    maxHistory: 10,

    activeIndex: -1

};

/* ==========================================================
   INIT SEARCH
========================================================== */

function initSearch() {

    const input = document.getElementById('searchInput');

    if (!input) return;

    input.addEventListener('input', handleSearchInput);

    input.addEventListener('keydown', handleSearchKeys);

}

/* ==========================================================
   INPUT HANDLER
========================================================== */

async function handleSearchInput(e) {

    const value = e.target.value.trim();

    SearchEngine.query = value;

    if (!value) {

        clearSearchResults();

        return;

    }

    const results = await performSearch(value);

    renderSearchResults(results);

}

/* ==========================================================
   PERFORM SEARCH
========================================================== */

async function performSearch(query) {

    try {

        const url =
            `${API.baseURL}/search?part=snippet&q=${encodeURIComponent(query)}&channelId=${API.channelId}&type=video,playlist&maxResults=15&key=${API.key}`;

        const data = await fetchJSON(url);

        return data?.items || [];

    } catch (error) {

        console.error('Search error:', error);

        return [];

    }

}

/* ==========================================================
   RENDER RESULTS
========================================================== */

function renderSearchResults(items) {

    SearchEngine.results = items;

    const container =
        document.getElementById('searchResults');

    if (!container) return;

    container.innerHTML = items.map(item => {

        const title =
            item?.snippet?.title || '';

        const thumb =
            item?.snippet?.thumbnails?.medium?.url || '';

        return `

            <div class="search-item" data-id="${item.id.videoId || item.id.playlistId}">

                <img src="${thumb}" alt="${title}">

                <div class="search-info">

                    <h4>${title}</h4>

                </div>

            </div>

        `;

    }).join('');

}

/* ==========================================================
   CLEAR RESULTS
========================================================== */

function clearSearchResults() {

    const container =
        document.getElementById('searchResults');

    if (container) {

        container.innerHTML = '';

    }

}

/* ==========================================================
   KEYBOARD SUPPORT
========================================================== */

function handleSearchKeys(e) {

    const items =
        document.querySelectorAll('.search-item');

    if (!items.length) return;

    if (e.key === 'ArrowDown') {

        SearchEngine.activeIndex++;

    }

    if (e.key === 'ArrowUp') {

        SearchEngine.activeIndex--;

    }

    if (e.key === 'Enter') {

        const active =
            items[SearchEngine.activeIndex];

        if (active) {

            active.click();

        }

    }

}

/* ==========================================================
   INIT AUTO
========================================================== */

initSearch();
