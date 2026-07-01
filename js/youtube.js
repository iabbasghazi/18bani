/* ==========================================================
   18 BANI HASHIM
   YOUTUBE ENGINE
   Version : 2.0.0
   Part 1
========================================================== */

'use strict';

/* ==========================================================
   YOUTUBE ENGINE CLASS
========================================================== */

class YouTubeEngine {

    constructor() {

        this.config = CONFIG.YOUTUBE;

        this.cache = new Map();

        this.channel = null;

        this.latestVideos = [];

        this.liveVideo = null;

        this.playlists = [];

        this.shorts = [];

        this.abortController = null;

        this.initialized = false;

    }

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async init() {

        try {

            this.validateConfig();

            this.abortController = new AbortController();

            this.initialized = true;

            console.log("✅ YouTube Engine Initialized");

        } catch (error) {

            console.error(error);

            throw error;

        }

    }

    /* ======================================================
       VALIDATE CONFIG
    ====================================================== */

    validateConfig() {

        if (!this.config.API_KEY) {

            throw new Error("YouTube API Key Missing");

        }

        if (!this.config.CHANNEL_ID) {

            throw new Error("YouTube Channel ID Missing");

        }

    }

    /* ======================================================
       BASE URL
    ====================================================== */

    endpoint(path) {

        return `${this.config.BASE_URL}/${path}`;

    }

    /* ======================================================
       DEFAULT PARAMETERS
    ====================================================== */

    params(extra = {}) {

        return {

            key: this.config.API_KEY,

            ...extra

        };

    }

    /* ======================================================
       BUILD QUERY
    ====================================================== */

    query(parameters) {

        return new URLSearchParams(parameters).toString();

    }

    /* ======================================================
       COMPLETE URL
    ====================================================== */

    build(path, parameters = {}) {

        return `${this.endpoint(path)}?${this.query(this.params(parameters))}`;

    }

    /* ======================================================
       FETCH JSON
    ====================================================== */

    async request(path, parameters = {}) {

        const url = this.build(path, parameters);

        const response = await fetch(url, {

            signal: this.abortController.signal,

            headers: {

                "Accept": "application/json"

            }

        });

        if (!response.ok) {

            throw new Error(

                `YouTube API Error (${response.status})`

            );

        }

        return await response.json();

    }

    /* ======================================================
       CACHE GET
    ====================================================== */

    getCache(key) {

        const item = this.cache.get(key);

        if (!item) {

            return null;

        }

        const expired =

            Date.now() >

            item.time + this.config.CACHE_TIME;

        if (expired) {

            this.cache.delete(key);

            return null;

        }

        return item.value;

    }

    /* ======================================================
       CACHE SET
    ====================================================== */

    setCache(key, value) {

        this.cache.set(key, {

            value,

            time: Date.now()

        });

    }

    /* ======================================================
       FORMAT NUMBER
    ====================================================== */

    formatNumber(number) {

        number = Number(number);

        if (number >= 1000000000) {

            return (

                (number / 1000000000).toFixed(1)

                + "B"

            );

        }

        if (number >= 1000000) {

            return (

                (number / 1000000).toFixed(1)

                + "M"

            );

        }

        if (number >= 1000) {

            return (

                (number / 1000).toFixed(1)

                + "K"

            );

        }

        return number.toLocaleString();

    }

    /* ======================================================
       FORMAT DATE
    ====================================================== */

    formatDate(date) {

        return new Date(date).toLocaleDateString(

            "en-IN",

            {

                day: "numeric",

                month: "short",

                year: "numeric"

            }

        );

    }

    /* ======================================================
       FORMAT TIME
    ====================================================== */

    formatTime(date) {

        return new Date(date).toLocaleTimeString(

            "en-IN",

            {

                hour: "2-digit",

                minute: "2-digit"

            }

        );

    }

    /* ======================================================
       FORMAT DURATION
    ====================================================== */

    formatDuration(duration) {

        if (!duration) return "";

        let h = 0;

        let m = 0;

        let s = 0;

        const matchH = duration.match(/(\d+)H/);

        const matchM = duration.match(/(\d+)M/);

        const matchS = duration.match(/(\d+)S/);

        if (matchH) h = parseInt(matchH[1]);

        if (matchM) m = parseInt(matchM[1]);

        if (matchS) s = parseInt(matchS[1]);

        const parts = [];

        if (h > 0) {

            parts.push(h);

        }

        parts.push(

            String(m).padStart(2, "0")

        );

        parts.push(

            String(s).padStart(2, "0")

        );

        return parts.join(":");

    }

    /* ======================================================
       THUMBNAIL
    ====================================================== */

    thumbnail(item) {

        if (!item) {

            return "";

        }

        return (

            item.maxres?.url ||

            item.standard?.url ||

            item.high?.url ||

            item.medium?.url ||

            item.default?.url ||

            ""

        );

    }

    /* ======================================================
       SHORTS FILTER
    ====================================================== */

    isShort(video) {

        if (!video) {

            return false;

        }

        const duration = video.contentDetails?.duration;

        if (!duration) {

            return false;

        }

        const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);

        if (!match) {

            return false;

        }

        const minutes = Number(match[1] || 0);

        return minutes < 1;

    }

}

/* ==========================================================
   GLOBAL INSTANCE
========================================================== */

const YouTube = new YouTubeEngine();

/* ==========================================================
   CHANNEL INFORMATION
========================================================== */

YouTubeEngine.prototype.getChannel = async function () {

    const cache = this.getCache("channel");

    if (cache) {

        this.channel = cache;

        return cache;

    }

    const response = await this.request("channels", {

        part: "snippet,statistics,brandingSettings",

        id: this.config.CHANNEL_ID

    });

    if (!response.items || !response.items.length) {

        throw new Error("Channel not found.");

    }

    const item = response.items[0];

    const data = {

        id: item.id,

        title: item.snippet.title,

        description: item.snippet.description,

        customUrl: item.snippet.customUrl || "",

        publishedAt: item.snippet.publishedAt,

        country: item.snippet.country || "",

        avatar: this.thumbnail(item.snippet.thumbnails),

        banner:

            item.brandingSettings?.image?.bannerExternalUrl ||

            "",

        subscribers:

            this.formatNumber(

                item.statistics.subscriberCount

            ),

        subscribersRaw:

            Number(item.statistics.subscriberCount),

        videos:

            this.formatNumber(

                item.statistics.videoCount

            ),

        videosRaw:

            Number(item.statistics.videoCount),

        views:

            this.formatNumber(

                item.statistics.viewCount

            ),

        viewsRaw:

            Number(item.statistics.viewCount)

    };

    this.channel = data;

    this.setCache("channel", data);

    return data;

};


/* ==========================================================
   UPDATE CHANNEL UI
========================================================== */

YouTubeEngine.prototype.renderChannel = function () {

    if (!this.channel) return;

    const c = this.channel;

    this.setText(

        "#channelName",

        c.title

    );

    this.setText(

        "#channelHandle",

        "@" + c.customUrl.replace("@", "")

    );

    this.setText(

        "#subscriberCount",

        c.subscribers + " Subscribers"

    );

    this.setText(

        "#videoCount",

        c.videos + " Videos"

    );

    this.setText(

        "#viewCount",

        c.views + " Views"

    );

    this.setText(

        "#channelBio",

        c.description

    );

    this.setImage(

        "#channelLogo",

        c.avatar

    );

    this.setBackground(

        "#channelBanner",

        c.banner

    );

};


/* ==========================================================
   SMALL HELPERS
========================================================== */

YouTubeEngine.prototype.setText = function (

    selector,

    value

) {

    const el = document.querySelector(selector);

    if (el) {

        el.textContent = value;

    }

};

YouTubeEngine.prototype.setImage = function (

    selector,

    src

) {

    const el = document.querySelector(selector);

    if (el && src) {

        el.src = src;

    }

};

YouTubeEngine.prototype.setBackground = function (

    selector,

    src

) {

    const el = document.querySelector(selector);

    if (el && src) {

        el.style.backgroundImage =

            `url("${src}")`;

    }

};


/* ==========================================================
   LOAD CHANNEL
========================================================== */

YouTubeEngine.prototype.loadChannel = async function () {

    try {

        await this.getChannel();

        this.renderChannel();

        console.log(

            "✅ Channel Loaded"

        );

    }

    catch (error) {

        console.error(

            "Channel Error:",

            error

        );

    }

};


/* ==========================================================
   CHANNEL READY
========================================================== */

YouTubeEngine.prototype.channelReady = function () {

    return !!this.channel;

};

/* ==========================================================
   LIVE STREAM ENGINE
   Part 3
========================================================== */

/* ==========================================================
   GET LIVE STREAM
========================================================== */

YouTubeEngine.prototype.getLiveStream = async function () {

    const cache = this.getCache("live");

    if (cache) {

        this.liveVideo = cache;

        return cache;

    }

    const response = await this.request("search", {

        part: "snippet",

        channelId: this.config.CHANNEL_ID,

        eventType: "live",

        type: "video",

        maxResults: 1

    });

    if (!response.items || !response.items.length) {

        this.liveVideo = null;

        return null;

    }

    const videoId = response.items[0].id.videoId;

    return await this.getLiveDetails(videoId);

};


/* ==========================================================
   GET LIVE DETAILS
========================================================== */

YouTubeEngine.prototype.getLiveDetails = async function (videoId) {

    const response = await this.request("videos", {

        part: "snippet,liveStreamingDetails,statistics",

        id: videoId

    });

    if (!response.items || !response.items.length) {

        return null;

    }

    const item = response.items[0];

    const data = {

        id: item.id,

        title: item.snippet.title,

        description: item.snippet.description,

        publishedAt: item.snippet.publishedAt,

        thumbnail: this.thumbnail(item.snippet.thumbnails),

        viewers: this.formatNumber(

            item.liveStreamingDetails?.concurrentViewers || 0

        ),

        viewersRaw: Number(

            item.liveStreamingDetails?.concurrentViewers || 0

        ),

        likes: this.formatNumber(

            item.statistics.likeCount || 0

        ),

        views: this.formatNumber(

            item.statistics.viewCount || 0

        ),

        url:

            "https://www.youtube.com/watch?v=" +

            item.id,

        embed:

            "https://www.youtube.com/embed/" +

            item.id +

            "?autoplay=1"

    };

    this.liveVideo = data;

    this.setCache("live", data);

    return data;

};


/* ==========================================================
   RENDER LIVE STREAM
========================================================== */

YouTubeEngine.prototype.renderLive = function () {

    const wrapper = document.querySelector("#liveSection");

    if (!wrapper) {

        return;

    }

    if (!this.liveVideo) {

        wrapper.style.display = "none";

        return;

    }

    wrapper.style.display = "";

    const live = this.liveVideo;

    this.setText(

        "#liveTitle",

        live.title

    );

    this.setText(

        "#liveViewers",

        live.viewers +

        " Watching"

    );

    this.setText(

        "#liveViews",

        live.views +

        " Views"

    );

    this.setText(

        "#liveDate",

        this.formatDate(

            live.publishedAt

        )

    );

    this.setImage(

        "#liveThumbnail",

        live.thumbnail

    );

    const watch =

        document.querySelector(

            "#watchLive"

        );

    if (watch) {

        watch.href = live.url;

    }

};


/* ==========================================================
   LOAD LIVE STREAM
========================================================== */

YouTubeEngine.prototype.loadLive = async function () {

    try {

        await this.getLiveStream();

        this.renderLive();

        console.log(

            "🔴 Live Loaded"

        );

    }

    catch (error) {

        console.error(

            "Live Error:",

            error

        );

    }

};


/* ==========================================================
   AUTO REFRESH
========================================================== */

YouTubeEngine.prototype.startLiveRefresh = function () {

    if (

        !CONFIG.LIVE.AUTO_REFRESH

    ) {

        return;

    }

    setInterval(async () => {

        this.cache.delete("live");

        await this.loadLive();

    },

    CONFIG.LIVE.REFRESH_INTERVAL);

};


/* ==========================================================
   LIVE STATUS
========================================================== */

YouTubeEngine.prototype.isLive = function () {

    return this.liveVideo !== null;

};


/* ==========================================================
   LIVE PLACEHOLDER
========================================================== */

YouTubeEngine.prototype.clearLive = function () {

    const wrapper = document.querySelector(

        "#liveSection"

    );

    if (wrapper) {

        wrapper.style.display = "none";

    }

};


/* ==========================================================
   END PART 3
========================================================== */

/* ==========================================================
   LATEST VIDEOS ENGINE
   Part 4
========================================================== */

/* ==========================================================
   GET UPLOAD PLAYLIST
========================================================== */

YouTubeEngine.prototype.getUploadPlaylist = async function () {

    if (!this.channel) {

        await this.getChannel();

    }

    const response = await this.request("channels", {

        part: "contentDetails",

        id: this.config.CHANNEL_ID

    });

    return response.items[0]
        .contentDetails
        .relatedPlaylists
        .uploads;

};


/* ==========================================================
   GET LATEST VIDEOS
========================================================== */

YouTubeEngine.prototype.getLatestVideos = async function () {

    const cache = this.getCache("videos");

    if (cache) {

        this.latestVideos = cache;

        return cache;

    }

    const uploads = await this.getUploadPlaylist();

    const playlist = await this.request("playlistItems", {

        part: "snippet,contentDetails",

        playlistId: uploads,

        maxResults: 50

    });

    const ids = playlist.items.map(item => item.contentDetails.videoId);

    const details = await this.request("videos", {

        part: "snippet,contentDetails,statistics",

        id: ids.join(",")

    });

    const videos = [];

    details.items.forEach(video => {

        if (this.isShort(video)) {

            return;

        }

        if (

            video.snippet.liveBroadcastContent === "live"

        ) {

            return;

        }

        videos.push({

            id: video.id,

            title: video.snippet.title,

            description: video.snippet.description,

            thumbnail: this.thumbnail(

                video.snippet.thumbnails

            ),

            duration: this.formatDuration(

                video.contentDetails.duration

            ),

            date: this.formatDate(

                video.snippet.publishedAt

            ),

            views: this.formatNumber(

                video.statistics.viewCount

            ),

            url:

                "https://www.youtube.com/watch?v=" +

                video.id,

            live:

                video.snippet.title

                .toLowerCase()

                .includes("live")

        });

    });

    this.latestVideos = videos.slice(0, 30);

    this.setCache(

        "videos",

        this.latestVideos

    );

    return this.latestVideos;

};


/* ==========================================================
   VIDEO CARD
========================================================== */

YouTubeEngine.prototype.videoCard = function (video) {

    return `

<div class="video-card reveal">

<a
href="${video.url}"
target="_blank"
class="video-thumbnail">

<img
src="${video.thumbnail}"
loading="lazy"
alt="${video.title}">

${video.live ? `

<div class="live-badge">

🔴 LIVE

</div>

` : ""}

<div class="video-duration">

${video.duration}

</div>

</a>

<div class="video-content">

<h3 class="video-title">

${video.title}

</h3>

<div class="video-meta">

<span>

👁 ${video.views}

</span>

<span>

📅 ${video.date}

</span>

</div>

<a
href="${video.url}"
target="_blank"
class="watch-button">

▶ Watch Now

</a>

</div>

</div>

`;

};


/* ==========================================================
   RENDER VIDEOS
========================================================== */

YouTubeEngine.prototype.renderVideos = function () {

    const container = document.querySelector(

        "#latestVideos"

    );

    if (!container) {

        return;

    }

    container.innerHTML = "";

    this.latestVideos.forEach(video => {

        container.insertAdjacentHTML(

            "beforeend",

            this.videoCard(video)

        );

    });

};


/* ==========================================================
   LOAD VIDEOS
========================================================== */

YouTubeEngine.prototype.loadVideos = async function () {

    try {

        await this.getLatestVideos();

        this.renderVideos();

        console.log(

            "📺 Latest Videos Loaded"

        );

    }

    catch (error) {

        console.error(

            "Videos Error:",

            error

        );

    }

};


/* ==========================================================
   END PART 4
========================================================== */

/* ==========================================================
   PLAYLISTS & SHORTS ENGINE
   Version : 2.0.0
   Part 5
========================================================== */

/* ==========================================================
   GET PLAYLISTS
========================================================== */

YouTubeEngine.prototype.getPlaylists = async function () {

    const cache = this.getCache("playlists");

    if (cache) {

        this.playlists = cache;

        return cache;

    }

    const response = await this.request("playlists", {

        part: "snippet,contentDetails",

        channelId: this.config.CHANNEL_ID,

        maxResults: 50

    });

    this.playlists = response.items.map(item => ({

        id: item.id,

        title: item.snippet.title,

        description: item.snippet.description,

        thumbnail: this.thumbnail(

            item.snippet.thumbnails

        ),

        count: Number(

            item.contentDetails.itemCount

        ),

        url:

            "https://www.youtube.com/playlist?list=" +

            item.id

    }));

    this.setCache(

        "playlists",

        this.playlists

    );

    return this.playlists;

};


/* ==========================================================
   RENDER PLAYLISTS
========================================================== */

YouTubeEngine.prototype.renderPlaylists = function () {

    const container = document.querySelector(

        "#playlistGrid"

    );

    if (!container) {

        return;

    }

    container.innerHTML = "";

    this.playlists.forEach(list => {

        container.insertAdjacentHTML(

            "beforeend",

`

<div class="playlist-card reveal">

<a
href="${list.url}"
target="_blank"
class="playlist-thumb">

<img
src="${list.thumbnail}"
loading="lazy"
alt="${list.title}">

<div class="playlist-count">

📚 ${list.count} Videos

</div>

</a>

<div class="playlist-content">

<h3>

${list.title}

</h3>

<p>

${list.description}

</p>

<a
href="${list.url}"
target="_blank"
class="watch-button">

Open Playlist

</a>

</div>

</div>

`

        );

    });

};


/* ==========================================================
   LOAD PLAYLISTS
========================================================== */

YouTubeEngine.prototype.loadPlaylists = async function () {

    try {

        await this.getPlaylists();

        this.renderPlaylists();

        console.log(

            "📚 Playlists Loaded"

        );

    }

    catch (error) {

        console.error(

            "Playlist Error:",

            error

        );

    }

};


/* ==========================================================
   GET SHORTS
========================================================== */

YouTubeEngine.prototype.getShorts = function () {

    this.shorts = this.latestVideos.filter(video => {

        return (

            video.duration === "0:59" ||

            video.duration === "00:59" ||

            video.duration === "0:58" ||

            video.duration === "00:58"

        );

    });

    return this.shorts;

};


/* ==========================================================
   RENDER SHORTS
========================================================== */

YouTubeEngine.prototype.renderShorts = function () {

    const container = document.querySelector(

        "#shortsGrid"

    );

    if (!container) {

        return;

    }

    container.innerHTML = "";

    this.shorts.forEach(video => {

        container.insertAdjacentHTML(

            "beforeend",

            this.videoCard(video)

        );

    });

};


/* ==========================================================
   LOAD SHORTS
========================================================== */

YouTubeEngine.prototype.loadShorts = async function () {

    if (

        this.latestVideos.length === 0

    ) {

        await this.loadVideos();

    }

    this.getShorts();

    this.renderShorts();

    console.log(

        "📱 Shorts Loaded"

    );

};


/* ==========================================================
   PRELOAD
========================================================== */

YouTubeEngine.prototype.preloadImages = function () {

    [

        ...this.latestVideos,

        ...this.playlists

    ].forEach(item => {

        if (!item.thumbnail) {

            return;

        }

        const image = new Image();

        image.src = item.thumbnail;

    });

};


/* ==========================================================
   END PART 5
========================================================== */

/* ==========================================================
   18 BANI HASHIM
   YOUTUBE ENGINE
   Part 6 (FINAL)
========================================================== */


/* ==========================================================
   GET SHORTS (SEPARATE API)
========================================================== */

YouTubeEngine.prototype.fetchShorts = async function () {

    const cache = this.getCache("shorts");

    if (cache) {

        this.shorts = cache;

        return cache;

    }

    const response = await this.request("search", {

        part: "snippet",

        channelId: this.config.CHANNEL_ID,

        order: "date",

        type: "video",

        maxResults: 50

    });

    const ids = response.items.map(item => item.id.videoId);

    if (!ids.length) {

        this.shorts = [];

        return [];

    }

    const details = await this.request("videos", {

        part: "snippet,contentDetails,statistics",

        id: ids.join(",")

    });

    this.shorts = details.items

        .filter(video => this.isShort(video))

        .map(video => ({

            id: video.id,

            title: video.snippet.title,

            thumbnail: this.thumbnail(

                video.snippet.thumbnails

            ),

            duration: this.formatDuration(

                video.contentDetails.duration

            ),

            views: this.formatNumber(

                video.statistics.viewCount

            ),

            date: this.formatDate(

                video.snippet.publishedAt

            ),

            url:

                "https://www.youtube.com/watch?v=" +

                video.id

        }));

    this.setCache(

        "shorts",

        this.shorts

    );

    return this.shorts;

};


/* ==========================================================
   LOAD SHORTS PAGE
========================================================== */

YouTubeEngine.prototype.loadShortsPage = async function () {

    try {

        await this.fetchShorts();

        this.renderShorts();

        console.log(

            "✅ Shorts Page Loaded"

        );

    }

    catch (error) {

        console.error(

            error

        );

    }

};


/* ==========================================================
   CLEAR CACHE
========================================================== */

YouTubeEngine.prototype.clearCache = function () {

    this.cache.clear();

};


/* ==========================================================
   REFRESH
========================================================== */

YouTubeEngine.prototype.refresh = async function () {

    this.clearCache();

    await this.loadChannel();

    await this.loadLive();

    await this.loadVideos();

};


/* ==========================================================
   AUTO INITIALIZE
========================================================== */

YouTubeEngine.prototype.start = async function () {

    try {

        await this.init();

        await this.loadChannel();

        await this.loadLive();

        await this.loadVideos();

        this.startLiveRefresh();

        console.log(

            "🚀 Website Ready"

        );

    }

    catch (error) {

        console.error(

            "Initialization Failed",

            error

        );

    }

};


/* ==========================================================
   DESTROY
========================================================== */

YouTubeEngine.prototype.destroy = function () {

    if (

        this.abortController

    ) {

        this.abortController.abort();

    }

    this.cache.clear();

};


/* ==========================================================
   PAGE AUTO DETECTION
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await YouTube.start();

        if (

            document.querySelector(

                "#playlistGrid"

            )

        ) {

            await YouTube.loadPlaylists();

        }

        if (

            document.querySelector(

                "#shortsGrid"

            )

        ) {

            await YouTube.loadShortsPage();

        }

    }

);


/* ==========================================================
   GLOBAL
========================================================== */

window.YouTube = YouTube;


/* ==========================================================
   END OF FILE
========================================================== */

