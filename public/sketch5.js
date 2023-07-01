let sketch5 = function(p)  {
  p.setup = function() {
    p.createCanvas(400, 400);
  }

  p.draw = function() {
    p.background(255);
    p.translate(p.width / 2, p.height / 2);
    p.rotate(p.frameCount * 0.01);
    p.strokeWeight(1);
    p.stroke(0, 50);
    for (let i = -300; i < 300; i+= 10) {
      p.line(i, -300, i, 300);
      p.line(-300, i, 300, i);
    }
  }
}


function startSketch5() {
 return new p5(sketch5, 'canvas-container');
}
