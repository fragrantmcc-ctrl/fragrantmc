/* =========================================================
   FRAGRANT MC SERVER STATUS
   Uses the same mcstatus.io method as the Discord bot
========================================================= */

const SERVER_CONFIG = {
    serverAddress: "play.fragrantmc.fun",
    javaPort: 25751,
    bedrockPort: 25751,

    refreshInterval: 10000
};


/* =========================================================
   SERVER STATUS ELEMENTS
========================================================= */

const serverStatus =
    document.getElementById("serverStatus");

const playerCount =
    document.getElementById("playerCount");

const javaIp =
    document.getElementById("javaIp");

const bedrockIp =
    document.getElementById("bedrockIp");

const bedrockPort =
    document.getElementById("bedrockPort");

const serverStatusDot =
    document.getElementById("serverStatusDot");

const heroServerStatus =
    document.getElementById("heroServerStatus");

const heroStatusText =
    document.getElementById("heroStatusText");

const heroStatusDot =
    document.getElementById("heroStatusDot");


/* =========================================================
   UPDATE SERVER DETAILS
========================================================= */

function updateServerDetails() {

    if (javaIp) {
        javaIp.textContent =
            SERVER_CONFIG.serverAddress;
    }

    if (bedrockIp) {
        bedrockIp.textContent =
            SERVER_CONFIG.serverAddress;
    }

    if (bedrockPort) {
        bedrockPort.textContent =
            SERVER_CONFIG.bedrockPort;
    }

}


/* =========================================================
   UPDATE STATUS UI
========================================================= */

function setServerStatus(status, online) {

    if (serverStatus) {
        serverStatus.textContent = status;
    }

    if (heroStatusText) {

        heroStatusText.textContent =
            status === "Checking..."
                ? "Checking Server..."
                : `Server ${status}`;

    }

    if (serverStatusDot) {

        serverStatusDot.classList.toggle(
            "offline",
            !online
        );

    }

    if (heroStatusDot) {

        heroStatusDot.classList.toggle(
            "offline",
            !online
        );

    }

    if (heroServerStatus) {

        heroServerStatus.classList.toggle(
            "offline",
            !online
        );

    }

}


/* =========================================================
   CHECK SERVER STATUS
========================================================= */

async function updateServerInformation() {

    updateServerDetails();

    setServerStatus(
        "Checking...",
        false
    );

    if (playerCount) {
        playerCount.textContent =
            "Checking...";
    }

    try {

        const url =
            `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(
                SERVER_CONFIG.serverAddress
            )}:${SERVER_CONFIG.javaPort}`;

        console.log(
            "Checking:",
            url
        );

        const response =
            await fetch(url, {
                cache: "no-store"
            });

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const server =
            await response.json();

        console.log(
            "Minecraft server response:",
            server
        );

        const isOnline =
            server.online === true;


        /* =================================================
           ONLINE
        ================================================= */

        if (isOnline) {

            setServerStatus(
                "Online",
                true
            );

            const onlinePlayers =
                server.players?.online ?? 0;

            const maxPlayers =
                server.players?.max ?? 0;

            if (playerCount) {

                playerCount.textContent =
                    `${onlinePlayers} / ${maxPlayers}`;

            }

            console.log(
                `FRAGRANT MC ONLINE — ${onlinePlayers}/${maxPlayers}`
            );

            return;
        }


        /* =================================================
           OFFLINE
        ================================================= */

        setServerStatus(
            "Offline",
            false
        );

        if (playerCount) {
            playerCount.textContent =
                "0 / 0";
        }

        console.log(
            "FRAGRANT MC OFFLINE"
        );

    } catch (error) {

        console.error(
            "Server status check failed:",
            error
        );

        setServerStatus(
            "Offline",
            false
        );

        if (playerCount) {
            playerCount.textContent =
                "0 / 0";
        }

    }

}


/* =========================================================
   INITIAL SERVER CHECK
========================================================= */

updateServerInformation();


/* =========================================================
   AUTO REFRESH
========================================================= */

setInterval(
    updateServerInformation,
    SERVER_CONFIG.refreshInterval
);


/* =========================================================
   MOBILE HAMBURGER MENU
========================================================= */

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const navLinks =
    document.getElementById("navLinks");


if (mobileMenuButton && navLinks) {

    mobileMenuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                navLinks.classList.toggle("active");


            mobileMenuButton.textContent =
                isOpen ? "✕" : "☰";


            mobileMenuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );


            mobileMenuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        }
    );


    /* =====================================================
       CLOSE MENU AFTER CLICKING A LINK
    ===================================================== */

    navLinks
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.classList.remove("active");

                    mobileMenuButton.textContent =
                        "☰";

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-label",
                        "Open navigation menu"
                    );

                }
            );

        });

}

/* =========================================================
   SCROLL REVEAL EFFECTS
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal, .reveal-card"
    );


const revealObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(function (element) {

    revealObserver.observe(element);

});
