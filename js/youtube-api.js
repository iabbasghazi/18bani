/* ==========================================================
   18 BANI HASHIM
   YouTube API Engine
   File : youtube-api.js
   Version : 4.0.0
========================================================== */

'use strict';

class YouTubeAPI {

    constructor(config = CONFIG.YOUTUBE) {

        this.config = config;

        this.apiKey = config.API_KEY;

        this.channelId = config.CHANNEL_ID;

        this.baseURL = config.BASE_URL;

        this.timeout = 15000;

        this.retry = 3;

        this.retryDelay = 1000;

        this.initialized = false;

    }

    /* =====================================================
       INITIALIZE
    ===================================================== */

    async init() {

        if (this.initialized) {

            return;

        }

        this.validateConfig();

        this.initialized = true;

        console.log(

            "%cYouTube API Ready",

            "color:#24d5ff;font-weight:bold;"

        );

    }

    /* =====================================================
       VALIDATE CONFIG
    ===================================================== */

    validateConfig() {

        if (!this.apiKey) {

            throw new Error(

                "CONFIG.YOUTUBE.API_KEY Missing"

            );

        }

        if (!this.channelId) {

            throw new Error(

                "CONFIG.YOUTUBE.CHANNEL_ID Missing"

            );

        }

    }

    /* =====================================================
       BUILD URL
    ===================================================== */

    createURL(

        endpoint,

        params = {}

    ) {

        const url = new URL(

            this.baseURL + endpoint

        );

        params.key = this.apiKey;

        Object.entries(params).forEach(

            ([key, value]) => {

                if (

                    value !== null &&

                    value !== undefined

                ) {

                    url.searchParams.append(

                        key,

                        value

                    );

                }

            }

        );

        return url;

    }

    /* =====================================================
       FETCH REQUEST
    ===================================================== */

    async request(

        endpoint,

        params = {}

    ) {

        return await this.fetchWithRetry(

            endpoint,

            params,

            this.retry

        );

    }

    /* =====================================================
       FETCH WITH RETRY
    ===================================================== */

    async fetchWithRetry(

        endpoint,

        params,

        retry

    ) {

        const url = this.createURL(

            endpoint,

            params

        );

        try {

            const controller =

                new AbortController();

            const timer = setTimeout(

                () => controller.abort(),

                this.timeout

            );

            const response = await fetch(

                url,

                {

                    signal:

                    controller.signal

                }

            );

            clearTimeout(timer);

            if (!response.ok) {

                throw new Error(

                    `HTTP ${response.status}`

                );

            }

            const json =

                await response.json();

            return json;

        }

        catch (error) {

            if (retry > 0) {

                await this.wait(

                    this.retryDelay

                );

                return this.fetchWithRetry(

                    endpoint,

                    params,

                    retry - 1

                );

            }

            throw error;

        }

    }

    /* =====================================================
       WAIT
    ===================================================== */

    wait(ms) {

        return new Promise(

            resolve =>

                setTimeout(

                    resolve,

                    ms

                )

        );

    }


    /* =====================================================
       RESPONSE VALIDATION
    ===================================================== */

    validateResponse(response) {

        if (!response) {

            throw new Error(

                "Empty API Response"

            );

        }

        if (response.error) {

            throw new Error(

                response.error.message ||

                "YouTube API Error"

            );

        }

        return true;

    }

    /* =====================================================
       GET CHANNEL
    ===================================================== */

    async getChannel() {

        const response = await this.request(

            "/channels",

            {

                part:

                "snippet,statistics,brandingSettings",

                id: this.channelId

            }

        );

        this.validateResponse(response);

        return response.items?.[0] || null;

    }

    /* =====================================================
       SEARCH VIDEOS
    ===================================================== */

    async searchVideos(options = {}) {

        const response = await this.request(

            "/search",

            {

                part: "snippet",

                channelId: this.channelId,

                type: "video",

                order: "date",

                maxResults: 50,

                ...options

            }

        );

        this.validateResponse(response);

        return response.items || [];

    }

    /* =====================================================
       GET VIDEO DETAILS
    ===================================================== */

    async getVideos(videoIds = []) {

        if (!videoIds.length) {

            return [];

        }

        const response = await this.request(

            "/videos",

            {

                part:

                "snippet,statistics,contentDetails,liveStreamingDetails",

                id: videoIds.join(",")

            }

        );

        this.validateResponse(response);

        return response.items || [];

    }

    /* =====================================================
       GET PLAYLISTS
    ===================================================== */

    async getPlaylists() {

        const response = await this.request(

            "/playlists",

            {

                part:

                "snippet,contentDetails",

                channelId: this.channelId,

                maxResults: 50

            }

        );

        this.validateResponse(response);

        return response.items || [];

    }

    /* =====================================================
       GET LIVE STREAM
    ===================================================== */

    async getLiveStream() {

        const live = await this.searchVideos({

            eventType: "live",

            maxResults: 1

        });

        if (!live.length) {

            return null;

        }

        const details = await this.getVideos([

            live[0].id.videoId

        ]);

        return details[0] || null;

    }

    /* =====================================================
       GET LATEST VIDEOS
    ===================================================== */

    async getLatestVideos(limit = 30) {

        const search = await this.searchVideos({

            maxResults: 50

        });

        const ids = search.map(

            item => item.id.videoId

        );

        const videos = await this.getVideos(ids);

        return videos.slice(0, limit);

    }

    /* =====================================================
       PING API
    ===================================================== */

    async ping() {

        try {

            await this.getChannel();

            return true;

        }

        catch (error) {

            console.error(

                "[YouTube API] Connection Failed",

                error

            );

            return false;

        }

    }

    /* =====================================================
       RESET
    ===================================================== */

    reset() {

        this.initialized = false;

    }

    /* =====================================================
       GET CONFIG
    ===================================================== */

    getConfig() {

        return {

            apiKey: this.apiKey,

            channelId: this.channelId,

            baseURL: this.baseURL,

            timeout: this.timeout,

            retry: this.retry

        };

    }

    /* =====================================================
       SET TIMEOUT
    ===================================================== */

    setTimeout(ms) {

        this.timeout = Number(ms);

    }

    /* =====================================================
       SET RETRY
    ===================================================== */

    setRetry(count) {

        this.retry = Number(count);

    }

    /* =====================================================
       DESTROY
    ===================================================== */

    destroy() {

        this.reset();

        this.apiKey = null;

        this.channelId = null;

    }

}

/* ==========================================================
   CREATE INSTANCE
========================================================== */

const YouTubeAPIEngine = new YouTubeAPI();

/* ==========================================================
   GLOBAL ACCESS
========================================================== */

window.YouTubeAPI = YouTubeAPIEngine;

/* ==========================================================
   AUTO INITIALIZE
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        try {

            await YouTubeAPI.init();

        }

        catch (error) {

            console.error(

                "[YouTube API]",

                error

            );

        }

    }

);

/* ==========================================================
   END OF FILE
========================================================== */
