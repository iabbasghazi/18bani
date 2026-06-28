'use strict';

/* ==========================================================
   18 BANI HASHIM
   LIVE ENGINE
   Version : V1.0.0
   ========================================================== */

const LiveEngine = {

    interval: 60000,

    timer: null,

    currentLive: null,

    listeners: []

};

/* ==========================================================
   START LIVE MONITORING
========================================================== */

function startLiveMonitoring() {

    checkLiveStatus();

    LiveEngine.timer = setInterval(

        checkLiveStatus,

        LiveEngine.interval

    );

}

/* ==========================================================
   STOP LIVE MONITORING
========================================================== */

function stopLiveMonitoring() {

    if (LiveEngine.timer) {

        clearInterval(LiveEngine.timer);

        LiveEngine.timer = null;

    }

}

/* ==========================================================
   CHECK LIVE STATUS
========================================================== */

async function checkLiveStatus() {

    try {

        const data = await getLiveVideo();

        const liveItems =
            data?.items || [];

        if (liveItems.length > 0) {

            const liveVideo = liveItems[0];

            handleLiveStart(liveVideo);

        } else {

            handleLiveEnd();

        }

    } catch (error) {

        console.error(
            'Live check failed:',
            error
        );

    }

}

/* ==========================================================
   HANDLE LIVE START
========================================================== */

function handleLiveStart(video) {

    if (!video) return;

    LiveEngine.currentLive = video;

    updateHeaderLiveBadge(true);

    updateHeroLive(video);

    showLiveNotice(video);

    triggerLiveNotification(video);

}

/* ==========================================================
   HANDLE LIVE END
========================================================== */

function handleLiveEnd() {

    LiveEngine.currentLive = null;

    updateHeaderLiveBadge(false);

    hideHeroLive();

    hideLiveNotice();

}

/* ==========================================================
   UI UPDATES
========================================================== */

function updateHeaderLiveBadge(state) {

    const badge =
        document.getElementById('header-live-badge');

    if (!badge) return;

    badge.hidden = !state;

}

/* ==========================================================
   HERO LIVE
========================================================== */

function updateHeroLive(video) {

    const section =
        document.getElementById('hero-live-section');

    if (!section) return;

    section.hidden = false;

    const title =
        document.getElementById('hero-live-title');

    if (title) {

        title.textContent =
            video?.snippet?.title || '';

    }

}

/* ==========================================================
   HIDE HERO
========================================================== */

function hideHeroLive() {

    const section =
        document.getElementById('hero-live-section');

    if (section) {

        section.hidden = true;

    }

}

/* ==========================================================
   LIVE NOTICE
========================================================== */

function showLiveNotice(video) {

    const notice =
        document.getElementById('liveNotice');

    if (!notice) return;

    notice.hidden = false;

    const title =
        document.getElementById('liveNoticeTitle');

    if (title) {

        title.textContent =
            video?.snippet?.title || '';

    }

}

/* ==========================================================
   HIDE NOTICE
========================================================== */

function hideLiveNotice() {

    const notice =
        document.getElementById('liveNotice');

    if (notice) {

        notice.hidden = true;

    }

}

/* ==========================================================
   NOTIFICATION TRIGGER
========================================================== */

function triggerLiveNotification(video) {

    console.log(
        'LIVE STARTED:',
        video?.snippet?.title
    );

}

/* ==========================================================
   AUTO START
========================================================== */

startLiveMonitoring();
