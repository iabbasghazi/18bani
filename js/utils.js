'use strict';

/* ==========================================================
   18 BANI HASHIM
   UTILS
   Version : V1.0.0
   ========================================================== */

/* ==========================================================
   SAFE ELEMENT GETTER
========================================================== */

function $(id) {

    return document.getElementById(id);

}

/* ==========================================================
   SAFE QUERY SELECTOR
========================================================== */

function $all(selector) {

    return document.querySelectorAll(selector);

}

/* ==========================================================
   FORMAT NUMBERS (Views, Subscribers)
========================================================== */

function formatNumber(num) {

    if (!num && num !== 0) return '0';

    if (num >= 1_000_000) {

        return (num / 1_000_000).toFixed(1) + 'M';

    }

    if (num >= 1_000) {

        return (num / 1_000).toFixed(1) + 'K';

    }

    return String(num);

}

/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate(dateString) {

    if (!dateString) return '';

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {

        year: 'numeric',

        month: 'short',

        day: 'numeric'

    });

}

/* ==========================================================
   DEBOUNCE FUNCTION
========================================================== */

function debounce(fn, delay = 300) {

    let timer;

    return function (...args) {

        clearTimeout(timer);

        timer = setTimeout(() => {

            fn.apply(this, args);

        }, delay);

    };

}

/* ==========================================================
   THROTTLE FUNCTION
========================================================== */

function throttle(fn, limit = 300) {

    let lastCall = 0;

    return function (...args) {

        const now = Date.now();

        if (now - lastCall >= limit) {

            lastCall = now;

            fn.apply(this, args);

        }

    };

}

/* ==========================================================
   SMOOTH SCROLL TO ELEMENT
========================================================== */

function scrollToElement(id) {

    const el = document.getElementById(id);

    if (!el) return;

    el.scrollIntoView({

        behavior: 'smooth',

        block: 'start'

    });

}

/* ==========================================================
   LOGGING (SAFE)
========================================================== */

function log(...args) {

    if (location.hostname === 'localhost') {

        console.log('[18BH]', ...args);

    }

}
