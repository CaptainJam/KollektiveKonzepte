let sketchFractalTree = function(p) {
  let axiom = "F";
  let rules = {
    "F": "FF+[+F-F-F]-[-F+F+F]"
  };
  let angle;
  let len = 100;
  let angleChange = 0.01;
  let maxGenerations = 5; // Adjust this to change complexity

  function generate() {
    let nextAxiom = "";
    for(let char of axiom) {
      nextAxiom += (char in rules) ? rules[char] : char;
    }
    axiom = nextAxiom;
    len *= 0.5;
  }

  p.setup = function() {
    p.createCanvas(400, 400);
    angle = p.radians(22.5);
    p.background(51);
    p.stroke(255, 100);
    for(let i = 0; i < maxGenerations; i++) generate();
  }

  p.draw = function() {
    p.background(51);
    p.translate(p.width/2, p.height);
    angle += angleChange;
    if (angle > p.radians(27.5) || angle < p.radians(17.5)) {
      angleChange *= -1;
    }
    drawAxiom();
  }

  function drawAxiom() {
    for(let char of axiom) {
      if(char === "F") {
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
      } else if(char === "+") {
        p.rotate(angle);
      } else if(char === "-") {
        p.rotate(-angle);
      } else if(char === "[") {
        p.push();
      } else if(char === "]") {
        p.pop();
      }
    }
  }
}

// To use it:
function startSketch3() {
  return new p5(sketchFractalTree, 'canvas-container');
}
