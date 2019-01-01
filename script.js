"use strict";

// Set up game display
const CANVAS = document.createElement("CANVAS");
CANVAS.setAttribute("id", "gameDisplay");
CANVAS.height = window.screen.availHeight;
CANVAS.width = window.screen.availWidth;
document.getElementById("wrapper").appendChild(CANVAS);


const MAP = [
    "########",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "#000000#",
    "########"
];

//const CANVAS = document.getElementById("gameDisplay");
const CTX = CANVAS.getContext("2d");
const SCREEN_WIDTH = CANVAS.width;
const SCREEN_HEIGHT = CANVAS.height;
const MAP_WIDTH = MAP[0].length;
const MAP_HEIGHT = MAP.length;
const FOV = Math.PI / 4.0;
const MAX_DEPTH = getMaxDrawLength();

let wallColour = "#AAAAAA";
let ceilingColour = "#000000";
let floorColour = "#3002ff";

let playerX = 4.0;
let playerY = 4.0;
let playerA = 0.0; // Angle which the player is looking at

CTX.imageSmoothingEnabled = false;

setInterval(draw, 100);

document.addEventListener("keydown", function(evnt) {
    switch (evnt.key) {
        case "w":
            playerX += Math.sin(playerA) * 2.0;
            playerY += Math.cos(playerA) * 2.0;
            break;
        case "s":
            playerX -= Math.sin(playerA) * 2.0;
            playerY -= Math.cos(playerA) * 2.0;
            break;
        case "d":
            playerA += 0.2;
            break;
        case "a":
            playerA -= 0.2;
            break;
    }
});

function getMaxDrawLength() {
    if (MAP_HEIGHT > MAP_WIDTH) {
        return MAP_HEIGHT;
    } else {
        return MAP_WIDTH;
    }
}

function draw() {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
        const RAY_ANGLE = (playerA - FOV / 2.0) + (x / SCREEN_WIDTH * FOV);

        let distanceToWall = 0.0;
        let wallHit = false;

        let eyeX = Math.sin(RAY_ANGLE);
        let eyeY = Math.cos(RAY_ANGLE);

        while (!wallHit && distanceToWall < MAX_DEPTH) {
            distanceToWall += 0.1;

            let testX = Math.floor(playerX + eyeX * distanceToWall);
            let testY = Math.floor(playerY + eyeY * distanceToWall);

            if (testX < 0 || testX > MAP_WIDTH || testY < 0 || testY > MAP_HEIGHT) {
                wallHit = true;
                distanceToWall = MAX_DEPTH;
            } else {
                if (MAP[testY][testX] === "#") {
                    wallHit = true;
                }
            }
        }

        const CEILING = (SCREEN_HEIGHT / 2.0) - SCREEN_HEIGHT / distanceToWall;
        const FLOOR = SCREEN_HEIGHT - CEILING;
        const WALL = CEILING + FLOOR;
        let shade = "FF";

        CTX.fillStyle = ceilingColour;
        CTX.fillRect(x, 0, 1, CEILING);

        CTX.fillStyle = "#000000";
        CTX.fillRect(x, CEILING, 1, WALL);

        let tmpShade = 0xFF - Math.floor(distanceToWall) * 12;
        shade = tmpShade.toString(16);

        CTX.fillStyle = wallColour + shade;
        CTX.fillRect(x, CEILING, 1, WALL);

        CTX.fillStyle = floorColour;
        CTX.fillRect(x, FLOOR, 1, SCREEN_HEIGHT);
    }
}
