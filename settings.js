"use strict";

const ANTI_ALIASING_CHECK = document.getElementById("antiAliasingToggle");
const FPS_LIMIT_INPUT = document.getElementById("FPSLimit");
let settingsOpen = false;

/*ANTI_ALIASING_CHECK.addEventListener("change", function() {
    CTX.imageSmoothingEnabled = ANTI_ALIASING_CHECK.checked;
    localStorage.setItem("antiAliasing", CTX.imageSmoothingEnabled.toString());
});*/

TOGGLE_SETTINGS_BUTTON.addEventListener("click", function() {
    settingsOpen = !settingsOpen;

    SETTINGS_PAGE.style.display = settingsOpen ? "block" : "none";
});

FPS_LIMIT_INPUT.addEventListener("keydown", function(evnt) {
    switch (evnt.key) {
        case "Enter":
            saveFPS();
            break;
    }
});

function saveFPS() {
    maxFPS = FPS_LIMIT_INPUT.value;
}