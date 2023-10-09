//import GameHandler from "./gameHandler.js";
//import { Position } from "./position.js";

var smallShip = {
  name: "smallShip",
  size: 10,
  life: 30,
  speed: 0,
  color: "white",
  // Assuming (0,0) as the center of the ship
  shape: [
    [-10, -10], // Top left
    [10, 0], // Top right
    [10, 0], // Bottom right
    [-10, 10], // Bottom left
  ],
  position: { x: 20, y: 20 }, // Assuming Position is an object with x, y properties
};

var dateOfBirth = new Date(1993, 2, 11);
var ageDifYear =
  (Date.now() - dateOfBirth.getTime()) / 1000 / 60 / 60 / 24 / 365;
//truncate the age to 2 decimals
ageDifYear = Math.trunc(ageDifYear * 100) / 100;

//now we add elements of my resume to the game as enemies
var AllEnemies = [
  new Enemy("Thibaut LÉAUX", 1000, 10, 1, "blue"),
  new Enemy("Age " + ageDifYear, 25, 4, 0.5, "blue"),

  new Enemy("Anglais avancé", 10, 4, 0.5 + Math.random() / 3, "#00ffAA"),
  new Enemy(
    "Applications, Webapps Flutter",
    100,
    10,
    0.1 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Développement C#, C++ et JS",
    100,
    10,
    0.1 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Projets complexes",
    100,
    10,
    0.1 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Fullstack front back NodeJS, PHP ou Springboot",
    100,
    15,
    0.8 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "C++ et microcontrôleurs (Arduino, STM32, Raspberry Pi)",
    100,
    12,
    0.4 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Python et robotique (ROS et Pepper Aldebaran)",
    100,
    17,
    0.5 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Git Jetbrains, GitlabCI",
    150,
    20,
    0.1 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Conception/Pilotage Drone FPV",
    Math.random() * 40,
    Math.random() * 40,
    Math.random() / 2,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "NodeJS, PHP ou Springboot",
    Math.random() * 40,
    Math.random() * 40,
    Math.random() / 2,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Flutter",
    Math.random() * 80 + 50,
    Math.random() * 40,
    Math.random() / 2,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "React Native",
    Math.random() * 20,
    Math.random() * 20,
    Math.random() / 2,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
];

var enemiesNumber = AllEnemies.length;

var CVEnemies;

GameHandler = new GameHandler();
function resizeCanvasToDisplaySize(canvas) {
  // get the display size of the canvas.
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;

  // check if the canvas size is different from its display size.
  if (canvas.width !== width || canvas.height !== height) {
    // make the canvas the same size
    canvas.width = width;
    canvas.height = height;
  }
}
function init() {
  var canvas = document.getElementById("canvas");
  resizeCanvasToDisplaySize(canvas);
  GameHandler.start();
}

function setCursorPosition(event) {
  GameHandler.setCursorPosition(new Position(event.clientX, event.clientY));
}

function makeMouseClick(event) {
  GameHandler.makeMouseClick(new Position(event.clientX, event.clientY));
}
//on widown size change init function is called
window.addEventListener("resize", init);

//add and event listener to the mouse click
window.addEventListener("click", makeMouseClick);
