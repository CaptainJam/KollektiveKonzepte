let sketch6 = function(p) {

  p.setup = function() {
    p.createCanvas(400, 400);
  }

  function superformula(a, b, m, n1, n2, n3, phi) {
    return p.pow(p.abs(p.cos(m * phi / 4) / a, n2) + p.pow(p.abs(p.sin(m * phi / 4) / b, n3), -1 / n1), -1 / n1);
  }

  p.draw = function() {
    p.background(0);
    p.translate(p.width / 2, p.height / 2);
    p.stroke(255);
    p.noFill();

    let m = p.map(p.mouseX, 0, p.width, 0, 10);
    let a = 1;
    let b = 1;
    let n1 = 0.3;
    let n2 = 0.3;
    let n3 = 0.3;

    p.beginShape();
    for (let angle = 0; angle < p.TWO_PI; angle += 0.1) {
      let r = superformula(a, b, m, n1, n2, n3, angle);
      let x = r * p.cos(angle) * 100;
      let y = r * p.sin(angle) * 100;
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }
}

function startSketch6() {
  return new p5(sketch6, 'canvas-container');
}
