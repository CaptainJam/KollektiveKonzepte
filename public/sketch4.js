let sketch4 = function(p)  {
  let grid;
  let cols;
  let rows;
  let resolution = 10;

  function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

  p.setup = function() {
    p.createCanvas(400, 400);
    cols = p.width / resolution;
    rows = p.height / resolution;

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = p.floor(p.random(2));
      }
    }
  }

  p.draw = function() {
    p.background(0);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        if (grid[i][j] == 1) {
          p.fill(255);
          p.stroke(0);
          p.rect(x, y, resolution - 1, resolution - 1);
        }
      }
    }

    let next = make2DArray(cols, rows);

    // Compute next based on grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
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

    grid = next;
  }

  function countNeighbours(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + cols) % cols;
        let row = (y + j + rows) % rows;
        sum += grid[col][row];
      }
    }
    sum -= grid[x][y];
    return sum;
  }
}

function startSketch4() {
  return new p5(sketch4, 'canvas-container');
}