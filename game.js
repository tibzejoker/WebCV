//import GameHandler from "./gameHandler.js";
//import { Position } from "./position.js";

var smallShip = {
  name: "smallShip",
  size: 20,
  points: 30,
  speed: 0,
  color: "white",
  // Assuming (0,0) as the center of the ship
  shape: [
    [-4, -4], // Top left
    [4, 0], // Top right
    [4, 0], // Bottom right
    [-4, 4], // Bottom left
  ],
  position: { x: 20, y: 20 }, // Assuming Position is an object with x, y properties
};

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
