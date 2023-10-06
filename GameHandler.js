//constructor to lanch the main loop
class GameHandler {
  constructor() {
    this.mousePos = { x: 0, y: 0 };
    this.initRandomStars();
    this.createSun();
    this.bullets = [];
  }

  createSun() {
    var sun = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 20,
      alpha: 1,
      color: "yellow",
    };
    this.sun = sun;
  }

  initRandomStars() {
    var stars = [];
    var starsNB = 100;
    for (var i = 0; i < starsNB; i++) {
      //white blue yellow red but with a color closer to white
      var availableColors = ["white"];
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2,
        alpha: Math.random(),
        //random color between white blue yellow
        color: availableColors[Math.floor(Math.random() * 3)],
      });
    }
    this.stars = stars;
  }

  setCursorPosition(position) {
    this.mousePos = position;
  }

  makeMouseClick(position) {
    this.mouseClick = position;
  }

  start() {
    console.log("start");
    if (this.timedFunction == undefined) {
      this.timedFunction = setInterval(this.update.bind(this), 10);
    }
  }

  stop() {
    if (this.timedFunction == undefined) {
      console.log("stop");
      return;
    }
    //stop the main loop
    clearInterval(this.timedFunction);
    this.timedFunction = undefined;
    //remove the event listener
    window.removeEventListener("mousemove", init);
  }

  update() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawStars(ctx);
    this.drawSun(ctx);

    this.moveShip();

    //call drawShip and pass the context as argument
    this.drawShip(ctx);

    this.handleMouseClick();

    this.drawBullets(ctx);
  }

  drawBullets(ctx) {
    // console.log(this.bullets.length);
    for (var i = 0; i < this.bullets.length; i++) {
      ctx.fillStyle = this.bullets[i].color;
      ctx.globalAlpha = this.bullets[i].alpha;
      ctx.beginPath();
      ctx.arc(
        this.bullets[i].x,
        this.bullets[i].y,
        this.bullets[i].radius,
        0,
        2 * Math.PI
      );
      ctx.fill();
      //move the bullet
      this.bullets[i].x += this.bullets[i].dx * 0.1;
      this.bullets[i].y += this.bullets[i].dy * 0.1;
    }
    //remove bullets that are out of the screen
    this.bullets = this.bullets.filter(function (bullet) {
      return (
        bullet.x > 0 &&
        bullet.x < window.innerWidth &&
        bullet.y > 0 &&
        bullet.y < window.innerHeight
      );
    });
  }

  handleMouseClick() {
    if (this.mouseClick != undefined) {
      var bulletSpeed = 50;
      var shipSpeed = smallShip.speed;

      var dx = this.mouseClick.x - smallShip.position.x;
      var dy = this.mouseClick.y - smallShip.position.y;

      var angle = Math.atan2(dy, dx);

      //now that we have the angle we can calculate the dx and dy of the bullet using the speed
      dx = Math.cos(angle) * bulletSpeed + Math.cos(angle) * shipSpeed;
      dy = Math.sin(angle) * bulletSpeed + Math.sin(angle) * shipSpeed;

      var bullet = {
        x: smallShip.position.x,
        y: smallShip.position.y,
        dx: dx,
        dy: dy,
        radius: 2,
        alpha: 1,
        color: "orange",
      };
      this.bullets.push(bullet);
      this.mouseClick = undefined;
    }
  }

  drawSun(ctx) {
    ctx.fillStyle = this.sun.color;
    ctx.globalAlpha = this.sun.alpha;
    ctx.beginPath();
    ctx.arc(this.sun.x, this.sun.y, this.sun.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  drawStars(ctx) {
    for (var i = 0; i < this.stars.length; i++) {
      ctx.fillStyle = this.stars[i].color;
      ctx.beginPath();
      ctx.arc(
        this.stars[i].x,
        this.stars[i].y,
        this.stars[i].radius,
        0,
        2 * Math.PI
      );
      ctx.globalAlpha = this.stars[i].alpha;
      ctx.fill();
    }
  }

  drawShip(ctx) {
    //screen size
    var width = window.innerWidth;
    var height = window.innerHeight;

    //calculate angle to point towards the mouse
    var dx = this.mousePos.x - smallShip.position.x;
    var dy = this.mousePos.y - smallShip.position.y;
    var angle = Math.atan2(dy, dx);

    //display ship
    ctx.fillStyle = "grey";
    ctx.globalAlpha = 1;
    ctx.beginPath();

    //move to ship position and rotate context
    ctx.translate(smallShip.position.x, smallShip.position.y);
    ctx.rotate(angle);

    //drawing the ship using the rotated context
    ctx.moveTo(0, 0);
    for (var i = 0; i < smallShip.shape.length; i++) {
      var widthProportionalToScreen = (smallShip.shape[i][0] / width) * 1000;
      var heightProportionalToScreen = (smallShip.shape[i][1] / height) * 1000;
      ctx.lineTo(widthProportionalToScreen, heightProportionalToScreen);
    }
    ctx.closePath();
    ctx.fill();

    //reset the transformation matrix to avoid affecting subsequent drawings
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    //draw a mouse target at the current mouse position
    ctx.fillStyle = "red";
    ctx.fillRect(this.mousePos.x, this.mousePos.y, 3, 3);
    ctx.closePath();
  }

  //move the ship towards the mouse
  moveShip() {
    var dx = this.mousePos.x - smallShip.position.x;
    var dy = this.mousePos.y - smallShip.position.y;

    //if the ship is already at the mouse position do nothing
    var angle = Math.atan2(dy, dx);
    //speed proportional to the distance from the mouse
    var speed = Math.sqrt(dx * dx + dy * dy) * 0.05;
    smallShip.speed = speed;
    //max speed
    if (speed > 5) speed = 5;
    smallShip.position.x += Math.cos(angle) * speed;
    smallShip.position.y += Math.sin(angle) * speed;
  }
}
