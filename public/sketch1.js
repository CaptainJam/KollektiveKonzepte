var sketch1 = function(p) {
  let angle = 0;
  p.setup = function() {
    p.createCanvas(400, 400);
  }
  p.draw = function() {
    p.background(204);
    let y = p.height/2 + p.sin(angle) * p.height/3;
    p.ellipse(p.width/2, y, 50, 50);
    angle += 0.02;
  }
}

function startSketch1() {
  return new p5(sketch1, 'canvas-container');
}

