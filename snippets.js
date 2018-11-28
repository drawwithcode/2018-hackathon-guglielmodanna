function Sphere(x, diameter) {

  this.size = diameter;
  this.x = x;

  this.speed = ran;

  this.goUp() = function() {

    this.y = frame;

    this.display();
  }

  this.display = function() {
    fill(56, 156, 237,transparency);
    noStroke();
    ellipseMode(RADIUS);
    ellipse(this.x, this.y, this.size);
  }
}
