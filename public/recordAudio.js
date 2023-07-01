let mic, song1, song2, song3, amplitude, audioInput;
let volHistory = [], startButton;
let mictrue;
let socket = io('/sketch1'); // connect to the /sketch1 namespace

function preload() {
  song1 = loadSound('Songs/Freaks.mp3');
  song2 = loadSound('Songs/Could Have Been Me.mp3');
  song3 = loadSound('Songs/Welcome Home.mp3');
}

function setup() {
  createCanvas(400, 400);
  
  mic = new p5.AudioIn();
  mic.start(started);
  
  amplitude = new p5.Amplitude();
  
  // default audio input is the microphone
  audioInput = mic;
  
  // create buttons
  let micButton = createButton('Enable Microphone');
  let song1Button = createButton('Play Song 1');
  let song2Button = createButton('Play Song 2');
  let song3Button = createButton('Play Song 3');
  let randomButton = createButton('Generate Random Number');

  micButton.mousePressed(() => enableInput(mic));
  song1Button.mousePressed(() => enableInput(song1));
  song2Button.mousePressed(() => enableInput(song2));
  song3Button.mousePressed(() => enableInput(song3));
  randomButton.mousePressed(generateRandomNumber);
}

function started() {
  console.log('mic started');
}

function enableInput(input) {
  // if a song is playing, stop it
  if (song1.isPlaying()) {
    song1.stop();
  }
  if (song2.isPlaying()) {
    song2.stop();
  }
  if (song3.isPlaying()) {
    song3.stop();
  }
  
  if (input === mic) {
    mic.start();
    mictrue = true;
    amplitude.setInput(mic);
  } else {
    playSong(input);
    amplitude.setInput(input);
    mictrue = false;
  }
  audioInput = input;
}


function playSong(song) {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.play();
  }
}

function generateRandomNumber() {
  audioInput = null;
}

function draw() {
  background(200);

  let vol;

  // Get the volume or generate a random number
  if (audioInput) {
    vol = amplitude.getLevel();
  } else {
    vol = Math.random();
  }

  if(mictrue){
    vol = vol*1.8;
  }
  // Add the volume to the history
  volHistory.push(vol);
console.log(vol);
  stroke(0);

  // Draw the amplitude curve
  beginShape();
  for (let i = 0; i < volHistory.length; i++) {
    let y = map(volHistory[i], 0, 1, height, 0);
    vertex(i, y);
  }
  endShape();

  // Remove old values from the history
  if (volHistory.length > width) {
    volHistory.splice(0, 1);
  }

console.log(volHistory);
  // Emit the volume level
  socket.emit('volLevels', volHistory);
}
