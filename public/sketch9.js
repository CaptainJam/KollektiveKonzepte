let sketch9 = function(p) {
  let inc = 0.1;
  let scl = 10;
  let cols, rows;
  let zoff = 0;
  let particles = [];
  let flowfield;

  p.setup = function() {
    p.createCanvas(400, 400);
    cols = p.floor(p.width / scl);
    rows = p.floor(p.height / scl);
    flowfield = new Array(cols * rows);
    for (let i = 0; i < 2000; i++) { // Increase the number of particles
      particles[i] = new Particle();
    }
  }

  p.draw = function() {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
        let index = x + y * cols;
        let angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 4;
        let v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[index] = v;
        xoff += inc;
      }
      yoff += inc;
    }
    zoff += 0.01;
    p.background(255);

    for (let i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges(); // This function handles wrapping around the screen
      particles[i].show();
    }
  }

  class Particle {
    constructor() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p.createVector(0, 0);
      this.acc = p.createVector(0, 0);
      this.maxspeed = 2;
      this.prevPos = this.pos.copy();
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    edges() {
      if (this.pos.x > p.width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = p.height;
    }

    follow(vectors) {
      let x = p.floor(this.pos.x / scl);
      let y = p.floor(this.pos.y / scl);
      let index = x + y * cols;
      let force = vectors[index];
      this.applyForce(force);
    }

    show() {
      p.stroke(5, 5);
      p.strokeWeight(15);
      p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
      this.updatePrev();
    }

    updatePrev() {
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }
  }
}

function startSketch9() {
  return new p5(sketch9, 'canvas-container');
}
