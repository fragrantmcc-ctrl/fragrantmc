/* =========================================================
   FRAGRANT MC
   Main JavaScript
========================================================= */


/* =========================================================
   SERVER CONFIGURATION
========================================================= */

const SERVER_CONFIG = {

    // Minecraft Java server address
    javaIp: "play.fragrantmc.fun",

    // Minecraft Bedrock server address
    bedrockIp: "play.fragrantmc.fun",

    // Minecraft Bedrock port
    bedrockPort: "25751",

    // Status refresh interval
    // 60 seconds
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

                copyMessage.textContent =
                    "IP COPIED!";

            }


            copyIpButton.textContent =
                "COPIED!";


            setTimeout(() => {

                copyIpButton.textContent =
                    "COPY SERVER IP";


                if (copyMessage) {

                    copyMessage.textContent =
                        "";

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
        Possible statuses:

        Online
        Offline
        Checking...
        Unavailable
    */


    /* MAIN STATUS */

    if (serverStatus) {

        serverStatus.textContent =
            status;

    }


    /* HERO STATUS TEXT */

    if (heroStatusText) {

        heroStatusText.textContent =
            status === "Checking..."
                ? "Checking Server..."
                : `Server ${status}`;

    }


    /* MAIN STATUS DOT */

    if (statusDot) {

        statusDot.classList.toggle(
            "offline",
            !online
        );

    }


    /* HERO STATUS DOT */

    if (heroStatusDot) {

        heroStatusDot.classList.toggle(
            "offline",
            !online
        );

    }


    /* HERO STATUS BADGE */

    if (heroServerStatus) {

        heroServerStatus.classList.toggle(
            "offline",
            !online
        );

    }

}


/* =========================================================
   UPDATE SERVER DETAILS
========================================================= */

function updateServerDetails() {

    /* JAVA */

    if (javaIp) {

        javaIp.textContent =
            SERVER_CONFIG.javaIp;

    }


    /* BEDROCK */

    if (bedrockIp) {

        bedrockIp.textContent =
            SERVER_CONFIG.bedrockIp;

    }


    /* BEDROCK PORT */

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
        Show checking while
        the request is running.
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
        Update displayed IP information.
    */

    updateServerDetails();


    /*
        Minecraft server hostname.
    */

    const serverAddress =
        SERVER_CONFIG.javaIp;


    /*
        mcsrvstat.us API.

        The API will attempt to resolve
        the Minecraft SRV record for:

        play.fragrantmc.fun
    */

    const apiUrl =
        `https://api.mcsrvstat.us/3/${encodeURIComponent(
            serverAddress
        )}`;


    console.log(
        "================================="
    );

    console.log(
        "FRAGRANT MC STATUS CHECK"
    );

    console.log(
        "Server:",
        serverAddress
    );

    console.log(
        "API:",
        apiUrl
    );

    console.log(
        "================================="
    );


    try {

        /*
            Request server status.
        */

        const response =
            await fetch(apiUrl, {

                method: "GET",

                cache: "no-store",

                headers: {

                    "Accept":
                        "application/json"

                }

            });


        console.log(
            "API HTTP status:",
            response.status
        );


        /*
            Check HTTP status.
        */

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        /*
            Read JSON response.
        */

        const data =
            await response.json();


        console.log(
            "API RESPONSE:",
            data
        );


        /* =================================================
           SERVER OFFLINE
        ================================================= */

        if (!data.online) {

            console.log(
                "Minecraft server reported OFFLINE."
            );


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


        /* =================================================
           SERVER ONLINE
        ================================================= */

        console.log(
            "Minecraft server reported ONLINE."
        );


        setServerStatus(
            "Online",
            true
        );


        /* =================================================
           PLAYER COUNT
        ================================================= */

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


        console.log(
            `Players: ${onlinePlayers} / ${maxPlayers}`
        );


    } catch (error) {

        /*
            Something prevented
            the API request from completing.
        */

        console.error(
            "================================="
        );

        console.error(
            "FRAGRANT MC STATUS ERROR:"
        );

        console.error(
            error
        );

        console.error(
            "================================="
        );


        /*
            Do not call the server offline
            when the API itself failed.
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

