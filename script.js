```javascript
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

    // Website status refresh interval
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
   UPDATE SERVER TEXT INFORMATION
========================================================= */

function updateServerDetails() {

    /* JAVA IP */

    if (javaIp) {

        javaIp.textContent =
            SERVER_CONFIG.javaIp;

    }


    /* BEDROCK IP */

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
        Show checking state
        while the API request is running.
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
        Always keep the server
        connection information updated.
    */

    updateServerDetails();


    /*
        mcsrvstat.us Minecraft API

        The API checks:

        play.fragrantmc.fun

        It can resolve the Minecraft
        SRV record automatically.
    */

    const apiUrl =
        `https://api.mcsrvstat.us/3/${encodeURIComponent(
            SERVER_CONFIG.javaIp
        )}`;


    try {

        const response =
            await fetch(apiUrl, {

                method: "GET",

                cache: "no-store",

                headers: {

                    "Accept":
                        "application/json"

                }

            });


        /*
            Check HTTP response.
        */

        if (!response.ok) {

            throw new Error(
                `API returned HTTP ${response.status}`
            );

        }


        /*
            Convert response to JSON.
        */

        const data =
            await response.json();


        /*
            Useful debugging information.

            Open browser:

            F12
            → Console
        */

        console.log(
            "FRAGRANT MC server status:",
            data
        );


        /* =================================================
           SERVER OFFLINE
        ================================================= */

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


        /* =================================================
           SERVER ONLINE
        ================================================= */

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

    } catch (error) {

        /*
            Log the actual error
            for debugging.
        */

        console.error(
            "Unable to retrieve FRAGRANT MC server status:",
            error
        );


        /*
            API could not be reached.

            This is different from
            the Minecraft server being offline.
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
   INITIAL SERVER STATU
```
