/* ==========================================================
   18 BANI HASHIM
   YouTube Engine
   Version : 3.0.0
========================================================== */

'use strict';

class YouTubeAPI {

    constructor() {

        this.config = CONFIG.YOUTUBE;

        this.apiKey = this.config.API_KEY;

        this.channelId = this.config.CHANNEL_ID;

        this.baseURL = this.config.BASE_URL;

        this.cache = new Map();

        this.channel = null;

        this.live = null;

        this.videos = [];

        this.playlists = [];

        this.shorts = [];

        this.initialized = false;

        this.loading = false;

    }

    /* =====================================================
       INITIALIZE
    ===================================================== */

    async init() {

        if (this.initialized) {

            return;

        }

        this.validate();

        this.loading = true;

        await this.bootstrap();

        this.initialized = true;

        this.loading = false;

        console.log("YouTube Engine Ready");

    }

    /* =====================================================
       VALIDATE
    ===================================================== */

    validate() {

        if (!this.apiKey) {

            throw new Error("YouTube API Key Missing");

        }

        if (!this.channelId) {

            throw new Error("Channel ID Missing");

        }

    }

    /* =====================================================
       BOOTSTRAP
    ===================================================== */

    async bootstrap() {

        await Promise.all([

            this.loadChannel(),

            this.loadLive(),

            this.loadVideos(),

            this.loadPlaylists()

        ]);

    }

    /* =====================================================
       REQUEST
    ===================================================== */

    async request(endpoint, params = {}) {

        params.key = this.apiKey;

        const url = new URL(

            this.baseURL + endpoint

        );

        Object.keys(params).forEach(key => {

            url.searchParams.append(

                key,

                params[key]

            );

        });

        const response = await fetch(

            url.toString()

        );

        if (!response.ok) {

            throw new Error(

                "YouTube API Error"

            );

        }

        return await response.json();

    }

    /* =====================================================
       CACHE
    ===================================================== */

    getCache(key) {

        const data = this.cache.get(key);

        if (!data) {

            return null;

        }

        if (

            Date.now() >

            data.expire

        ) {

            this.cache.delete(key);

            return null;

        }

        return data.value;

    }

    setCache(

        key,

        value,

        time = CONFIG.CACHE.CHANNEL

    ) {

        this.cache.set(key, {

            value,

            expire: Date.now() + time

        });

    }

    clearCache() {

        this.cache.clear();

    }

    /* =====================================================
       HELPERS
    ===================================================== */

    formatNumber(number) {

        number = Number(number);

        if (number >= 1000000000) {

            return (

                number / 1000000000

            ).toFixed(1) + "B";

        }

        if (number >= 1000000) {

            return (

                number / 1000000

            ).toFixed(1) + "M";

        }

        if (number >= 1000) {

            return (

                number / 1000

            ).toFixed(1) + "K";

        }

        return number.toString();

    }

    formatDate(date) {

        return new Date(date)

        .toLocaleDateString(

            "en-IN",

            {

                day: "numeric",

                month: "short",

                year: "numeric"

            }

        );

    }

    bestThumbnail(thumbnails) {

        return (

            thumbnails.maxres?.url ||

            thumbnails.standard?.url ||

            thumbnails.high?.url ||

            thumbnails.medium?.url ||

            thumbnails.default?.url ||

            ""

        );

    }

    setText(selector, text) {

        const element = document.querySelector(selector);

        if (element) {

            element.textContent = text;

        }

    }

    setImage(selector, src) {

        const element = document.querySelector(selector);

        if (element) {

            element.src = src;

        }

    }

    setBackground(selector, image) {

        const element = document.querySelector(selector);

        if (element) {

            element.style.backgroundImage =

                `url("${image}")`;

        }

    }


    /* =====================================================
       LOAD CHANNEL
    ===================================================== */

    async loadChannel() {

        const cache = this.getCache("channel");

        if (cache) {

            this.channel = cache;

            this.renderChannel();

            return;

        }

        const response = await this.request(

            "/channels",

            {

                part: "snippet,statistics,brandingSettings",

                id: this.channelId

            }

        );

        if (

            !response.items ||

            !response.items.length

        ) {

            throw new Error(

                "Channel Not Found"

            );

        }

        this.channel = response.items[0];

        this.setCache(

            "channel",

            this.channel,

            CONFIG.CACHE.CHANNEL

        );

        this.renderChannel();

    }

    /* =====================================================
       RENDER CHANNEL
    ===================================================== */

    renderChannel() {

        if (!this.channel) return;

        const snippet =

            this.channel.snippet;

        const stats =

            this.channel.statistics;

        const branding =

            this.channel.brandingSettings;

        this.setText(

            "#channelName",

            snippet.title

        );

        this.setText(

            "#channelHandle",

            snippet.customUrl ||

            "@18BaniHashim"

        );

        this.setText(

            "#subscriberCount",

            this.formatNumber(

                stats.subscriberCount

            ) +

            " Subscribers"

        );

        this.setText(

            "#videoCount",

            this.formatNumber(

                stats.videoCount

            ) +

            " Videos"

        );

        this.setText(

            "#viewCount",

            this.formatNumber(

                stats.viewCount

            ) +

            " Views"

        );

        this.setText(

            "#channelBio",

            snippet.description

        );

        this.setImage(

            "#channelLogo",

            this.bestThumbnail(

                snippet.thumbnails

            )

        );

        if (

            branding?.image

                ?.bannerExternalUrl

        ) {

            this.setBackground(

                "#channelBanner",

                branding.image

                .bannerExternalUrl

            );

        }

        this.renderVerification();

    }

    /* =====================================================
       VERIFIED BADGE
    ===================================================== */

    renderVerification() {

        const badge =

            document.querySelector(

                "#verifiedBadge"

            );

        if (!badge) return;

        badge.innerHTML = `

<svg
width="18"
height="18"
viewBox="0 0 24 24"
fill="#3ea6ff">

<path d="M22 12l-2.1 2.4.3 3.2-3.1.7-1.6 2.8L12 20l-3.5 1.1-1.6-2.8-3.1-.7.3-3.2L2 12l2.1-2.4-.3-3.2 3.1-.7L8.5 3 12 4l3.5-1 1.6 2.7 3.1.7-.3 3.2z"/>

<path
d="M10.2 15.3l-2.4-2.4 1.1-1.1 1.3 1.3 4-4 1.1 1.1z"
fill="#fff"/>

</svg>

`;

    }

    /* =====================================================
       SHOW CHANNEL
    ===================================================== */

    showChannel() {

        const loading =

            document.querySelector(

                "#channelLoading"

            );

        if (loading) {

            loading.remove();

        }

        const section =

            document.querySelector(

                "#channelSection"

            );

        if (section) {

            section.classList.add(

                "loaded"

            );

        }

    }

    /* =====================================================
       END PART 2
    ===================================================== */

    /* =====================================================
       LOAD LIVE STREAM
    ===================================================== */

    async loadLive() {

        const cache = this.getCache("live");

        if (cache) {

            this.live = cache;

            this.renderLive();

            return;

        }

        const response = await this.request(

            "/search",

            {

                part: "snippet",

                channelId: this.channelId,

                eventType: "live",

                type: "video",

                maxResults: 1

            }

        );

        if (

            !response.items ||

            !response.items.length

        ) {

            this.hideLive();

            return;

        }

        const liveId =

            response.items[0].id.videoId;

        const details = await this.request(

            "/videos",

            {

                part:

                "snippet,statistics,liveStreamingDetails,contentDetails",

                id: liveId

            }

        );

        if (

            !details.items ||

            !details.items.length

        ) {

            this.hideLive();

            return;

        }

        this.live = details.items[0];

        this.setCache(

            "live",

            this.live,

            CONFIG.CACHE.LIVE

        );

        this.renderLive();

    }

    /* =====================================================
       RENDER LIVE
    ===================================================== */

    renderLive() {

        if (!this.live) {

            this.hideLive();

            return;

        }

        const live = this.live;

        this.setText(

            "#liveTitle",

            live.snippet.title

        );

        this.setText(

            "#liveViews",

            this.formatNumber(

                live.statistics.viewCount

            ) + " Views"

        );

        this.setText(

            "#liveWatching",

            this.formatNumber(

                live.liveStreamingDetails
                ?.concurrentViewers || 0

            ) + " Watching"

        );

        this.setText(

            "#liveDate",

            this.formatDate(

                live.snippet.publishedAt

            )

        );

        this.setImage(

            "#liveThumbnail",

            this.bestThumbnail(

                live.snippet.thumbnails

            )

        );

        const button =

            document.querySelector(

                "#watchLive"

            );

        if (button) {

            button.href =

                "https://www.youtube.com/watch?v=" +

                live.id;

        }

        const frame =

            document.querySelector(

                "#livePlayer"

            );

        if (frame) {

            frame.src =

                "https://www.youtube.com/embed/" +

                live.id +

                "?autoplay=0&rel=0";

        }

        const section =

            document.querySelector(

                "#liveSection"

            );

        if (section) {

            section.classList.add(

                "active"

            );

        }

    }

    /* =====================================================
       HIDE LIVE
    ===================================================== */

    hideLive() {

        const section =

            document.querySelector(

                "#liveSection"

            );

        if (section) {

            section.style.display = "none";

        }

    }

    /* =====================================================
       LIVE AUTO REFRESH
    ===================================================== */

    startLiveRefresh() {

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

    }

    /* =====================================================
       LIVE STATUS
    ===================================================== */

    isLive() {

        return this.live !== null;

    }

    /* =====================================================
       END PART 3
    ===================================================== */

    /* =====================================================
       LOAD LATEST VIDEOS
    ===================================================== */

    async loadVideos() {

        const cache = this.getCache("videos");

        if (cache) {

            this.videos = cache;

            this.renderVideos();

            return;

        }

        const search = await this.request(

            "/search",

            {

                part: "snippet",

                channelId: this.channelId,

                order: "date",

                type: "video",

                maxResults: 50

            }

        );

        if (

            !search.items ||

            !search.items.length

        ) {

            this.showVideoError();

            return;

        }

        const ids = search.items

            .map(item => item.id.videoId)

            .join(",");

        const details = await this.request(

            "/videos",

            {

                part:

                "snippet,contentDetails,statistics",

                id: ids

            }

        );

        this.videos = details.items

            .filter(video => {

                if (

                    video.snippet

                    .liveBroadcastContent ===

                    "live"

                ) {

                    return false;

                }

                return !this.isShort(video);

            })

            .slice(0, 30);

        this.setCache(

            "videos",

            this.videos,

            CONFIG.CACHE.VIDEOS

        );

        this.renderVideos();

    }

    /* =====================================================
       RENDER VIDEOS
    ===================================================== */

    renderVideos() {

        const container =

            document.querySelector(

                "#latestVideos"

            );

        if (!container) return;

        container.innerHTML = "";

        this.videos.forEach(video => {

            container.insertAdjacentHTML(

                "beforeend",

                this.videoCard(video)

            );

        });

    }

    /* =====================================================
       VIDEO CARD
    ===================================================== */

    videoCard(video) {

        return `

<div class="video-card reveal">

<a
href="https://www.youtube.com/watch?v=${video.id}"
target="_blank"
class="video-thumb">

<img

loading="lazy"

src="${this.bestThumbnail(

video.snippet.thumbnails

)}"

alt="${video.snippet.title}"

>

<span class="duration">

${this.formatDuration(

video.contentDetails.duration

)}

</span>

</a>

<div class="video-info">

<h3 class="video-title">

${video.snippet.title}

</h3>

<div class="video-meta">

<span>

👁

${this.formatNumber(

video.statistics.viewCount

)}

</span>

<span>

📅

${this.formatDate(

video.snippet.publishedAt

)}

</span>

</div>

<a

class="watch-button"

target="_blank"

href="https://www.youtube.com/watch?v=${video.id}"

>

Watch Now

</a>

</div>

</div>

`;

    }

    /* =====================================================
       NO VIDEOS
    ===================================================== */

    showVideoError() {

        const container =

            document.querySelector(

                "#latestVideos"

            );

        if (!container) return;

        container.innerHTML =

`

<div class="empty-state">

No Videos Available

</div>

`;

    }

    /* =====================================================
       END PART 4
    ===================================================== */
