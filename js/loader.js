/* ==========================================================
   18 BANI HASHIM
   LOADER ENGINE
   Version : 1.0.0
========================================================== */

'use strict';

class LoaderEngine {

    constructor() {

        /* ==========================================
           DOM
        ========================================== */

        this.loader = document.getElementById('appLoader');

        this.progressBar = document.getElementById('loaderProgressBar');

        this.progressText = document.getElementById('loaderPercent');

        this.statusText = document.getElementById('loaderStatus');

        this.logo = document.getElementById('loaderLogo');

        this.app = document.getElementById('app');

        /* ==========================================
           STATE
        ========================================== */

        this.progress = 0;

        this.targetProgress = 0;

        this.isFinished = false;

        this.isStarted = false;

        this.assetsLoaded = false;

        this.animationFrame = null;

        /* ==========================================
           STATUS
        ========================================== */

        this.statusMessages = [

            "Initializing...",

            "Loading Interface...",

            "Loading Assets...",

            "Preparing Videos...",

            "Preparing Live Streams...",

            "Loading Shorts...",

            "Applying Theme...",

            "Loading Islamic Calendar...",

            "Loading Official Accounts...",

            "Optimizing Experience...",

            "Almost Ready..."

        ];

    }

    /* ==================================================
       START
    ================================================== */

    start() {

        if (this.isStarted) return;

        this.isStarted = true;

        this.show();

        this.fakeProgress();

        this.waitForAssets();

    }

    /* ==================================================
       SHOW
    ================================================== */

    show() {

        if (!this.loader) return;

        this.loader.classList.remove('hidden');

        document.body.classList.add('loading');

    }

    /* ==================================================
       UPDATE UI
    ================================================== */

    updateUI() {

        if (this.progressBar) {

            this.progressBar.style.width = this.progress + "%";

        }

        if (this.progressText) {

            this.progressText.textContent = Math.floor(this.progress) + "%";

        }

        if (this.statusText) {

            const index = Math.min(

                this.statusMessages.length - 1,

                Math.floor(this.progress / 10)

            );

            this.statusText.textContent = this.statusMessages[index];

        }

    }

}

/* ==========================================================
   FAKE PROGRESS ENGINE
========================================================== */

fakeProgress() {

    const animate = () => {

        if (this.isFinished) return;

        if (this.progress < this.targetProgress) {

            this.progress += 0.8;

            if (this.progress > this.targetProgress) {

                this.progress = this.targetProgress;

            }

            this.updateUI();

        }

        this.animationFrame = requestAnimationFrame(animate);

    };

    animate();

    this.progressSteps();

}

/* ==========================================================
   PROGRESS STEPS
========================================================== */

progressSteps() {

    const steps = [

        { value: 8, delay: 150 },

        { value: 15, delay: 300 },

        { value: 24, delay: 500 },

        { value: 35, delay: 700 },

        { value: 48, delay: 950 },

        { value: 60, delay: 1300 },

        { value: 72, delay: 1700 },

        { value: 82, delay: 2100 },

        { value: 90, delay: 2600 }

    ];

    steps.forEach(step => {

        setTimeout(() => {

            if (!this.assetsLoaded) {

                this.targetProgress = Math.max(

                    this.targetProgress,

                    step.value

                );

            }

        }, step.delay);

    });

}

/* ==========================================================
   WAIT FOR ASSETS
========================================================== */

waitForAssets() {

    window.addEventListener(

        "load",

        () => {

            this.assetsLoaded = true;

            this.finish();

        },

        {

            once: true

        }

    );

}

/* ==========================================================
   IMAGE PRELOAD
========================================================== */

preloadImages() {

    const images = document.images;

    if (!images.length) {

        return Promise.resolve();

    }

    return Promise.all(

        [...images].map(img => {

            return new Promise(resolve => {

                if (img.complete) {

                    resolve();

                    return;

                }

                img.onload = resolve;

                img.onerror = resolve;

            });

        })

    );

}

/* ==========================================================
   FONT READY
========================================================== */

waitForFonts() {

    if (!document.fonts) {

        return Promise.resolve();

    }

    return document.fonts.ready;

}

/* ==========================================================
   SAFE START
========================================================== */

initializeAssets() {

    Promise.all([

        this.preloadImages(),

        this.waitForFonts()

    ]).then(() => {

        this.assetsLoaded = true;

    });

}

/* ==========================================================
   FINISH LOADER
========================================================== */

finish() {

    if (this.isFinished) return;

    this.isFinished = true;

    this.targetProgress = 100;

    const complete = () => {

        if (this.progress < 100) {

            this.progress += 1;

            if (this.progress > 100) {

                this.progress = 100;

            }

            this.updateUI();

            requestAnimationFrame(complete);

            return;

        }

        this.hide();

    };

    complete();

}

/* ==========================================================
   HIDE LOADER
========================================================== */

hide() {

    if (this.loader) {

        this.loader.classList.add("loader-fade-out");

    }

    document.body.classList.remove("loading");

    if (this.app) {

        this.app.classList.add("app-loaded");

    }

    setTimeout(() => {

        if (this.loader) {

            this.loader.remove();

        }

    }, 800);

}

/* ==========================================================
   FAIL SAFE
========================================================== */

failSafe() {

    setTimeout(() => {

        if (!this.isFinished) {

            console.warn("Loader FailSafe Activated");

            this.assetsLoaded = true;

            this.finish();

        }

    }, 10000);

}

/* ==========================================================
   PUBLIC API
========================================================== */

setProgress(value) {

    value = Math.max(0, Math.min(100, value));

    this.targetProgress = value;

}

setStatus(text) {

    if (this.statusText) {

        this.statusText.textContent = text;

    }

}

/* ==========================================================
   DESTROY
========================================================== */

destroy() {

    if (this.animationFrame) {

        cancelAnimationFrame(this.animationFrame);

    }

}

/* ==========================================================
   AUTO START
========================================================== */

const AppLoader = new LoaderEngine();

document.addEventListener(

    "DOMContentLoaded",

    () => {

        if (

            typeof CONFIG !== "undefined" &&

            CONFIG.FEATURES.LOADER

        ) {

            AppLoader.initializeAssets();

            AppLoader.start();

            AppLoader.failSafe();

        }

    }

);

/* ==========================================================
   GLOBAL
========================================================== */

window.AppLoader = AppLoader;
