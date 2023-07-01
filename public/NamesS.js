let socket = io('/sketch5');
let grid;
let colors = [[248,194,165], [254,241,168], [171,224,236], [181,244,188], [254,206,236]];
let vectorColors = [];
let ellipseColors = [];
let nameInput;
let btn;
let nameStr;
let currentLetter = 0;
let backgroundAnim = 0;
let slider1;
let slider2;
let startTime;

function setup() {
  createCanvas(400, 400);
  nameInput = createInput();
  nameInput.position(20, 60);
  
  slider1 = select('#mySlider1');
  slider2 = select('#mySlider2');

  // Listen for changes to the sliders and emit those changes
  slider1.input(() => {
    socket.emit('sliderChange', {
      id: slider1.elt.id,
      value: slider1.value(),
    });
  });

  slider2.input(() => {
    socket.emit('sliderChange', {
      id: slider2.elt.id,
      value: slider2.value(),
    });
  });

  btn = createButton('submit');
  btn.position(nameInput.x + nameInput.width, 60);
  btn.mousePressed(displayName);
  
  socket.on('initialState', function(data) {
    // Set the initial values of the sliders
    slider1.value(data.mySlider1);
    slider2.value(data.mySlider2);
  });
  
  startTime = millis();  // Save the current time
  frameRate(30);

  socket.on('sliderChange', function(data) {
    let slider = select('#' + data.id);
    slider.value(data.value);
  });
}


function displayName() {
  nameStr = nameInput.value();
  currentLetter = 0;
  startTime = millis();  // Reset the start time
}

function draw() {
  background(220);
  
if ((nameStr == 'tim') || (nameStr == 'Tim') || (nameStr == 'TIM')) {
  textSize(32);
  fill(0);
  textAlign(CENTER, CENTER)
  text('that one is taken', width/2, height/2);
}else{

  if (nameStr && nameStr.length > 0) {
    textSize(width/2);
    textAlign(CENTER, CENTER);
    text(nameStr.charAt(currentLetter), width/2, height/2);
    
    if (millis() - startTime >= 6000) {  // 4 seconds have passed
      currentLetter = (currentLetter + 1) % nameStr.length;  // Loop back to the start
      backgroundAnim = Math.floor(random(0, 5));  // Change the animation
      startTime = millis();  // Reset the start time
    }
    
    switch(backgroundAnim) {
      case 0:
        animation1(slider1.value(), slider2.value());
        break;
      case 1:
        animation2(slider1.value(), slider2.value());
        break;
      case 2:
        animation3(slider1.value(), slider2.value());
        break;
      case 3:
        animation4(slider1.value(), slider2.value());
        break;
      case 4:
        animation5(slider1.value(), slider2.value());
        break;
    }
  }
}

}




// Animation 1: CirclingEllipses
function animation1(sliderVal1, sliderVal2) {

  // Draw the background
  background(250,248,246);

  // Draw the text
  fill(222);  // Set the text color to black
  textSize(width/2);
  textAlign(CENTER, CENTER);
  text(nameStr.charAt(currentLetter), width/2, height/2);


  let numEllipses = 110; // control number of ellipses with slider1
  console.log(sliderVal1);
  let maxDiameter = sliderVal2; // control maximum diameter with slider2
  
  // If the number of ellipses has increased, assign new colors to the new ellipses
  while (ellipseColors.length < numEllipses) {
    ellipseColors.push(random(colors));
  }
  
  noStroke();
  for (let i = 0; i < numEllipses; i++) {
    let color = ellipseColors[i];
    fill(color[0], color[1], color[2]);
    let diameter = maxDiameter * (0.5 + 0.5 * sin(millis() / 1000 + i+ (sliderVal1/10)));
    let x = width/2 + width/4 * sin(millis() / 2000 + i);
    let y = height/2 + height/4 * cos(millis() / 2000 + i);
    ellipse(x, y, diameter, diameter);
  }

  // Set text color to black
  fill(0);
}

// Animation 2: VectorNoiseField
function animation2(sliderVal1, sliderVal2) {

  // Draw the background
  background(5,7,9);

  // Draw the text
  fill(250,248,246);  // Set the text color to black
  textSize(width/2);
  textAlign(CENTER, CENTER);
  text(nameStr.charAt(currentLetter), width-100, height-100);

  let scale = 0.05; // base noise scale
  let strokeWeightVal = sliderVal1/5; // control vector length with slider1
  let rotationSpeed = sliderVal2/100; // control rotation speed with slider2
  let vectorLength = 10; // base vector length
  let gridSize = 20; // size of grid squares

  let cols = floor(width / gridSize);
  let rows = floor(height / gridSize);

  // If the number of vectors has increased, assign new colors to the new vectors
  while (vectorColors.length < cols * rows) {
    vectorColors.push(random(colors));
  }

  noFill();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let xoff = i * scale + frameCount * 0.01 * rotationSpeed; 
      let yoff = j * scale + frameCount * 0.01 * rotationSpeed;

      let angle = noise(xoff, yoff) * TWO_PI * 4; // generate Perlin noise value for angle
      let v = p5.Vector.fromAngle(angle); // create vector from angle
      v.mult(strokeWeightVal * vectorLength); // lengthen vector according to slider

      let posX = i * gridSize + gridSize / 2; // x position
      let posY = j * gridSize + gridSize / 2; // y position

      let index = i + j * cols;
      let color = vectorColors[index];
      stroke(color[0], color[1], color[2]);

      push();
      translate(posX, posY);
      line(0, 0, v.x, v.y);
      pop();
    }
  }

  // Set text color to black
  fill(0);
}

// Animation 3: Grid of Rotating Letters
function animation3(sliderVal1, sliderVal2) {
  // Draw the background
  background(248,194,165);

  // Animation
  let cellSize = sliderVal2*2;  // The size of each cell in the grid
  let rotationSpeed = sliderVal1 / 10.0;  // Control rotation speed with slider1
  let offsetSpeed = 0;  // Control offset speed with slider2
  let time = millis() / 1000.0;  // Current time in seconds
  let offsetX = width/2 + sin(time * offsetSpeed) * width/4;  // Horizontal offset
  let offsetY = height/2 + cos(time * offsetSpeed) * height/4;  // Vertical offset
  
  // Loop over each cell in the grid
  for (let i = -1; i < width/cellSize + 1; i++) {
    for (let j = -1; j < height/cellSize + 1; j++) {
      // Calculate position of cell
      let x = i * cellSize ;
      let y = j * cellSize ;

      // Draw letter in cell
      push();
      translate(x, y);
      rotate(time * rotationSpeed);
      fill(0);  // Set text color to black
      textSize(cellSize);
      textAlign(CENTER, CENTER);
      text(nameStr.charAt(currentLetter), 0, 0);
      pop();
    }
  }
/*
  // Draw the text
  fill(0);  // Set the text color to black
  textSize(width/2);
  textAlign(CENTER, CENTER);
  text(nameStr.charAt(currentLetter), width/2, height/2);*/
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
// Animation 4: Cellular Automaton
function animation4(sliderVal1, sliderVal2) {
   // Color palette
   let palette = [
    color(248,194,165),
    color(254,241,168),
    color(171,224,236),
    color(181,244,188),
    color(254,206,236)
  ];

  // Draw the background
  background(palette[0]);

  // Parameters
  let resolution = 20 + sliderVal1/2;  // Size of each cell (controlled by slider1)
  let speed = 7;  // Speed of generation updates (controlled by slider2)
console.log(speed);
  let cols = Math.max(1, Math.floor(width / resolution));
  let rows = Math.max(1, Math.floor(height / resolution));

  

  // Initialize grid if it doesn't exist or if resolution has changed
  if (!grid || grid.length != cols || grid[0].length != rows) {
    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = floor(random(2));
      }
    }
  }

  // Update generations
  if (frameCount % speed == 0) {
    grid = nextGeneration(grid);
  }

  // Draw grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        fill(palette[1]);
        noStroke();
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }

  // Draw the text
  push()
  fill(254,241,168); 
  rotate(sliderVal2/100);
  textSize(width/2*sliderVal2/25);
  textAlign(CENTER, CENTER);
  text(nameStr.charAt(currentLetter), width/3*2, height/8);
  pop()
}



function nextGeneration(grid) {
  let next = make2DArray(grid.length, grid[0].length);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let state = grid[i][j];
      let neighbours = countNeighbours(grid, i, j);

      if (state == 0 && neighbours == 3) {
        next[i][j] = 1;
      } else if (state == 1 && (neighbours < 2 || neighbours > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  return next;
}

function countNeighbours(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + grid.length) % grid.length;
      let row = (y + j + grid[0].length) % grid[0].length;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}


// Animation 5: Sine and Cosine Curves with letters
function animation5(sliderVal1, sliderVal2) {
  // Color palette
  let palette = [
    color(248,194,165),
    color(254,241,168),
    color(171,224,236),
    color(181,244,188),
    color(254,206,236)
  ];

  // Draw the background
  background(5,7,9);

  let speed = 0;  // Speed of curve moving up
  let amplitude = 1 + sliderVal2 / 10;  // Amplitude of curve
  
  // Start position
  let startY = frameCount * speed % (height*2);

  // Draw curves
  for (let i = 0; i < 5; i++) {
    // Set color for this curve
    stroke(palette[i % palette.length]);

    // Calculate start and end Y for this curve
    let thisStartY = (startY + i * height / 5) % height;
    let thisEndY = (thisStartY - height / 5 + height) % height;

    // Draw the curve
    noFill();
    beginShape();
    for (let x = 0; x <= width; x++) {
      let y = map(sin(2 * PI * (x / width - frameCount / 100)), -i-sliderVal1/100, i+sliderVal1/100, thisStartY, thisEndY);
      vertex(x, y);
    }
    endShape();
  }

  // Draw letters
  textSize(24);
  fill(250,248,246);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < 10; i++) {
    let x = i * width / 10 + frameCount * speed % (width / 10);
    let y = startY + amplitude * 50 * sin(2 * PI * (x / width - frameCount / 100));
    text(nameStr.charAt(currentLetter), x, y);
  }
}
