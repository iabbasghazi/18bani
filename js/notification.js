'use strict';

/* ==========================================================
   18 BANI HASHIM
   NOTIFICATION ENGINE
   Version : V1.0.0
   ========================================================== */

const NotificationEngine = {

    permission: Notification.permission,

    queue: [],

    isShowing: false

};

/* ==========================================================
   INIT NOTIFICATIONS
========================================================== */

function initNotifications() {

    requestPermission();

}

/* ==========================================================
   REQUEST PERMISSION
========================================================== */

function requestPermission() {

    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {

        Notification.requestPermission().then(permission => {

            NotificationEngine.permission = permission;

        });

    }

}

/* ==========================================================
   SHOW BROWSER NOTIFICATION
========================================================== */

function showBrowserNotification(title, body) {

    if (Notification.permission !== 'granted') return;

    new Notification(title, {

        body: body,

        icon: 'assets/logos/logo.svg'

    });

}

/* ==========================================================
   SHOW LIVE POPUP
========================================================== */

function showLivePopup(video) {

    const popup = document.createElement('div');

    popup.className = 'live-popup';

    popup.innerHTML = `

        <div class="live-popup-card">

            <div class="live-popup-header">

                <span class="live-dot"></span>

                <span>LIVE STARTED</span>

            </div>

            <div class="live-popup-body">

                <p>${video?.snippet?.title || ''}</p>

            </div>

            <div class="live-popup-actions">

                <button id="popupWatchBtn">Watch Now</button>

                <button id="popupCloseBtn">Dismiss</button>

            </div>

        </div>

    `;

    document.body.appendChild(popup);

    document.getElementById('popupCloseBtn')
        .addEventListener('click', () => {

            popup.remove();

        });

}

/* ==========================================================
   TRIGGER NOTIFICATION
========================================================== */

function triggerNotification(video) {

    showBrowserNotification(

        '🔴 LIVE STARTED',

        video?.snippet?.title || 'Live stream started'

    );

    showLivePopup(video);

}
