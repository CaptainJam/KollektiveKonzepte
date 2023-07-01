let socket = io('/sketch1'); // Or whatever namespace you're using


let volHistory = [];
let volHistory2 = [];
/*
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(200);
  
  // Get the last 10 values from volHistory
  let values = volHistory.slice(-10);
  
  // Draw a bar for each value
  for (let i = 0; i < values.length; i++) {
    let x = map(i, 0, values.length, 0, width);
    let h = map(values[i], 0, 1, 0, height);
    rect(x, height - h, width / values.length, h);
  }
  console.log(volHistory);
}
*/
// Listening for 'volLevels' event from the server

socket.on('volLevels', data => {
  volHistory2 = data;
  
});


let amp;
let r;
let g;
let colorcount;
let colord;
let colors= [];
let pastVolHistory = [];
let recentAverage = [];
let boxHeights = [10, 10, 10, 10, 10];

let crashCount;

function setup() {


  createCanvas(windowWidth,windowHeight,WEBGL);

  background(0);

  amp = new p5.Amplitude();
  r = 0;
  g = 0;

  colord =0;
  colorcount= 255;

crashCount=0;

  boxHeights = [10, 10, 10, 10, 10];

  colors = [
    color(248,194,165),
    color(254,241,168),
    color(171,224,236),
    color(181,244,188),
    color(254,206,236),
    color(250,248,246)
  ];

}






function draw(){

  console.log(volHistory2);
let mult = 1;
let mult2=2;

  background(colors[0]);
let vol = 0;
vol = volHistory2[volHistory2.length - 1];

 vol=vol*mult2;
  volHistory.push(vol);



  if(isNaN(vol)){
    vol = 0;
  };

  console.log(vol);
  if (volHistory.length > 200) {
    volHistory.shift();
  }
  
  // When we have enough samples
  if (volHistory.length == 200 && frameCount % 100 === 0) {
    // Split the array into the last 100 elements and the 100 before
    recentVolHistory = volHistory.slice(10);
    pastVolHistory = volHistory.slice(0, 10);

    // Calculate the average volume for these two periods
    recentAverage = calculateAverage(recentVolHistory);
   //console.log(recentAverage);
    pastAverage = calculateAverage(pastVolHistory);
   //console.log(pastAverage);

   console.log(Math.abs(recentAverage - pastAverage));
    // If the difference is greater than 30%, shuffle the colors
    if (Math.abs(recentAverage - pastAverage) > 0.05) {
      shuffleArray(colors);
    }
  }
  volHistory = volHistory.flat();

  let vol2 =0.1;
  let vol3 =0.1;
  
if (crashCount < 50) {
  vol2 =0.1;
  vol3 = 0.1;
}else{
  vol2 = (volHistory.length >= 5) ? volHistory[volHistory.length - 5] : 0;

 vol3 = (volHistory.length >= 10) ? volHistory[volHistory.length - 10] : 0;
}

console.log(vol2,vol3);
if(isNaN(vol2)){
  vol2 = 0.1;
};

if(isNaN(vol3)){
  vol3 = 0.1;
};

crashCount++;
//console.log(vol2);

 push();
 translate(-300, 0, 0);
 fill(colors[1]);
 noStroke();
 let targetHeight = 70 + vol3 * 400*mult;
 boxHeights[0] = lerp(boxHeights[0], targetHeight, 0.05);
 box(50, boxHeights[0], 300);
 pop();
 

  push();
  translate(-150,0,0);
  fill(colors[2]);
  noStroke();

  targetHeight = 150 + vol2 * 600*mult;
  boxHeights[1] = lerp(boxHeights[1], targetHeight, 0.09);
  box(50, boxHeights[1], 300);

  pop();

  push();
  translate(0,0,0);
  fill(colors[3]);
  noStroke();

  targetHeight = 250 + vol3 * 700*mult;
  boxHeights[2] = lerp(boxHeights[2], targetHeight, 0.08);
  box(50, boxHeights[2], 300);
  //plane(vol*1000,vol*1000);

  pop();

  push();
  translate(150,0,0);
  fill(colors[4]);
  noStroke();
  targetHeight = 150 + vol2 * 600*mult;
  boxHeights[3] = lerp(boxHeights[3], targetHeight, 0.09);
  box(50, boxHeights[3], 300);
  //plane(vol*1000,vol*1000);

  pop();

  push();
  translate(300,0,0);
  fill(colors[5]);
  noStroke();
  targetHeight = 70 + vol3 * 400*mult;
  boxHeights[4] = lerp(boxHeights[4], targetHeight, 0.05);
  box(50, boxHeights[4], 300);
  pop();

//console.log(boxHeights);

/*

  push();
  translate(-150,0,0);
  fill(colors[2]);
  noStroke();
  box(50,150+ vol2*600, 300);
  pop();

  push();
  translate(0,0,0);
  fill(colors[3]);
  noStroke();
  box(50,250 + vol*700, 300);
  //plane(vol*1000,vol*1000);

  pop();

  push();
  translate(150,0,0);
  fill(colors[4]);
  noStroke();
  box(50,150 +vol2*600, 300);
  //plane(vol*1000,vol*1000);

  pop();

  push();
  translate(300,0,0);
  fill(colors[5]);
  noStroke();
  box(50,70+ vol3*400, 300);
  pop();*/

}


/* Rnd Function -- */
function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
/* -- Audio in Chrome -- */
function touchStarted() {
  getAudioContext().resume();
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function calculateAverage(array) {
  let sum = array.reduce((a, b) => a + b, 0);
  return sum / array.length;
}
