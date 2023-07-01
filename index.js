// Import the necessary modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Create an express app
const app = express();

app.use(express.static('public'));


// Create a http server with the express app
const server = http.createServer(app);

// Create a socket.io instance linked to the server
const io = socketIO(server);

// Create namespaces
const sketch1 = io.of('/sketch1');
const sketch2 = io.of('/sketch2');
const sketch3 = io.of('/sketch3');
// Add as many namespaces as you need for your sketches...

// Handling connections for each namespace
sketch1.on('connection', socket => {
  console.log('User connected to Sketch 1');

  socket.on('volLevels', data => {
    socket.broadcast.emit('volLevels', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from Sketch 1');
  });

});

let countdown = 60;
let interval = null;

// Start the countdown when the server starts
setInterval(() => {
  countdown--;
  if (countdown <= 0) {
    countdown = 60;
    // Reset canvas on all clients
    io.of('/sketch2').emit('resetCanvas');
  }

  // Send countdown value to all clients
  io.of('/sketch2').emit('timer', countdown);
}, 1000);

io.of('/sketch2').on('connection', function(socket) {
  console.log('User connected to Sketch 1');
  // Emit the current countdown value whenever a new client connects
  socket.emit('timer', countdown);

  socket.on('drawData', function(data) {
    socket.broadcast.emit('drawData', data);
  });
});


let letterDataList = [];

io.of('/sketch3').on('connection', function(socket) {
  
  // Emit the stored data when a new client connects
  socket.emit('initialData', letterDataList);
  
  socket.on('letterData', function(data) {
    // Add the received letter data to the list
    letterDataList.push(data);
    
    // Broadcast the letter data to all other clients
    socket.broadcast.emit('letterData', data);
  });
});

let ellipsePos = 0; // Initial position
let gameRunning = true;

// Create sketch4 namespace
let sketch4 = io.of('/sketch4');
sketch4.on('connection', function (socket) {
    console.log(`Made socket connection: ${socket.id}`);
    sketch4.emit('position', ellipsePos);

    socket.on('move', function (data) {
      if (!gameRunning) return;
      // Move the ellipse based on data (data should be -1 or 1)
      ellipsePos += data;
      // Check if ellipse hits one of the rectangles
      // Assuming the canvas width is 800 pixels and the rectangles are at positions 0 and 800
      if (ellipsePos <= 0 || ellipsePos >= 800) { // Adjust these values based on the actual sizes
          gameRunning = false;
          sketch4.emit('gameover');
          setTimeout(() => {
              gameRunning = true;
              ellipsePos = 400; // reset the ball position to the middle of the canvas
              sketch4.emit('reset');
          }, 3000);
      } else {
          // Send the updated position to all clients
          sketch4.emit('position', ellipsePos);
      }
  });
  
});


let peopleInRoom = Array(8).fill(0);
let totalPeopleInSketch = 0;
let maxPeopleInSketch = 100;

let sketch5 = io.of('/sketch5');
sketch5.on('connection', function(socket){
  // When a client connects, send them the initial state
  socket.emit('initialState', peopleInRoom);
  
  // When a client requests to join, update the state and send it to all clients
  socket.on('join', function(){
    peopleInRoom[0]++; // Assume client always joins room 0
    sketch5.emit('state', peopleInRoom); // Send the updated state to all clients
  });
  
  // When a client requests to move, update the state and send it to all clients
  socket.on('move', function(data){
    if (data.from != -1) {
      peopleInRoom[data.from]--;
    }
    peopleInRoom[data.to]++;
    sketch5.emit('state', peopleInRoom); // Send the updated state to all clients
  });
});



let sliderValues = {
  mySlider1: 0,
  mySlider2: 0,
};

io.of('/sketch5').on('connection', (socket) => {
  // When a new client connects, emit the current slider values
  socket.emit('initialState', sliderValues);

  socket.on('sliderChange', (data) => {
    // Update the current slider value
    sliderValues[data.id] = data.value;

    // Broadcast the slider value change to other clients
    socket.broadcast.emit('sliderChange', data);
  });
});



  

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
