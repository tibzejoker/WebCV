//constructor to lanch the main loop
class GameHandler {
  constructor() {
    this.mousePos = { x: 0, y: 0 };
    this.initRandomStars();
    this.createSun();
    this.bullets = [];
    this.smoke = [];
    this.lifePacks = [];
    this.score = 0;
  }

  createSun() {
    var sun = {
      x: window.innerWidth * Math.random(),
      y: window.innerHeight * Math.random(),
      radius: 20,
      alpha: 1,
      color: "yellow",
    };
    this.sun = sun;
  }

  initRandomStars() {
    var stars = [];
    var starsNB = 1000;
    for (var i = 0; i < starsNB; i++) {
      //white blue yellow red but with a color closer to white
      var availableColors = ["white"];
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1,
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

    this.drawSmoke(ctx);

    this.moveShip();

    //call drawShip and pass the context as argument
    this.drawShip(ctx);

    this.handleMouseClick();

    this.drawBullets(ctx);

    this.handleEnemies();

    this.drawEnemies(ctx);

    this.createLifePack();

    this.drawLifePack(ctx);
  }

  drawSmoke(ctx) {
    console.log(this.smoke.length);
    for (var i = 0; i < this.smoke.length; i++) {
      ctx.fillStyle = this.smoke[i].color;
      ctx.globalAlpha = this.smoke[i].alpha * (this.smoke[i].lifeSpan / 10);
      ctx.beginPath();
      ctx.arc(
        this.smoke[i].x,
        this.smoke[i].y,
        this.smoke[i].radius,
        0,
        2 * Math.PI
      );
      ctx.fill();
      //move the smoke
      this.smoke[i].x += this.smoke[i].dx * 0.1;
      this.smoke[i].y += this.smoke[i].dy * 0.1;
      this.smoke[i].lifeSpan -= 1;
      if (this.smoke[i].lifeSpan <= 0) {
        this.smoke.splice(i, 1);
      }
    }
  }

  createLifePack() {
    //only pass to next 1/10 of the time
    var random = Math.random();
    if (random > 0.001) return;

    if (this.lifePacks.length < 2) {
      var lifePack = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 10,
        alpha: 1,
        color: "green",
      };
      this.lifePacks.push(lifePack);
    }
  }

  drawLifePack(ctx) {
    for (var i = 0; i < this.lifePacks.length; i++) {
      ctx.fillStyle = this.lifePacks[i].color;
      ctx.globalAlpha = this.lifePacks[i].alpha;
      ctx.beginPath();
      //draw a square
      ctx.fillRect(
        this.lifePacks[i].x,
        this.lifePacks[i].y,
        this.lifePacks[i].radius,
        this.lifePacks[i].radius
      );
      //move the bullet
      // this.lifePacks[i].x += this.lifePacks[i].dx * 0.1;
      // this.lifePacks[i].y += this.lifePacks[i].dy * 0.1;

      //test for collision with the ship
      var dx = this.lifePacks[i].x - smallShip.position.x;
      var dy = this.lifePacks[i].y - smallShip.position.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.lifePacks[i].radius + smallShip.size) {
        //collision
        if (smallShip.life < 100) {
          smallShip.life += 10;
        }
        this.lifePacks.splice(i, 1);
      }
    }
  }

  handleEnemies() {
    for (var i = 0; i < CVEnemies.length; i++) {
      //if position is not defined we create a random position
      if (CVEnemies[i].position == undefined) {
        CVEnemies[i].position = new Position(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }

      //move the enemy towards the ship
      var dx = smallShip.position.x - CVEnemies[i].position.x;
      var dy = smallShip.position.y - CVEnemies[i].position.y;
      var angle = Math.atan2(dy, dx);
      var speed = CVEnemies[i].speed;
      CVEnemies[i].position.x += Math.cos(angle) * speed;
      CVEnemies[i].position.y += Math.sin(angle) * speed;

      //test for collision with the ship
      var dx = CVEnemies[i].position.x - smallShip.position.x;
      var dy = CVEnemies[i].position.y - smallShip.position.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < CVEnemies[i].size + smallShip.size) {
        //collision
        if (smallShip.life > 0) {
          smallShip.life -= 1;
        }
        if (smallShip.life <= 0) {
          this.stop();
        }
      }

      //test for collision with the bullets
      try {
        for (var j = 0; j < this.bullets.length; j++) {
          var dx = CVEnemies[i].position.x - this.bullets[j].x;
          var dy = CVEnemies[i].position.y - this.bullets[j].y;
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < CVEnemies[i].size + this.bullets[j].radius) {
            //collision
            CVEnemies[i].life -= 10;
            this.bullets[j].alpha = 0;
            if (CVEnemies[i].life <= 0) {
              CVEnemies.splice(i, 1);
              //draw explosion

              var smoke = {
                x: CVEnemies[i].position.x,
                y: CVEnemies[i].position.y,
                dx: Math.cos(angle) * -1,
                dy: Math.sin(angle) * -1,
                radius: 20,
                alpha: 1,
                color: "yellow",
                lifeSpan: 10,
              };
              this.smoke.push(smoke);
            }
          }
        }
      } catch (e) {}
    }
  }

  drawEnemies(ctx) {
    for (var i = 0; i < CVEnemies.length; i++) {
      //if position is not defined we create a random position
      if (CVEnemies[i].position == undefined) {
        CVEnemies[i].position = new Position(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }
      ctx.fillStyle = CVEnemies[i].color;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(
        CVEnemies[i].position.x,
        CVEnemies[i].position.y,
        CVEnemies[i].size,
        0,
        2 * Math.PI
      );
      ctx.fill();

      ctx.fillStyle = CVEnemies[i].color;
      ctx.globalAlpha = 1;
      ctx.fillRect(
        CVEnemies[i].position.x,
        CVEnemies[i].position.y,
        CVEnemies[i].size,
        CVEnemies[i].size
      );
      ctx.font = "10px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(
        CVEnemies[i].name,
        CVEnemies[i].position.x,
        CVEnemies[i].position.y
      );

      //draw life bar
      ctx.fillStyle = "red";
      ctx.fillRect(
        CVEnemies[i].position.x - CVEnemies[i].size,
        CVEnemies[i].position.y - CVEnemies[i].size - 5,
        CVEnemies[i].life / 2,
        2
      );
    }
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

    //draw life bar
    ctx.fillStyle = "green";
    ctx.fillRect(
      smallShip.position.x - smallShip.size,
      smallShip.position.y - smallShip.size - 5,
      smallShip.life / 2,
      2
    );
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

    //draw smoke behind the ship
    var smoke = {
      x: smallShip.position.x,
      y: smallShip.position.y,
      dx: Math.cos(angle) * -1,
      dy: Math.sin(angle) * -1,
      radius: 2,
      alpha: 1,
      color: "yellow",
      lifeSpan: 10,
    };

    this.smoke.push(smoke);
  }
}
