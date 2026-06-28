'use strict';

/* ==========================================================
   18 BANI HASHIM
   API LAYER (YouTube Data API v3)
   Version : V1.0.0
   ========================================================== */

const API = {

    baseURL: 'https://www.googleapis.com/youtube/v3',

    key: '',

    channelId: 'YOUR_CHANNEL_ID',

    cache: new Map()

};

/* ==========================================================
   FETCH WRAPPER
========================================================== */

async function fetchJSON(url) {

    const res = await fetch(url);

    if (!res.ok) {

        throw new Error(`API Error: ${res.status}`);

    }

    return res.json();

}

/* ==========================================================
   CHANNEL DETAILS
========================================================== */

async function getChannelDetails() {

    const cacheKey = 'channel';

    if (API.cache.has(cacheKey)) {

        return API.cache.get(cacheKey);

    }

    const url =
        `${API.baseURL}/channels?part=snippet,statistics&id=${API.channelId}&key=${API.key}`;

    const data = await fetchJSON(url);

    API.cache.set(cacheKey, data);

    return data;

}

/* ==========================================================
   LATEST VIDEOS
========================================================== */

async function getLatestVideos() {

    const cacheKey = 'videos';

    if (API.cache.has(cacheKey)) {

        return API.cache.get(cacheKey);

    }

    const url =
        `${API.baseURL}/search?part=snippet&channelId=${API.channelId}&maxResults=20&order=date&type=video&key=${API.key}`;

    const data = await fetchJSON(url);

    API.cache.set(cacheKey, data);

    return data;

}

/* ==========================================================
   LIVE VIDEO CHECK
========================================================== */

async function getLiveVideo() {

    const cacheKey = 'live';

    if (API.cache.has(cacheKey)) {

        return API.cache.get(cacheKey);

    }

    const url =
        `${API.baseURL}/search?part=snippet&channelId=${API.channelId}&eventType=live&type=video&key=${API.key}`;

    const data = await fetchJSON(url);

    API.cache.set(cacheKey, data);

    return data;
}

/* ==========================================================
   PLAYLISTS
========================================================== */

async function getPlaylists() {

    const cacheKey = 'playlists';

    if (API.cache.has(cacheKey)) {

        return API.cache.get(cacheKey);

    }

    const url =
        `${API.baseURL}/playlists?part=snippet,contentDetails&channelId=${API.channelId}&maxResults=20&key=${API.key}`;

    const data = await fetchJSON(url);

    API.cache.set(cacheKey, data);

    return data;

}
