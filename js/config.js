/* ==========================================================
   18 BANI HASHIM
   CONFIG FILE
   Version : 1.0.0
========================================================== */

'use strict';

const CONFIG = {

    /* ======================================================
       WEBSITE
    ====================================================== */

    WEBSITE: {

        NAME: '18 BANI HASHIM',

        SHORT_NAME: '18BH',

        TAGLINE: 'Official Islamic Media Platform',

        URL: window.location.origin,

        VERSION: '1.0.0',

        AUTHOR: 'Ghazi Abbas',

        LANGUAGE: 'en',

        DEFAULT_THEME: 'dark',

        LOGO: 'assets/logos/logo.png',

        FAVICON: 'assets/logos/favicon.png',

        WATERMARK: '18 BANI HASHIM'

    },

    /* ======================================================
       YOUTUBE
    ====================================================== */

    YOUTUBE: {

        API_KEY: 'AIzaSyDZPbXMWqSM-4kCi77H0zXcj9ZIhUca4gM',

        CHANNEL_ID: 'UC2Pl7NZVhYAI3FMgl61KJSQ',

        BASE_URL: 'https://www.googleapis.com/youtube/v3',

        MAX_RESULTS: 20,

        CACHE_TIME: 60 * 1000,

        DEFAULT_SORT: 'date',

        ENABLE_LIVE: true,

        ENABLE_SHORTS: true,

        ENABLE_PLAYLISTS: true

    },

    /* ======================================================
       SOCIAL MEDIA
    ====================================================== */

    SOCIAL: {

        YOUTUBE: {

            enabled: true,

            verified: true,

            url: '',

            username: '@18BaniHashim'

        },

        INSTAGRAM: {

            enabled: true,

            verified: true,

            url: '',

            username: '@18BaniHashim'

        },

        FACEBOOK: {

            enabled: true,

            verified: true,

            url: '',

            username: '18 BANI HASHIM'

        },

        X: {

            enabled: true,

            verified: true,

            url: '',

            username: '@18BaniHashim'

        },

        TELEGRAM: {

            enabled: false,

            verified: false,

            url: '',

            username: ''

        },

        WHATSAPP: {

            enabled: false,

            verified: false,

            url: '',

            username: ''

        }

    },

    /* ======================================================
       FEATURES
    ====================================================== */

    FEATURES: {

        LOADER: true,

        SEARCH: true,

        LIVE: true,

        SHORTS: true,

        PLAYLISTS: true,

        COMMENTS: false,

        SHARE: true,

        DOWNLOAD: false,

        SUBSCRIBE_ANIMATION: true,

        FOLLOW_ANIMATION: true,

        RIPPLE_EFFECT: true,

        GLASS_EFFECT: true,

        PARTICLES: true

    },

    /* ======================================================
       HIJRI
    ====================================================== */

    HIJRI: {

        AUTO: true,

        MONTH_DAYS: 30,

        MANUAL_OFFSET: 0,

        THEME_AUTO: true,

        GHAM_THEME: true,

        KHUSHI_THEME: true

    }

};

/* ======================================================
   HIJRI MONTHS
====================================================== */

CONFIG.HIJRI.MONTHS = [

    "Muharram",
    "Safar",
    "Rabi al-Awwal",
    "Rabi al-Thani",
    "Jumada al-Ula",
    "Jumada al-Thani",
    "Rajab",
    "Shaban",
    "Ramadan",
    "Shawwal",
    "Dhul Qa'dah",
    "Dhul Hijjah"

];

/* ======================================================
   MONTH THEMES
====================================================== */

CONFIG.HIJRI.THEMES = {

    MUHARRAM: "muharram",

    SAFAR: "safar",

    RABI_AWWAL: "rabi-awwal",

    RABI_THANI: "rabi-thani",

    JUMADA_ULA: "jumada-ula",

    JUMADA_THANI: "jumada-thani",

    RAJAB: "rajab",

    SHABAN: "shaban",

    RAMADAN: "ramadan",

    SHAWWAL: "shawwal",

    DHUL_QADAH: "dhul-qadah",

    DHUL_HIJJAH: "dhul-hijjah"

};

/* ======================================================
   GHAM / KHUSHI
====================================================== */

CONFIG.HIJRI.DAY_MODE = {

    TYPE: "AUTO",

    DEFAULT: "GHAM"

};

/* ======================================================
   LOADER
====================================================== */

CONFIG.LOADER = {

    ENABLE: true,

    MIN_TIME: 2000,

    MAX_TIME: 4500,

    SHOW_PERCENT: true,

    SHOW_LOGO: true,

    SHOW_STATUS: true,

    FADE_OUT: 600

};

/* ======================================================
   CACHE
====================================================== */

CONFIG.CACHE = {

    ENABLE: true,

    CHANNEL: 60000,

    VIDEOS: 60000,

    PLAYLISTS: 60000,

    SHORTS: 60000,

    LIVE: 30000

};

/* ======================================================
   ANIMATION
====================================================== */

CONFIG.ANIMATION = {

    DURATION: 400,

    RIPPLE: true,

    GLASS: true,

    PARTICLES: true,

    PAGE_TRANSITION: true,

    SCROLL_REVEAL: true,

    FLOATING_ICONS: true

};

/* ======================================================
   COLORS
====================================================== */

CONFIG.COLORS = {

    PRIMARY: "#24d5ff",

    SECONDARY: "#5b6cff",

    SUCCESS: "#00d084",

    WARNING: "#ff9800",

    ERROR: "#ff3b5c",

    TEXT: "#ffffff",

    MUTED: "#9fb0c3",

    BACKGROUND: "#06080d"

};

/* ======================================================
   DEFAULT IMAGES
====================================================== */

CONFIG.IMAGES = {

    AVATAR: "assets/images/default-avatar.png",

    THUMBNAIL: "assets/images/default-thumbnail.jpg",

    COVER: "assets/images/default-cover.jpg",

    BANNER: "assets/images/banner.jpg"

};

/* ======================================================
   ERROR MESSAGES
====================================================== */

CONFIG.ERRORS = {

    NETWORK: "Network Error",

    API: "Unable to load YouTube data",

    CHANNEL: "Channel not found",

    VIDEOS: "No videos available",

    LIVE: "No live stream",

    PLAYLIST: "Playlist unavailable"

};

/* ======================================================
   FUTURE FEATURES
====================================================== */

CONFIG.EXPERIMENTAL = {

    INSTAGRAM_PAGE: false,

    FACEBOOK_PAGE: false,

    X_PAGE: false,

    TELEGRAM_PAGE: false,

    WHATSAPP_PAGE: false,

    AI_SEARCH: false,

    OFFLINE_MODE: false

};

/* ======================================================
   UI SETTINGS
====================================================== */

CONFIG.UI = {

    HEADER_BLUR: true,

    GLASS_UI: true,

    SMOOTH_SCROLL: true,

    CUSTOM_CURSOR: false,

    BACK_TO_TOP: true,

    STICKY_HEADER: true,

    HEADER_HIDE_ON_SCROLL: false,

    SHOW_SCROLL_PROGRESS: true,

    ENABLE_TOOLTIPS: true,

    ENABLE_CONTEXT_MENU: false,

    ENABLE_TEXT_SELECTION: true

};

/* ======================================================
   PLAYER
====================================================== */

CONFIG.PLAYER = {

    AUTOPLAY: false,

    MUTE: false,

    LOOP: false,

    QUALITY: "auto",

    SHOW_CONTROLS: true,

    MINI_PLAYER: true,

    PICTURE_IN_PICTURE: true,

    DEFAULT_VOLUME: 100,

    SAVE_LAST_POSITION: true

};

/* ======================================================
   SEARCH
====================================================== */

CONFIG.SEARCH = {

    ENABLE: true,

    LIVE_SEARCH: true,

    MIN_CHARACTERS: 2,

    MAX_RESULTS: 10,

    SAVE_HISTORY: true,

    SHOW_TRENDING: true,

    SHOW_RECENT: true,

    VOICE_SEARCH: false

};

/* ======================================================
   LIVE STREAM
====================================================== */

CONFIG.LIVE = {

    ENABLE: true,

    AUTO_REFRESH: true,

    REFRESH_INTERVAL: 30000,

    SHOW_BADGE: true,

    SHOW_VIEWERS: true,

    SHOW_DURATION: true,

    SHOW_UPCOMING: true

};

/* ======================================================
   SHORTS
====================================================== */

CONFIG.SHORTS = {

    ENABLE: true,

    AUTO_PLAY: false,

    DOUBLE_TAP_LIKE: true,

    RIPPLE_EFFECT: true,

    FLOATING_HEART: true,

    SHARE_BUTTON: true,

    SAVE_BUTTON: true,

    COMMENT_BUTTON: true

};

/* ======================================================
   PLAYLIST
====================================================== */

CONFIG.PLAYLIST = {

    ENABLE: true,

    SHOW_VIDEO_COUNT: true,

    SHOW_DURATION: true,

    FAVORITE_BUTTON: true,

    SHARE_BUTTON: true,

    PLAY_ALL: true

};

/* ======================================================
   SOCIAL
====================================================== */

CONFIG.SOCIAL_SETTINGS = {

    SHOW_VERIFIED: true,

    SHOW_FOLLOWERS: true,

    SHOW_POSTS: true,

    SHOW_FOLLOWING: true,

    FOLLOW_ANIMATION: true,

    THANK_YOU_POPUP: true,

    RIPPLE_EFFECT: true

};

/* ======================================================
   NOTIFICATIONS
====================================================== */

CONFIG.NOTIFICATION = {

    ENABLE: true,

    DURATION: 3000,

    POSITION: "top-right",

    SUCCESS_SOUND: false,

    ERROR_SOUND: false

};

/* ======================================================
   PERFORMANCE
====================================================== */

CONFIG.PERFORMANCE = {

    LAZY_LOADING: true,

    IMAGE_PRELOAD: true,

    VIDEO_PRELOAD: false,

    CACHE_IMAGES: true,

    REDUCE_MOTION: false,

    GPU_ACCELERATION: true

};

/* ======================================================
   LOCALIZATION
====================================================== */

CONFIG.LOCALE = {

    DEFAULT: "en",

    AVAILABLE: [

        "en",

        "ur",

        "ar"

    ],

    RTL: [

        "ar",

        "ur"

    ]

};

/* ======================================================
   SECURITY
====================================================== */

CONFIG.SECURITY = {

    DEBUG: false,

    ENABLE_LOGS: true,

    SANITIZE_HTML: true,

    BLOCK_CONSOLE: false

};

/* ======================================================
   ANALYTICS
====================================================== */

CONFIG.ANALYTICS = {

    ENABLE: false,

    TRACK_PAGE: false,

    TRACK_VIDEO: false,

    TRACK_SEARCH: false

};

/* ======================================================
   VERSION
====================================================== */

CONFIG.SYSTEM = {

    VERSION: "1.0.0",

    BUILD: "Production",

    LAST_UPDATE: "2026-06-30"

};

/* ======================================================
   FREEZE
====================================================== */
function deepFreeze(object){

    Object.getOwnPropertyNames(object).forEach(name=>{

        const value=object[name];

        if(value && typeof value==="object"){

            deepFreeze(value);

        }

    });

    return Object.freeze(object);

}

deepFreeze(CONFIG);
