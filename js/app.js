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
