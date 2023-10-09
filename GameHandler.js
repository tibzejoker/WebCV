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
    if (this.musicStarted == undefined) {
      setTimeout(this.playMusic.bind(this), 100);
      this.musicStarted = true;
    }
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

    this.drawScore(ctx);

    this.drawMenu(ctx);
  }

  drawMenu(ctx) {
    if (CVEnemies == undefined) {
      return;
    }
    if (CVEnemies.length > 0) {
      return;
    }
    ctx.fillStyle = "white";
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.font = "50px Arial";
    ctx.fillText("Thibaut LÉAUX", 100, 100);
    ctx.font = "30px Arial";
    ctx.fillText("Développeur mobile / fullstack ", 100, 150);
    ctx.font = "20px Arial";

    //cliquez ici pour voir mon cv
    var posShootCv = new Position(160, 223);

    ctx.fillStyle = "blue";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(posShootCv.x, posShootCv.y, 15, 0, 2 * Math.PI);
    ctx.fill();

    //draw the bullet contact zone
    ctx.fillStyle = "red";
    ctx.beginPath();
    var PosShoot = new Position(160, 192);

    ctx.arc(PosShoot.x, PosShoot.y, 15, 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.fillText("Tirez ici pour recommencer", 100, 200);
    ctx.fillText("Tirez ici pour voir mon CV", 100, 230);

    ctx.fillStyle = "green";
    ctx.globalAlpha = 1;

    //make a white rectangle around the text

    if (this.score == enemiesNumber) {
      ctx.fillStyle = "green";
      ctx.globalAlpha = 1;
      ctx.fillRect(90, 250, 500, 50);
      ctx.fillStyle = "white";
      ctx.fillText("Vous avez un score suffisant pour m'embaucher", 100, 280);
    } else {
      ctx.fillStyle = "red";
      ctx.globalAlpha = 1;
      ctx.fillRect(90, 250, 500, 50);
      ctx.fillStyle = "white";
      ctx.fillText(
        "Vous n'avez pas un score suffisant pour m'embaucher",
        100,
        280
      );
    }

    //test if there is a bullet in the menu
    for (var i = 0; i < this.bullets.length; i++) {
      var dx = this.bullets[i].x - PosShoot.x;
      var dy = this.bullets[i].y - PosShoot.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 15) {
        //collision
        this.bullets.splice(i, 1);
        //location reload to restart the game
        location.reload();
      }

      //test for the cv
      dx = this.bullets[i].x - posShootCv.x;
      dy = this.bullets[i].y - posShootCv.y;
      distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 15) {
        //collision
        this.bullets.splice(i, 1);
        //open /cv.pdf
        window.open("cv.pdf");
      }
    }

    ctx.closePath();
  }
  makeProceduralSound(freq, len) {
    if (this.musicStarted == undefined || this.audioContext == undefined) {
      return;
    }
    // create Oscillator node
    var oscillator = this.audioContext.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime); // value in hertz

    oscillator.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + len);
  }

  playMusic() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    var spaceTheme = [
      220, 220, 0, 220, 440, 0, 220, 0, 349, 523, 0, 440, 0, 349, 523, 523, 0,
      523, 659, 0, 698, 523, 0, 415, 440, 349, 0, 220, 220, 220, 0, 220, 440, 0,
      220, 0, 349, 523, 0, 440, 0, 349, 523, 523, 0, 523, 659, 0, 698, 523, 0,
      415, 440, 349, 0, 220,
    ];
    var bassline = [
      // corresponding bassline frequencies...
      110, 0, 0, 110, 220, 0, 110, 0, 174, 261, 0, 220, 0, 174, 261, 261, 0,
      261, 329, 0, 349, 261, 0, 207, 220, 174, 0, 110, 110, 0, 110, 220, 0, 110,
      0, 174, 261, 0, 220, 0, 174, 261, 261, 0, 261, 329, 0, 349, 261, 0, 207,
      220, 174, 0, 110,
      // Ensure bassline length matches melody length
    ];

    var longNotes = [110, 174, 220, 174, 207, 220, 174, 110];

    // Web Audio API
    var tempo = 0.3;

    const playMelody = () => {
      spaceTheme.forEach((frequency, index) => {
        var oscillator = this.audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(
          frequency,
          this.audioContext.currentTime
        );

        var gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          1,
          this.audioContext.currentTime + index * tempo + tempo * 0.1
        );
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + (index + 1) * tempo
        );

        oscillator.start(this.audioContext.currentTime + index * tempo);
        oscillator.stop(this.audioContext.currentTime + (index + 1) * tempo);
      });
      bassline.forEach((frequency, index) => {
        var oscillator = this.audioContext.createOscillator();
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(
          frequency,
          this.audioContext.currentTime
        );

        var gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          1,
          this.audioContext.currentTime + index * tempo + tempo * 0.1
        );
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + (index + 1) * tempo
        );

        oscillator.start(this.audioContext.currentTime + index * tempo);
        oscillator.stop(this.audioContext.currentTime + (index + 1) * tempo);
      });

      longNotes.forEach((frequency, index) => {
        var oscillator = this.audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
          frequency,
          this.audioContext.currentTime
        );

        var gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          1,
          this.audioContext.currentTime + index * tempo * 6 + tempo * 6 * 0.1
        );
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + (index + 1) * tempo * 6
        );

        oscillator.start(this.audioContext.currentTime + index * tempo * 6);
        oscillator.stop(
          this.audioContext.currentTime + (index + 1) * tempo * 6
        );
      });
    };

    // Play the melody once right away
    playMelody();

    // Then set interval to play it again at the right times
    setInterval(playMelody, tempo * 1000 * spaceTheme.length);
  }

  drawScore(ctx) {
    ctx.font = "15px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score : " + this.score, 10, 30);
  }

  drawSmoke(ctx) {
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

  addEnemies() {
    if (CVEnemies == undefined) {
      CVEnemies = [];
    }

    if (AllEnemies == undefined || AllEnemies.length == 0) {
      return;
    }
    var enemiesWithoutPosition = AllEnemies.filter(function (enemy) {
      return enemy.position == undefined;
    });

    while (CVEnemies.length < 2 && enemiesWithoutPosition.length > 0) {
      //add a random enemy
      var randomEnemy = Math.floor(
        Math.random() * enemiesWithoutPosition.length
      );
      var enemy = enemiesWithoutPosition[randomEnemy];
      CVEnemies.push(enemy);
      enemy.position = new Position(
        window.innerWidth,
        Math.random() * window.innerHeight
      );
      enemiesWithoutPosition = AllEnemies.filter(function (enemy) {
        return enemy.position == undefined;
      });
    }
  }
  handleEnemies() {
    // if (CVEnemies == undefined) {
    //   return;
    // }
    this.addEnemies();
    for (var i = 0; i < CVEnemies.length; i++) {
      //if position is not defined we place the enemies at the right of the screen
      if (CVEnemies[i].position == undefined) {
        CVEnemies[i].position = new Position(
          window.innerWidth,
          Math.random() * window.innerHeight
        );
        console.log(CVEnemies[i].position);
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
          this.makeProceduralSound(500, 0.1);
        }
        if (smallShip.life <= 0) {
          // this.stop();
          //alert with a button to restart
          // alert("Game Over");
          AllEnemies = [];
          CVEnemies = [];
          smallShip.life = 1;
          //restart the game
          // location.reload();
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
            this.makeProceduralSound(1000, 0.1);

            if (CVEnemies[i].life <= 0) {
              //draw explosion

              var position = new Position(
                structuredClone(CVEnemies[i].position.x),
                structuredClone(CVEnemies[i].position.y)
              );

              //push multiple smoke
              for (var k = 0; k < 10; k++) {
                var explosionColorsWithSmoke = [
                  "red",
                  "orange",
                  "yellow",
                  "grey",
                  "grey",
                  "grey",
                  "grey",
                  "grey",
                ];
                var smoke = {
                  x: position.x + (Math.random() - 0.5) * 10,
                  y: position.y + (Math.random() - 0.5) * 10,
                  dx: 0,
                  dy: 0,
                  radius: CVEnemies[i].size,
                  alpha: Math.random(),
                  color:
                    explosionColorsWithSmoke[
                      Math.floor(
                        Math.random() * explosionColorsWithSmoke.length
                      )
                    ],
                  lifeSpan: 40,
                };
                this.smoke.push(smoke);
              }
              CVEnemies.splice(i, 1);
              this.score += 1;

              this.makeProceduralSound(100, 0.1);
              //add score

              //if enemies are all dead we delete all the bullets
              if (CVEnemies.length == 0) {
                this.bullets = [];
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  drawEnemies(ctx) {
    if (CVEnemies == undefined) {
      return;
    }
    for (var i = 0; i < CVEnemies.length; i++) {
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
      this.makeProceduralSound(1200, 0.1);
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
    ctx.fillStyle = "white";
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
