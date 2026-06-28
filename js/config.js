'use strict';

/* ==========================================================
   18 BANI HASHIM
   CONFIG
   Version : V1.0.0
   ========================================================== */

const CONFIG = {

    /* ======================================================
       YOUTUBE API
    ====================================================== */

    YOUTUBE: {

        API_KEY: '',

        CHANNEL_ID: '',

        BASE_URL: 'https://www.googleapis.com/youtube/v3',

        MAX_RESULTS: 20,

        CACHE_TIME: 60 * 1000

    },

    /* ======================================================
       APP SETTINGS
    ====================================================== */

    APP: {

        NAME: '18 BANI HASHIM',

        VERSION: '1.0.0',

        THEME_DEFAULT: 'theme-midnight',

        LIVE_CHECK_INTERVAL: 60000,

        SEARCH_DEBOUNCE: 300

    },

    /* ======================================================
       UI SETTINGS
    ====================================================== */

    UI: {

        ENABLE_AURORA: true,

        ENABLE_PARTICLES: true,

        ENABLE_CURSOR_GLOW: true,

        ENABLE_PAGE_TRANSITIONS: true,

        ENABLE_SKELETON_LOADING: true

    },

    /* ======================================================
       CACHE KEYS
    ====================================================== */

    CACHE_KEYS: {

        CHANNEL: '18bh_channel',

        VIDEOS: '18bh_videos',

        LIVE: '18bh_live',

        PLAYLISTS: '18bh_playlists',

        SEARCH: '18bh_search'

    }

};
