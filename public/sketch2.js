var sketch2 = function(p) {
  // Use the 'p' parameter to access p5.js functions
  p.setup = function() {
    p.createCanvas(400, 400);
  }
  p.drawCircle = function(x, y, radius) {
    p.ellipse(x, y, radius, radius);
    if(radius > 2) {
      let newRadius = radius/2;
      p.drawCircle(x + radius/2, y, newRadius);
      p.drawCircle(x - radius/2, y, newRadius);
    }
  }

  p.draw = function() {
    p.background(255);
    p.drawCircle(p.width/2, p.height/2, 300);
  }
}

function startSketch2() {
  return new p5(sketch2, 'canvas-container');
}
