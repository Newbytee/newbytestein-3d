"use strict";

// Set up game display
const CANVAS = document.createElement("CANVAS");
CANVAS.setAttribute("id", "gameDisplay");
CANVAS.height = window.screen.availHeight / 2;
CANVAS.width = window.screen.availWidth / 2;
document.getElementById("wrapper").appendChild(CANVAS);

const MAP = [
    "#################",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#00##############",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "######00###00000#",
    "#000#00000#00000#",
    "#000#00000#00000#",
    "#000#00000#0#000#",
    "#000#00000#00000#",
    "#000#00000#00000#",
    "#000#00000#00000#",
    "#00####000#00000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#0000000000000000",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "########0########",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#000000000000000#",
    "#################"
];

let map = MAP;

const TOGGLE_SETTINGS_BUTTON = document.getElementById("settingsToggle");
const SETTINGS_PAGE = document.getElementById("innerDiv");
const CTX = CANVAS.getContext("2d");
const SCREEN_WIDTH = CANVAS.width;
const SCREEN_HEIGHT = CANVAS.height;
const MAP_WIDTH = map[0].length;
const MAP_HEIGHT = map.length;
const FOV = Math.PI / 4.0 * CANVAS.width / 500;
const MAX_DEPTH = getMaxDrawLength();
const PLAYER_MOVE_SPEED = 0.2;

let wallColour = "#AAAAAA";
let ceilingColour = "#000000";
let floorColour = "#3002ff";

let playerX = 2.5;
let playerY = 2.5;
let playerA = 0.0; // Angle which the player is looking at

let keysPressed = new Set();
let graphicsLoop = setInterval(draw, 10);
let supportsTransparency = true;
let maxFPS = 60;

CTX.imageSmoothingEnabled = false;
CANVAS.requestPointerLock = CANVAS.requestPointerLock || CANVAS.mozRequestPointerLock;

init();

function init() {
    if (/Trident/.test(window.navigator.userAgent) || /Edge/.test(window.navigator.userAgent)) {
        supportsTransparency = false;
    }

    CTX.imageSmoothingEnabled = /true/.test(localStorage.getItem("antiAliasing"));

    document.addEventListener("blur", function() {
        document.removeEventListener("mousemove", lookAround, false);
        clearInterval(graphicsLoop);
        console.log("Rendering paused");
    });

    document.addEventListener("focus", function() {
        graphicsLoop = setInterval(draw, 1000 / maxFPS);
        console.log("Rendering resumed");
    });

    document.addEventListener("keydown", function(evnt) {
        keysPressed.add(evnt.key);
    });

    document.addEventListener("keyup", function (evnt) {
        keysPressed.delete(evnt.key);
    });

    setInterval(movement, 10);

    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

    CANVAS.addEventListener("click", function() {
        CANVAS.requestPointerLock();
    });
}

function lockChangeAlert() {
    if (document.pointerLockElement === CANVAS ||
        document.mozPointerLockElement === CANVAS) {
        document.addEventListener("mousemove", lookAround, false);
        TOGGLE_SETTINGS_BUTTON.style.display = "none";
    } else {
        document.removeEventListener("mousemove", lookAround, false);
        TOGGLE_SETTINGS_BUTTON.style.display = "block";
    }
}

function lookAround(evnt) {
    playerA += evnt.movementX / 200;
}

function editMap(x, y, value) {
    const TMP = map[y];
    let tmpParts = [];

    tmpParts.push(TMP.substring(0, x));
    tmpParts.push(TMP.substring(x + 1));

    map[y] = tmpParts[0] + value + tmpParts[1];
}

function getMaxDrawLength() {
    if (MAP_HEIGHT > MAP_WIDTH) {
        return MAP_HEIGHT;
    } else {
        return MAP_WIDTH;
    }
}

function movement() {
    const FINAL_SPEED = PLAYER_MOVE_SPEED / keysPressed.size;

    keysPressed.forEach(function(value1) {
        switch (value1) {
            case "w":
                playerX += Math.sin(playerA) * FINAL_SPEED;
                playerY += Math.cos(playerA) * FINAL_SPEED;

                if (map[Math.round(playerY)][Math.round(playerX)] === "#") {
                    playerX -= Math.sin(playerA) * FINAL_SPEED;
                    playerY -= Math.cos(playerA) * FINAL_SPEED;
                }
                break;
            case "s":
                playerX -= Math.sin(playerA) * FINAL_SPEED;
                playerY -= Math.cos(playerA) * FINAL_SPEED;

                if (map[Math.round(playerY)][Math.round(playerX)] === "#") {
                    playerX += Math.sin(playerA) * FINAL_SPEED;
                    playerY += Math.cos(playerA) * FINAL_SPEED;
                }
                break;
            case "a":
                playerX -= Math.cos(playerA) * FINAL_SPEED;
                playerY += Math.sin(playerA) * FINAL_SPEED;

                if (map[Math.round(playerY)][Math.round(playerX)] === "#") {
                    playerX += Math.cos(playerA) * FINAL_SPEED;
                    playerY -= Math.sin(playerA) * FINAL_SPEED;
                }
                break;
            case "d":
                playerX += Math.cos(playerA) * FINAL_SPEED;
                playerY -= Math.sin(playerA) * FINAL_SPEED;

                if (map[Math.round(playerY)][Math.round(playerX)] === "#") {
                    playerX -= Math.cos(playerA) * FINAL_SPEED;
                    playerY += Math.sin(playerA) * FINAL_SPEED;
                }
                break;
            case "e":
                playerA += 0.2;
                break;
            case "q":
                playerA -= 0.2;
                break;
            case " ":
                const X = Math.floor(playerY + Math.sin(playerA));
                const Y = Math.trunc(playerX + Math.cos(playerA));

                console.log(X);
                console.log(Y);

                switch (map[Y][X]) {
                    case "#":
                        editMap(X, Y, "0");
                        break;
                    case "0":
                        editMap(X, Y, "#");
                        break;
                }
                break;
        }
    });
}

function draw() {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
        const RAY_ANGLE = (playerA - FOV / 2.0) + (x / SCREEN_WIDTH * FOV);

        let distanceToWall = 0.0;
        let wallHit = false;

        let eyeX = Math.sin(RAY_ANGLE);
        let eyeY = Math.cos(RAY_ANGLE);

        while (!wallHit && distanceToWall < MAX_DEPTH) {
            let testX = Math.floor(playerX + eyeX * distanceToWall);
            let testY = Math.floor(playerY + eyeY * distanceToWall);

            if (distanceToWall > MAX_DEPTH/*testX < 0 || testX > MAP_WIDTH || testY < 0 || testY > MAP_HEIGHT*/) {
                wallHit = true;
                distanceToWall = MAX_DEPTH;
            } else {
                if (map[testY][testX] === "#") {
                    wallHit = true;
                }
            }

            distanceToWall += 0.05;
        }

        const CEILING = (SCREEN_HEIGHT / 2.0) - SCREEN_HEIGHT / distanceToWall;
        const FLOOR = SCREEN_HEIGHT - CEILING;
        const WALL = CEILING + FLOOR;
        let shade = "FF";

        CTX.fillStyle = ceilingColour;
        CTX.fillRect(x, 0, 1, CEILING);

        CTX.fillStyle = "#000000";
        CTX.fillRect(x, CEILING, 1, WALL);

        let tmpShade = 0xFF - Math.floor(distanceToWall) * 10;
        shade = tmpShade.toString(16);

        if (!supportsTransparency) {
            shade = "";
        }

        CTX.fillStyle = wallColour + shade;
        CTX.fillRect(x, CEILING, 1, WALL);

        tmpShade = 0xFF - Math.floor(distanceToWall) * 3;
        shade = tmpShade.toString(16);

        if (!supportsTransparency) {
            shade = "";
        }

        CTX.fillStyle = floorColour + shade;
        CTX.fillRect(x, FLOOR, 1, SCREEN_HEIGHT);
    }
}
