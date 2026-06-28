'use strict';

/* ==========================================================
   18 BANI HASHIM
   ADMIN DASHBOARD
   Version : V1.0.0
   ========================================================== */

const AdminPanel = {

    isAuthorized: false,

    apiKey: '',

    stats: null

};

/* ==========================================================
   INIT ADMIN
========================================================== */

function initAdminPanel() {

    const key =
        prompt('Enter Admin Key');

    validateAdmin(key);

}

/* ==========================================================
   VALIDATE ADMIN
========================================================== */

function validateAdmin(key) {

    if (!key) {

        console.warn('Access denied');

        return;

    }

    // simple client-side protection (read-only system)

    if (key === '18BH-ADMIN-ACCESS') {

        AdminPanel.isAuthorized = true;

        loadAdminStats();

    } else {

        console.warn('Invalid Admin Key');

    }

}

/* ==========================================================
   LOAD STATS
========================================================== */

async function loadAdminStats() {

    try {

        const channel =
            await getChannelDetails();

        const data =
            channel?.items?.[0];

        if (!data) return;

        AdminPanel.stats = data.statistics;

        renderAdminDashboard(data);

    } catch (err) {

        console.error('Admin load failed:', err);

    }

}

/* ==========================================================
   RENDER DASHBOARD
========================================================== */

function renderAdminDashboard(data) {

    const container =
        document.getElementById('admin-dashboard');

    if (!container) return;

    const stats = data.statistics || {};

    container.innerHTML = `

        <div class="admin-card">

            <h2>Channel Analytics</h2>

            <p>Subscribers: ${stats.subscriberCount || 0}</p>

            <p>Videos: ${stats.videoCount || 0}</p>

            <p>Views: ${stats.viewCount || 0}</p>

        </div>

    `;

}

/* ==========================================================
   AUTO INIT
========================================================== */

document.addEventListener('DOMContentLoaded', initAdminPanel);
