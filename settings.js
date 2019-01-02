"use strict";

const ANTI_ALIASING_CHECK = document.getElementById("antiAliasingToggle");
const FPS_LIMIT_INPUT = document.getElementById("FPSLimit");

/*ANTI_ALIASING_CHECK.addEventListener("change", function() {
    CTX.imageSmoothingEnabled = ANTI_ALIASING_CHECK.checked;
    localStorage.setItem("antiAliasing", CTX.imageSmoothingEnabled.toString());
});*/

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