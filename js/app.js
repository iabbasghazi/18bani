'use strict';

/* ==========================================================
   18 BANI HASHIM
   app.js
   Version : V1.0.0
   ========================================================== */

const App = {

    loader: null,
    cursorGlow: null,

    header: null,

    liveNotice: null,

    watchLiveButton: null,

    dismissLiveNotice: null,

    notificationButton: null,

    notificationCounter: null,

    themeSwitcherButton: null,

    mobileMenuButton: null,

    headerSearchButton: null,

    liveBadge: null

};

document.addEventListener(
    'DOMContentLoaded',
    initializeApplication
);

function initializeApplication() {

    cacheElements();

    bindEvents();

    initializeLoader();

    initializeCursorGlow();

}

function cacheElements() {

    App.loader =
        document.getElementById('page-loader');

    App.cursorGlow =
        document.getElementById('cursor-glow');

    App.header =
        document.getElementById('site-header');

    App.liveNotice =
        document.getElementById('liveNotice');

    App.watchLiveButton =
        document.getElementById('watchLiveButton');

    App.dismissLiveNotice =
        document.getElementById('dismissLiveNotice');

    App.notificationButton =
        document.getElementById('notificationButton');

    App.notificationCounter =
        document.getElementById('notificationCounter');

    App.themeSwitcherButton =
        document.getElementById('themeSwitcherButton');

    App.mobileMenuButton =
        document.getElementById('mobileMenuButton');

    App.headerSearchButton =
        document.getElementById('headerSearchButton');

    App.liveBadge =
        document.getElementById('header-live-badge');

}

function bindEvents() {

    window.addEventListener(
        'load',
        hideLoader,
        {
            once: true
        }
    );

    document.addEventListener(
        'mousemove',
        updateCursorGlow,
        {
            passive: true
        }
    );

    if (App.dismissLiveNotice) {

        App.dismissLiveNotice.addEventListener(

            'click',

            closeLiveNotice

        );

    }

    if (App.headerSearchButton) {

        App.headerSearchButton.addEventListener(

            'click',

            openSearch

        );

    }

    if (App.notificationButton) {

        App.notificationButton.addEventListener(

            'click',

            openNotifications

        );

    }

    if (App.themeSwitcherButton) {

        App.themeSwitcherButton.addEventListener(

            'click',

            changeTheme

        );

    }

    if (App.mobileMenuButton) {

        App.mobileMenuButton.addEventListener(

            'click',

            toggleMobileNavigation

        );

    }

}

function initializeLoader() {

    if (!App.loader) {

        return;

    }

    App.loader.classList.remove(
        'loaded'
    );

}

function hideLoader() {

    if (!App.loader) {

        return;

    }

    requestAnimationFrame(() => {

        App.loader.classList.add(
            'loaded'
        );

    });

}

function initializeCursorGlow() {

    if (!App.cursorGlow) {

        return;

    }

    App.cursorGlow.style.left = '50%';

    App.cursorGlow.style.top = '50%';

}

function updateCursorGlow(event) {

    if (!App.cursorGlow) {

        return;

    }

    App.cursorGlow.style.left =
        `${event.clientX}px`;

    App.cursorGlow.style.top =
        `${event.clientY}px`;

}

function closeLiveNotice() {

    if (!App.liveNotice) {

        return;

    }

    App.liveNotice.hidden = true;

}

function openSearch() {

    console.log(
        'Search Button Clicked'
    );

}

function openNotifications() {

    console.log(
        'Notification Button Clicked'
    );

}

function changeTheme() {

    console.log(
        'Theme Switch Requested'
    );

}

function toggleMobileNavigation() {

    const expanded =
        App.mobileMenuButton.getAttribute(
            'aria-expanded'
        ) === 'true';

    App.mobileMenuButton.setAttribute(

        'aria-expanded',

        String(!expanded)

    );

}

'use strict';

/* ==========================================================
   18 BANI HASHIM
   APP CORE INTEGRATION
   Version : V1.0.0
   ========================================================== */

/* ==========================================================
   BOOT APPLICATION
========================================================== */

document.addEventListener('DOMContentLoaded', bootApp);

function bootApp() {

    initCoreSystems();

    connectModules();

    hydrateUI();

}

/* ==========================================================
   INIT CORE SYSTEMS
========================================================== */

function initCoreSystems() {

    if (typeof initPWA === 'function') initPWA();

    if (typeof initNotifications === 'function') initNotifications();

    if (typeof initSearch === 'function') initSearch();

    if (typeof initTheme === 'function') initTheme();

    if (typeof startLiveMonitoring === 'function') startLiveMonitoring();

}

/* ==========================================================
   CONNECT MODULES
========================================================== */

function connectModules() {

    bindGlobalEvents();

}

/* ==========================================================
   GLOBAL EVENTS
========================================================== */

function bindGlobalEvents() {

    const watchBtn = document.getElementById('watchLiveButton');

    if (watchBtn) {

        watchBtn.addEventListener('click', () => {

            const liveSection = document.getElementById('hero-live-section');

            if (liveSection) {

                liveSection.scrollIntoView({ behavior: 'smooth' });

            }

        });

    }

    const shareBtn = document.getElementById('shareLiveButton');

    if (shareBtn) {

        shareBtn.addEventListener('click', async () => {

            try {

                await navigator.share({

                    title: document.title,

                    url: location.href

                });

            } catch (e) {

                console.log('Share cancelled');

            }

        });

    }

    const subscribeBtn = document.getElementById('subscribe-button');

    if (subscribeBtn) {

        subscribeBtn.addEventListener('click', () => {

            subscribeBtn.classList.toggle('subscribed');

            subscribeBtn.textContent =
                subscribeBtn.classList.contains('subscribed')
                    ? 'Subscribed'
                    : 'Subscribe';

        });

    }

}

/* ==========================================================
   HYDRATE UI FROM API
========================================================== */

async function hydrateUI() {

    try {

        if (typeof getChannelDetails === 'function') {

            const data = await getChannelDetails();

            updateChannelUI(data);

        }

        if (typeof getLatestVideos === 'function') {

            await getLatestVideos();

        }

        if (typeof getPlaylists === 'function') {

            await getPlaylists();

        }

    } catch (err) {

        console.error('UI hydration failed:', err);

    }

}

/* ==========================================================
   CHANNEL UI UPDATE
========================================================== */

function updateChannelUI(data) {

    const channel = data?.items?.[0];

    if (!channel) return;

    const stats = channel.statistics || {};

    const snippet = channel.snippet || {};

    const subs = document.getElementById('subscriber-count');

    const videos = document.getElementById('video-count');

    const desc = document.getElementById('channel-description');

    if (subs) subs.textContent = stats.subscriberCount || '--';

    if (videos) videos.textContent = stats.videoCount || '--';

    if (desc) desc.textContent = snippet.description || '';

}
