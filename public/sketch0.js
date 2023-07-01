var sketch0 = function(p) {
  let xoff = 0.0;
  p.setup = function() {
    p.createCanvas(400, 400);
  }
  p.draw = function() {
    xoff = xoff + .01;
    let n = p.noise(xoff) * p.width;
  
    p.line(n, 0, n, p.height);
    p.fill(125);
  }
}

function startSketch0() {
  return new p5(sketch0, 'canvas-container');
}


