var theme;
var japanese;
var japaneseOverlay;

var fft;
var analyzer;

var hasTitleAppeared = false;
var hasLetterAnimationStarted = false;
var hasJapaneseTitleAppeared = false;

var transparency;
var spheres = [];

var evangelion = "EVANGELION";
var letter = 0;


function preload() {
  theme = loadSound("assets/theme.mp3");
  japanese = loadImage("assets/japanese.png");
  japaneseOverlay = loadImage("assets/japanese-overlay.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  theme.play();

  // Add spheres every second
  setInterval(function() {
    spheres.push(new Sphere(random(0,3), random(0,width), height));
  }, 1000);

  // Frequencies
  fft = new p5.FFT();
  fft.setInput(theme);

  // Sound level
  analyzer = new p5.Amplitude();
  analyzer.setInput(theme);
}


function startLetterAnimation() {
  setInterval(function() {
    if (letter > 9) {
      return;
    }
    letter++;
  }, 200);

  setTimeout(function() {
    hasJapaneseTitleAppeared = true;
  }, 2500);
  hasLetterAnimationStarted = true;
}

function draw() {

  rms = analyzer.getLevel();
  transparency = map(sqrt(rms), 0, 1, 0, 255);

  // Start letter animation with burst of sound
  if (rms > 0.22) {
    hasTitleAppeared = true;
  }

  // Background
  background(0);

  /*if (!hasTitleAppeared) {
    fill(
      56, 156, 237,
      transparency
    );
    rect(0,0,width,height);
  }*/

  // Spheres
  for (var i = 0; i < spheres.length; i++) {
    var gravity = createVector(0, -0.1*spheres[i].mass);
    spheres[i].applyForce(gravity);
    spheres[i].update();
    spheres[i].display();
  }

  // Title
  textFont("Times New Roman Condensed");
  noStroke();
  fill(255);

  if (hasTitleAppeared) {

    if (width > 1100) {
      textSize(44);
      text("NEON GENESIS", width/2 - width*0.17, 220);
    } else {
      textSize(width*0.04);
      text("NEON GENESIS", width/2 - width*0.17, width*0.2);
    }

    if (!hasLetterAnimationStarted) {
      startLetterAnimation();
    }

    if (width > 1100) {
      textSize(77);
      text(evangelion.substring(0, letter), width/2 - width*0.17, 281);
    } else {
      textSize(width*0.07);
      text(evangelion.substring(0, letter), width/2 - width*0.17, width*0.255);
    }


    // Underline

    stroke(255);

    if (width > 1100) {
      line(
        width/2 - width*0.17,
        286,
        width/2 - width*0.17 + 485,
        286);
    } else {
      line(
        width/2 - width*0.17,
        width*0.26,
        width/2 + width*0.27,
        width*0.26);
    }

    // Japanese title
    if (hasJapaneseTitleAppeared) {
      if (width > 1100) {

        tint(255, map(sqrt(rms), 0, 1, 0, 170));
        image(japaneseOverlay,
          width/2 - width*0.15,
          264,
          440,
          440 * japaneseOverlay.height / japaneseOverlay.width
        );

        tint(255, 255);
        image(japanese,
          width/2 - width*0.15,
          242,
          440,
          440 * japanese.height / japanese.width
        );

      } else {

        tint(255, map(sqrt(rms), 0, 1, 0, 170));
        image(japaneseOverlay,
          width/2 - width*0.15,
          width*0.24
          ,
          width*0.4,
          width*0.4 * japaneseOverlay.height / japaneseOverlay.width
        );

        tint(255, 255);
        image(japanese,
          width/2 - width*0.15,
          width*0.22,
          width*0.4,
          width*0.4 * japanese.height / japanese.width
        );
      }
    }

  }
}

function windowResized() {
  resizeCanvas(windowWidth,windowHeight);
}

function Sphere(m,x,y) {
  this.mass = m;
  this.position = createVector(x,y);
  this.velocity = createVector(0,0);
  this.acceleration = createVector(0,0);
}

Sphere.prototype.applyForce = function(force) {
  var f = p5.Vector.div(force,this.mass);
  this.acceleration.add(f);
};

Sphere.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
};

Sphere.prototype.display = function() {
  noStroke();
  fill(56, 156, 237,transparency);
  ellipse(this.position.x,this.position.y,this.mass*16,this.mass*16);
};
