/* ==========================================================
   18 BANI HASHIM
   MAIN CONTROLLER
   Version : 2.0.0
========================================================== */

'use strict';

/* ==========================================================
   MAIN APPLICATION
========================================================== */

class App {

    constructor() {

        this.loader = document.getElementById("appLoader");

        this.header = document.querySelector(".main-header");

        this.backTop = document.getElementById("backToTop");

        this.mobileMenu = document.getElementById("mobileMenu");

        this.menuButton = document.getElementById("menuButton");

        this.searchButton = document.getElementById("searchButton");

        this.searchOverlay = document.getElementById("searchOverlay");

        this.searchInput = document.getElementById("searchInput");

        this.moreBio = document.getElementById("moreBio");

        this.bioText = document.getElementById("channelBio");

        this.scrollProgress = document.getElementById("scrollProgress");

        this.lastScroll = 0;

        this.menuOpen = false;

        this.initialized = false;

    }

    /* ======================================================
       START
    ====================================================== */

    async init() {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.registerEvents();

        this.initScrollReveal();

        this.initRipple();

        this.updateYear();

        console.log(

            "✅ Main Controller Started"

        );

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    registerEvents() {

        window.addEventListener(

            "scroll",

            () => this.onScroll(),

            {

                passive: true

            }

        );

        window.addEventListener(

            "resize",

            () => this.onResize()

        );

        document.addEventListener(

            "keydown",

            (event) => this.onKey(event)

        );

        if (this.menuButton) {

            this.menuButton.addEventListener(

                "click",

                () => this.toggleMenu()

            );

        }

        if (this.backTop) {

            this.backTop.addEventListener(

                "click",

                () => this.scrollTop()

            );

        }

        if (this.searchButton) {

            this.searchButton.addEventListener(

                "click",

                () => this.openSearch()

            );

        }

    }

    /* ======================================================
       SCROLL
    ====================================================== */

    onScroll() {

        this.headerEffect();

        this.scrollIndicator();

        this.showBackTop();

        this.revealItems();

    }

    /* ======================================================
       RESIZE
    ====================================================== */

    onResize() {

        if (

            window.innerWidth > 992 &&

            this.menuOpen

        ) {

            this.closeMenu();

        }

    }

    /* ======================================================
       KEYBOARD
    ====================================================== */

    onKey(event) {

        if (

            event.key === "Escape"

        ) {

            this.closeSearch();

            this.closeMenu();

        }

    }

}


/* ==========================================================
   MAIN CONTROLLER
   Part 2
========================================================== */

/* ======================================================
   HEADER EFFECT
====================================================== */

App.prototype.headerEffect = function () {

    if (!this.header) return;

    const scroll = window.scrollY;

    if (scroll > 60) {

        this.header.classList.add("header-scrolled");

    } else {

        this.header.classList.remove("header-scrolled");

    }

    if (

        CONFIG.UI.HEADER_HIDE_ON_SCROLL &&

        scroll > this.lastScroll &&

        scroll > 120

    ) {

        this.header.classList.add("header-hide");

    } else {

        this.header.classList.remove("header-hide");

    }

    this.lastScroll = scroll;

};


/* ======================================================
   SCROLL PROGRESS
====================================================== */

App.prototype.scrollIndicator = function () {

    if (!this.scrollProgress) return;

    const total =

        document.documentElement.scrollHeight -

        window.innerHeight;

    const percent =

        (window.scrollY / total) * 100;

    this.scrollProgress.style.width =

        percent + "%";

};


/* ======================================================
   BACK TO TOP
====================================================== */

App.prototype.showBackTop = function () {

    if (!this.backTop) return;

    if (window.scrollY > 500) {

        this.backTop.classList.add("show");

    } else {

        this.backTop.classList.remove("show");

    }

};


/* ======================================================
   SCROLL TO TOP
====================================================== */

App.prototype.scrollTop = function () {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};


/* ======================================================
   MOBILE MENU
====================================================== */

App.prototype.toggleMenu = function () {

    if (this.menuOpen) {

        this.closeMenu();

    } else {

        this.openMenu();

    }

};

App.prototype.openMenu = function () {

    if (!this.mobileMenu) return;

    this.mobileMenu.classList.add("active");

    document.body.classList.add("menu-open");

    this.menuOpen = true;

};

App.prototype.closeMenu = function () {

    if (!this.mobileMenu) return;

    this.mobileMenu.classList.remove("active");

    document.body.classList.remove("menu-open");

    this.menuOpen = false;

};


/* ======================================================
   ACTIVE NAVIGATION
====================================================== */

App.prototype.activeNavigation = function () {

    const sections =

        document.querySelectorAll("section[id]");

    const links =

        document.querySelectorAll(".nav-item");

    let current = "";

    sections.forEach(section => {

        const top =

            section.offsetTop - 140;

        if (window.scrollY >= top) {

            current = section.id;

        }

    });

    links.forEach(link => {

        link.classList.remove("active");

        const href =

            link.getAttribute("href");

        if (

            href === "#" + current

        ) {

            link.classList.add("active");

        }

    });

};


/* ======================================================
   UPDATE SCROLL EVENTS
====================================================== */

App.prototype.onScroll = function () {

    this.headerEffect();

    this.scrollIndicator();

    this.showBackTop();

    this.revealItems();

    this.activeNavigation();

};


/* ======================================================
   END PART 2
====================================================== */

/* ==========================================================
   MAIN CONTROLLER
   Part 3
========================================================== */

/* ======================================================
   SEARCH
====================================================== */

App.prototype.openSearch = function () {

    if (!this.searchOverlay) return;

    this.searchOverlay.classList.add("active");

    document.body.classList.add("search-open");

    if (this.searchInput) {

        setTimeout(() => {

            this.searchInput.focus();

        }, 200);

    }

};

App.prototype.closeSearch = function () {

    if (!this.searchOverlay) return;

    this.searchOverlay.classList.remove("active");

    document.body.classList.remove("search-open");

};


/* ======================================================
   SEARCH EVENTS
====================================================== */

App.prototype.initSearch = function () {

    if (!this.searchOverlay) return;

    this.searchOverlay.addEventListener(

        "click",

        (event) => {

            if (

                event.target === this.searchOverlay

            ) {

                this.closeSearch();

            }

        }

    );

    if (this.searchInput) {

        this.searchInput.addEventListener(

            "input",

            (event) => {

                this.search(

                    event.target.value

                );

            }

        );

    }

};


/* ======================================================
   SEARCH
====================================================== */

App.prototype.search = function (keyword) {

    keyword = keyword.trim().toLowerCase();

    if (keyword.length < 2) {

        return;

    }

    if (

        window.YouTube &&

        Array.isArray(

            YouTube.latestVideos

        )

    ) {

        const result =

            YouTube.latestVideos.filter(

                video =>

                    video.title

                        .toLowerCase()

                        .includes(keyword)

            );

        console.log(

            "Search:",

            result

        );

    }

};


/* ======================================================
   BIO MORE
====================================================== */

App.prototype.initBio = function () {

    if (

        !this.moreBio ||

        !this.bioText

    ) {

        return;

    }

    this.moreBio.addEventListener(

        "click",

        () => {

            this.bioText.classList.toggle(

                "expanded"

            );

            this.moreBio.textContent =

                this.bioText.classList.contains(

                    "expanded"

                )

                ? "Less"

                : "More";

        }

    );

};


/* ======================================================
   RIPPLE
====================================================== */

App.prototype.initRipple = function () {

    document.addEventListener(

        "click",

        event => {

            const target =

                event.target.closest(

                    ".ripple"

                );

            if (!target) return;

            const circle =

                document.createElement(

                    "span"

                );

            const size =

                Math.max(

                    target.clientWidth,

                    target.clientHeight

                );

            const rect =

                target.getBoundingClientRect();

            circle.style.width =

                size + "px";

            circle.style.height =

                size + "px";

            circle.style.left =

                event.clientX -

                rect.left -

                size / 2 +

                "px";

            circle.style.top =

                event.clientY -

                rect.top -

                size / 2 +

                "px";

            circle.className =

                "ripple-circle";

            const old =

                target.querySelector(

                    ".ripple-circle"

                );

            if (old) {

                old.remove();

            }

            target.appendChild(

                circle

            );

        }

    );

};


/* ======================================================
   COPY
====================================================== */

App.prototype.copy = async function (text) {

    try {

        await navigator.clipboard.writeText(

            text

        );

        this.notify(

            "Copied Successfully"

        );

    }

    catch (error) {

        console.error(error);

    }

};


/* ======================================================
   NOTIFICATION
====================================================== */

App.prototype.notify = function (

    message,

    type = "success"

) {

    console.log(

        "[" + type + "]",

        message

    );

};


/* ======================================================
   UPDATE INIT
====================================================== */

const __oldInit = App.prototype.init;

App.prototype.init = async function () {

    await __oldInit.call(this);

    this.initSearch();

    this.initBio();

};


/* ======================================================
   END PART 3
====================================================== */

/* ==========================================================
   MAIN CONTROLLER
   Part 4
========================================================== */

/* ======================================================
   SEARCH RESULT CONTAINER
====================================================== */

App.prototype.getSearchContainer = function () {

    let container = document.getElementById(

        "searchResults"

    );

    if (!container) {

        container = document.createElement("div");

        container.id = "searchResults";

        container.className = "search-results";

        this.searchInput.parentNode.appendChild(

            container

        );

    }

    return container;

};


/* ======================================================
   LIVE SEARCH
====================================================== */

App.prototype.search = function (keyword) {

    keyword = keyword.trim().toLowerCase();

    const container =

        this.getSearchContainer();

    if (keyword.length < 2) {

        container.innerHTML = "";

        container.style.display = "none";

        return;

    }

    const videos =

        window.YouTube

            ? YouTube.latestVideos

            : [];

    const results = videos.filter(video =>

        video.title

            .toLowerCase()

            .includes(keyword)

    );

    this.renderSearchResults(

        results

    );

};


/* ======================================================
   SEARCH RESULTS
====================================================== */

App.prototype.renderSearchResults = function (

    results

) {

    const container =

        this.getSearchContainer();

    if (!results.length) {

        container.innerHTML = `

<div class="search-empty">

No Results Found

</div>

`;

        container.style.display = "block";

        return;

    }

    container.innerHTML =

        results

        .slice(0,10)

        .map(video => `

<a
class="search-item"
target="_blank"
href="${video.url}">

<img
src="${video.thumbnail}"
loading="lazy">

<div>

<h4>

${video.title}

</h4>

<p>

👁 ${video.views}
&nbsp;&nbsp;•&nbsp;&nbsp;
📅 ${video.date}

</p>

</div>

</a>

`)

.join("");

    container.style.display = "block";

};


/* ======================================================
   CLOSE SEARCH RESULT
====================================================== */

App.prototype.hideSearchResults = function () {

    const container =

        document.getElementById(

            "searchResults"

        );

    if (container) {

        container.style.display = "none";

    }

};


/* ======================================================
   SCROLL REVEAL
====================================================== */

App.prototype.initScrollReveal = function () {

    this.revealItems();

};

App.prototype.revealItems = function () {

    const elements =

        document.querySelectorAll(

            ".reveal"

        );

    const trigger =

        window.innerHeight * 0.88;

    elements.forEach(item => {

        const top =

            item.getBoundingClientRect().top;

        if (top < trigger) {

            item.classList.add(

                "active"

            );

        }

    });

};


/* ======================================================
   UPDATE SEARCH EVENTS
====================================================== */

const __searchInit =

App.prototype.initSearch;

App.prototype.initSearch = function () {

    __searchInit.call(this);

    document.addEventListener(

        "click",

        event => {

            if (

                !event.target.closest(

                    "#searchResults"

                ) &&

                !event.target.closest(

                    "#searchInput"

                )

            ) {

                this.hideSearchResults();

            }

        }

    );

};


/* ======================================================
   FOOTER YEAR
====================================================== */

App.prototype.updateYear = function () {

    const year =

        document.getElementById(

            "currentYear"

        );

    if (year) {

        year.textContent =

            new Date().getFullYear();

    }

};


/* ======================================================
   LOADER COMPLETE
====================================================== */

App.prototype.finishLoading = function () {

    if (!this.loader) return;

    this.loader.classList.add(

        "loaded"

    );

    setTimeout(() => {

        this.loader.remove();

    },600);

};


/* ======================================================
   END PART 4
====================================================== */

/* ==========================================================
   MAIN CONTROLLER
   Part 5 (FINAL)
========================================================== */

/* ======================================================
   TOAST NOTIFICATION
====================================================== */

App.prototype.notify = function (

    message,

    type = "success"

) {

    let toast = document.createElement("div");

    toast.className =

        "toast toast-" + type;

    toast.innerHTML = `

<span>${message}</span>

`;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        },300);

    },3000);

};


/* ======================================================
   NETWORK STATUS
====================================================== */

App.prototype.networkMonitor = function () {

    window.addEventListener(

        "offline",

        () => {

            this.notify(

                "No Internet Connection",

                "error"

            );

        }

    );

    window.addEventListener(

        "online",

        () => {

            this.notify(

                "Back Online",

                "success"

            );

        }

    );

};


/* ======================================================
   IMAGE LAZY LOADING
====================================================== */

App.prototype.lazyImages = function () {

    const images =

        document.querySelectorAll(

            "img[loading='lazy']"

        );

    if (

        !("IntersectionObserver" in window)

    ) {

        return;

    }

    const observer =

        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (

                        entry.isIntersecting

                    ) {

                        const image =

                            entry.target;

                        image.classList.add(

                            "loaded"

                        );

                        observer.unobserve(

                            image

                        );

                    }

                });

            },

            {

                rootMargin:

                    "100px"

            }

        );

    images.forEach(image => {

        observer.observe(image);

    });

};


/* ======================================================
   GLOBAL ERROR HANDLER
====================================================== */

App.prototype.errorHandler = function () {

    window.addEventListener(

        "error",

        event => {

            console.error(

                event.error

            );

        }

    );

    window.addEventListener(

        "unhandledrejection",

        event => {

            console.error(

                event.reason

            );

        }

    );

};


/* ======================================================
   PERFORMANCE
====================================================== */

App.prototype.performance = function () {

    if (

        !window.performance

    ) {

        return;

    }

    window.addEventListener(

        "load",

        () => {

            const time =

                performance.now();

            console.log(

                "Loaded:",

                time.toFixed(0),

                "ms"

            );

        }

    );

};


/* ======================================================
   START
====================================================== */

const __baseInit =

App.prototype.init;

App.prototype.init = async function () {

    await __baseInit.call(this);

    this.networkMonitor();

    this.lazyImages();

    this.performance();

    this.errorHandler();

};


/* ======================================================
   APPLICATION
====================================================== */

const APP = new App();

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        try {

            await APP.init();

            APP.finishLoading();

            console.log(

                "🚀 18 BANI HASHIM READY"

            );

        }

        catch(error){

            console.error(error);

        }

    }

);


/* ======================================================
   GLOBAL
====================================================== */

window.APP = APP;


/* ======================================================
   END OF FILE
====================================================== */

