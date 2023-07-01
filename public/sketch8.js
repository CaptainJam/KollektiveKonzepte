let sketch8 = function(p) {
    let inc = 0.1;
    let scl = 10;
    let cols, rows;
    let zoff = 0;
  
    p.setup = function() {
      p.createCanvas(400, 400);
      cols = p.floor(p.width / scl);
      rows = p.floor(p.height / scl);
    }
  
    p.draw = function() {
      p.background(255);
      zoff += 0.01;
      let yoff = 0;
  
      for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
          let angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 4;
          let v = p5.Vector.fromAngle(angle);
          xoff += inc;
          p.push();
          p.translate(x * scl, y * scl);
          p.rotate(v.heading());
          p.stroke(0);
          p.line(0, 0, scl, 0);
          p.pop();
        }
        yoff += inc;
      }
    }
  }
  
  function startSketch8() {
    return new p5(sketch8, 'canvas-container');
  }
  