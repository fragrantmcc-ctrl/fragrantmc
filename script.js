/* =========================================================
   FRAGRANT MC
   Main JavaScript
========================================================= */


/* =========================================================
   SERVER CONFIGURATION
========================================================= */

const SERVER_CONFIG = {

    // Minecraft Java server address
    javaIp: "fragrantmc.xyz",

    // Minecraft Bedrock server address
    bedrockIp: "fragrantmc.xyz",

    // Bedrock port
    bedrockPort: "19132",

    // How often the website checks the server
    // 60,000 milliseconds = 60 seconds
    refreshInterval: 60000

};


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const navLinks =
    document.getElementById("navLinks");


if (mobileMenuButton && navLinks) {

    mobileMenuButton.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    const navigationLinks =
        navLinks.querySelectorAll("a");


    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}


/* =========================================================
   COPY SERVER IP
========================================================= */

const copyIpButton =
    document.getElementById("copyIpButton");

const copyMessage =
    document.getElementById("copyMessage");


if (copyIpButton) {

    copyIpButton.addEventListener("click", async () => {

        const ip =
            copyIpButton.dataset.copyIp ||
            SERVER_CONFIG.javaIp;


        try {

            await navigator.clipboard.writeText(ip);


            if (copyMessage) {
                copyMessage.textContent = "IP COPIED!";
            }


            copyIpButton.textContent = "COPIED!";


            setTimeout(() => {

                copyIpButton.textContent =
                    "COPY SERVER IP";

                if (copyMessage) {
                    copyMessage.textContent = "";
                }

            }, 2000);


        } catch (error) {

            console.error(
                "Unable to copy server IP:",
                error
            );


            if (copyMessage) {

                copyMessage.textContent =
                    `Copy failed — ${ip}`;

            }

        }

    });

}


/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear =
    document.getElementById("currentYear");


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   SERVER INFORMATION ELEMENTS
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

const statusDot =
    document.getElementById("serverStatusDot");


/* =========================================================
   HERO SERVER STATUS ELEMENTS
========================================================= */

const heroServerStatus =
    document.getElementById("heroServerStatus");

const heroStatusText =
    document.getElementById("heroStatusText");

const heroStatusDot =
    document.getElementById("heroStatusDot");


/* =========================================================
   UPDATE SERVER STATUS UI
========================================================= */

function setServerStatus(status, online) {

    /*
        status:
        "Online"
        "Offline"
        "Checking..."
        "Unavailable"
    */


    if (serverStatus) {
        serverStatus.textContent = status;
    }


    if (heroStatusText) {
        heroStatusText.textContent =
            status === "Checking..."
                ? "Checking Server..."
                : `Server ${status}`;
    }


    /*
        MAIN SERVER DOT
    */

    if (statusDot) {

        statusDot.classList.toggle(
            "offline",
            !online
        );

    }


    /*
        HERO SERVER DOT
    */

    if (heroStatusDot) {

        heroStatusDot.classList.toggle(
            "offline",
            !online
        );

    }


    /*
        HERO SERVER BADGE
    */

    if (heroServerStatus) {

        heroServerStatus.classList.toggle(
            "offline",
            !online
        );

    }

}


/* =========================================================
   UPDATE SERVER TEXT INFORMATION
========================================================= */

function updateServerDetails() {

    if (javaIp) {

        javaIp.textContent =
            SERVER_CONFIG.javaIp;

    }


    if (bedrockIp) {

        bedrockIp.textContent =
            SERVER_CONFIG.bedrockIp;

    }


    if (bedrockPort) {

        bedrockPort.textContent =
            SERVER_CONFIG.bedrockPort;

    }

}


/* =========================================================
   GET MINECRAFT SERVER STATUS
========================================================= */

async function updateServerInformation() {

    /*
        Show checking status while the request is running.
    */

    setServerStatus(
        "Checking...",
        false
    );


    if (playerCount) {

        playerCount.textContent =
            "Checking...";

    }


    /*
        Keep IP information visible.
    */

    updateServerDetails();


    /*
        mcsrvstat.us API

        Java:
        https://api.mcsrvstat.us/3/fragrantmc.xyz

        The API returns:

        online
        players.online
        players.max
    */

    const apiUrl =
        `https://api.mcsrvstat.us/3/${encodeURIComponent(
            SERVER_CONFIG.javaIp
        )}`;


    try {

        const response =
            await fetch(apiUrl, {
                method: "GET",
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                `API returned HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "FRAGRANT MC server status:",
            data
        );


        /*
            SERVER OFFLINE
        */

        if (!data.online) {

            setServerStatus(
                "Offline",
                false
            );


            if (playerCount) {

                playerCount.textContent =
                    "0 / 0";

            }


            return;

        }


        /*
            SERVER ONLINE
        */

        setServerStatus(
            "Online",
            true
        );


        /*
            PLAYER COUNT
        */

        const onlinePlayers =
            Number(
                data.players?.online ?? 0
            );


        const maxPlayers =
            Number(
                data.players?.max ?? 0
            );


        if (playerCount) {

            playerCount.textContent =
                `${onlinePlayers} / ${maxPlayers}`;

        }


    } catch (error) {

        console.error(
            "Unable to retrieve FRAGRANT MC server status:",
            error
        );


        /*
            If the API itself cannot be reached,
            don't falsely say the Minecraft server
            is offline.

            Use "Unavailable" instead.
        */

        setServerStatus(
            "Unavailable",
            false
        );


        if (playerCount) {

            playerCount.textContent =
                "— / —";

        }

    }

}


/* =========================================================
   INITIAL SERVER STATUS CHECK
========================================================= */

updateServerInformation();


/* =========================================================
   AUTOMATIC SERVER STATUS REFRESH
========================================================= */

setInterval(
    updateServerInformation,
    SERVER_CONFIG.refreshInterval
);
