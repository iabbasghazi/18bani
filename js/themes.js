'use strict';

/* ==========================================================
   18 BANI HASHIM
   THEMES ENGINE
   Version : V1.0.0
   ========================================================== */

const ThemeEngine = {

    themes: [

        'theme-midnight',
        'theme-carbon',
        'theme-graphite',
        'theme-obsidian',
        'theme-blueblack',
        'theme-purpleblack',
        'theme-redblack',
        'theme-emeraldblack',
        'theme-neon',
        'theme-cyber',
        'theme-ocean',
        'theme-galaxy',
        'theme-aurora',
        'theme-inferno',
        'theme-forest',
        'theme-crimson',
        'theme-slate',
        'theme-space',
        'theme-steel',
        'theme-classicdark'

    ],

    currentIndex: 0,

    body: document.body

};

/* ==========================================================
   INIT THEME
========================================================== */

function initTheme() {

    const saved =
        localStorage.getItem('active_theme');

    if (saved && ThemeEngine.themes.includes(saved)) {

        applyTheme(saved);

        ThemeEngine.currentIndex =
            ThemeEngine.themes.indexOf(saved);

    } else {

        applyTheme(ThemeEngine.themes[0]);

    }

}

/* ==========================================================
   APPLY THEME
========================================================== */

function applyTheme(theme) {

    ThemeEngine.body.className =
        ThemeEngine.body.className
            .split(' ')
            .filter(c => !c.startsWith('theme-'))
            .join(' ');

    ThemeEngine.body.classList.add(theme);

    localStorage.setItem('active_theme', theme);

    updateThemeUI(theme);

}

/* ==========================================================
   NEXT THEME
========================================================== */

function changeTheme() {

    ThemeEngine.currentIndex++;

    if (ThemeEngine.currentIndex >= ThemeEngine.themes.length) {

        ThemeEngine.currentIndex = 0;

    }

    const theme =
        ThemeEngine.themes[ThemeEngine.currentIndex];

    applyTheme(theme);

}

/* ==========================================================
   UPDATE UI
========================================================== */

function updateThemeUI(theme) {

    const button =
        document.getElementById('themeSwitcherButton');

    if (!button) return;

    button.setAttribute('data-theme', theme);

}

/* ==========================================================
   AUTO INIT
========================================================== */

initTheme();
