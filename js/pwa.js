'use strict';

/* ==========================================================
   18 BANI HASHIM
   PWA ENGINE
   Version : V1.0.0
   ========================================================== */

const PWA = {

    deferredPrompt: null,

    isInstalled: false

};

/* ==========================================================
   REGISTER SERVICE WORKER
========================================================== */

function registerServiceWorker() {

    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', async () => {

        try {

            const registration = await navigator.serviceWorker.register('sw.js');

            console.log('SW registered:', registration.scope);

        } catch (err) {

            console.error('SW registration failed:', err);

        }

    });

}

/* ==========================================================
   INSTALL PROMPT HANDLER
========================================================== */

function handleInstallPrompt() {

    window.addEventListener('beforeinstallprompt', (e) => {

        e.preventDefault();

        PWA.deferredPrompt = e;

        showInstallButton();

    });

}

/* ==========================================================
   SHOW INSTALL BUTTON
========================================================== */

function showInstallButton() {

    const btn = document.createElement('button');

    btn.id = 'installAppButton';

    btn.className = 'install-button';

    btn.textContent = 'Install App';

    document.body.appendChild(btn);

    btn.addEventListener('click', async () => {

        if (!PWA.deferredPrompt) return;

        PWA.deferredPrompt.prompt();

        const choice = await PWA.deferredPrompt.userChoice;

        if (choice.outcome === 'accepted') {

            PWA.isInstalled = true;

        }

        PWA.deferredPrompt = null;

        btn.remove();

    });

}

/* ==========================================================
   OFFLINE DETECTION
========================================================== */

function handleOfflineMode() {

    window.addEventListener('offline', () => {

        document.body.classList.add('offline');

    });

    window.addEventListener('online', () => {

        document.body.classList.remove('offline');

    });

}

/* ==========================================================
   INIT PWA
========================================================== */

function initPWA() {

    registerServiceWorker();

    handleInstallPrompt();

    handleOfflineMode();

}

/* Auto start */

initPWA();
