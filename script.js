/* =========================================================
   FRAGRANT MC
   Main JavaScript
========================================================= */


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const mobileMenuButton = document.getElementById("mobileMenuButton");
const navLinks = document.getElementById("navLinks");

if (mobileMenuButton && navLinks) {

    mobileMenuButton.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            isOpen
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    /*
        Close the mobile menu after clicking
        a navigation link.
    */

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
            copyIpButton.dataset.copyIp;

        try {

            await navigator.clipboard.writeText(ip);

            if (copyMessage) {

                copyMessage.textContent =
                    "IP COPIED";

            }

            copyIpButton.textContent =
                "COPIED";

            setTimeout(() => {

                copyIpButton.textContent =
                    "COPY IP";

                if (copyMessage) {
                    copyMessage.textContent = "";
                }

            }, 2000);

        } catch (error) {

            /*
                Fallback message if the browser
                blocks clipboard access.
            */

            if (copyMessage) {

                copyMessage.textContent =
                    "Copy failed — fragrantmc.xyz";

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
   SERVER DATA
=========================================================

   These values are currently placeholders.

   Later, this section can be connected to:
   - Your Minecraft server API
   - mcstatus API
   - Your own backend
   - A Discord/server status API

========================================================= */

const serverData = {

    online: true,

    players: {
        online: 0,
        max: 100
    },

    javaIp: "fragrantmc.xyz",

    bedrockIp: "fragrantmc.xyz",

    bedrockPort: "19132"

};


/* =========================================================
   UPDATE SERVER INFORMATION
========================================================= */

function updateServerInformation() {

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


    /*
        Server status
    */

    if (serverStatus) {

        serverStatus.textContent =
            serverData.online
                ? "Online"
                : "Offline";

    }


    /*
        Player count
    */

    if (playerCount) {

        playerCount.textContent =
            `${serverData.players.online} / ${serverData.players.max}`;

    }


    /*
        Java IP
    */

    if (javaIp) {

        javaIp.textContent =
            serverData.javaIp;

    }


    /*
        Bedrock IP
    */

    if (bedrockIp) {

        bedrockIp.textContent =
            serverData.bedrockIp;

    }


    /*
        Bedrock port
    */

    if (bedrockPort) {

        bedrockPort.textContent =
            serverData.bedrockPort;

    }


    /*
        Status indicator
    */

    if (statusDot) {

        statusDot.classList.toggle(
            "offline",
            !serverData.online
        );

    }

}


/* =========================================================
   INITIALIZE SERVER INFORMATION
========================================================= */

updateServerInformation();