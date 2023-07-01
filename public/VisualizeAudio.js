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


function setup() {
  createCanvas(windowWidth,windowHeight);

  background(0);

  amp = new p5.Amplitude();
  r = 0;
  g = 0;

  colord =0;
  colorcount= 255;

}


function draw(){

  let vol = volHistory2.slice(-1);
console.log(vol);
volHistory.push(vol);

noFill();
 beginShape();
 for (let x = 0; x < volHistory.length; x++) {
   fill(255,r,g)
   noStroke()
   //stroke(g,255,r);
   let y = map(volHistory[x], 0, 1, height, 0);
   vertex(x, y);
 }
 endShape();

 if(volHistory.length > width) {
   volHistory = [];
   background(0);
 }

/* -- Background Reset --
if (vol==0) {
  backgroundReset+=1;

}else {
  backgroundReset=0;
}
if (backgroundReset>=10) {
  background(0);
}*/

/* -- Kamera Controlle */
/*  cX = 0;
cY = 0;
cZ += vol*1000;

camera(cX, cY, cZ,
cX, 0, 0, 0, 1, 0);//*/


/* -- Color Change --*/

if (colorcount >= 255){
  colorcount=255;
  colord =0;
  r = colorcount;
  g =0;
}

if (colorcount<=-255){
  colorcount = -255;
  colord =1;
  r=0;
  g=colorcount*-1;
}

if(colord ==1){
  colorcount += 5;
}
if(colord ==0){
  colorcount -=5;
}

if (colorcount==0){
  r=0;
  g=0;
}
if (colorcount>0){
  r=colorcount;
  g=0;
}
if (colorcount<0){
  g = colorcount*-1;
  r=0;
} //*/

//background(0);



//push();

//  console.log("r: "+r);
//  console.log("g: "+g);
//  console.log("cd "+colorcount);
//vol = 0.5;
//rotateZ(frameCount*0.05);
//rotateX(frameCount*0.05);


/* -- Sketch 1 Formen-- */
/*
push();
translate(0,0,0);
rotateZ(frameCount*0.05);
rotateX(frameCount*0.05);
rotateY(frameCount*0.05);
fill(255,r,g);
noStroke();
box(vol*1000,vol*1000,vol*1000);
//plane(vol*1000,vol*1000);

pop();
//console.log(vol);
push();
rotateX(frameCount*0.03);
push();
translate(-windowWidth/2,0,-500);

rotateX(frameCount*0.03);
rotateY(frameCount*0.03);
fill(g,255,r);
noStroke();
box(vol*500,vol*500,vol*500);

pop();

push();
translate(windowWidth/2,0,-500);

rotateX(frameCount*0.03);
rotateY(frameCount*0.03);
noStroke();
fill(g,255,r);

box(vol*500,vol*500,vol*500);

pop();
pop();
if (highAmpCount>-1) {
push();
  rotateY(frameCount*0.03);
  push();
  translate(0,windowHeight/2,-500);

  rotateX(frameCount*0.03);
  rotateY(frameCount*0.03);
  noStroke();
  fill(g,255,r);

  box(vol*500,vol*500,vol*500);

  pop();
//  rotateY(frameCount*0.03);
  push();
  translate(0,-windowHeight/2,-500);

  rotateX(frameCount*0.03);
  rotateY(frameCount*0.03);
  noStroke();
  fill(g,255,r);

  box(vol*500,vol*500,vol*500);
  pop();
pop();

} */
//fill("white");
//box(100,100,100);
//pop();
//console.log(vol);

/* -- Amp + Reset Count -- */
/*
if (vol>0.50 && resetcount>0) {
  background(r,g,255);
  resetcount=0;
}
if (vol>0.5) {
  highAmpCount++;
}
console.log(highAmpCount);
resetcount++;*/
}


/* Rnd Function -- */
function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
/* -- Audio in Chrome -- */
function touchStarted() {
  getAudioContext().resume();
}
