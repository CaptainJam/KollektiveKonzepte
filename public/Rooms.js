let socket = io('/sketch5');
let myRoom = 0;
let peopleInRoom = [0, 0, 0, 0, 0, 0, 0];
const maxPeopleInRoom = 20;
let roomNames = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6', 'Room 7', 'Room 8'];
let roomPos = [[22, 50], [110, 50], [202, 50], [292, 50], [22, 198], [22, 276], [110, 240], [650, 150]]; // Customize your room positions
let roomSize = [[88, 70], [92, 70], [90, 70], [95, 70], [65, 77], [65, 75], [80, 45], [70, 70]]; // Customize your room sizes
let movementQueue = [];

let moveSmallButton;
let moveLargeButton;


socket.on('initialState', function (data) {
  peopleInRoom = data;
  socket.emit('join');
});

socket.on('state', function (data) {
  peopleInRoom = data;
});

socket.on('full', function () {
  alert('Sorry, the sketch is currently full. Please try again later.');
});


function preload() {
    // song = loadSound('Rosie.mp3');
     //song = loadSound("Freaks.mp3");
     font1 = loadFont('Fonts/EastmanAlternate-Heavy.otf');
   }

   
   function setup() {
    createCanvas(400, 400);
    imageMode(CENTER);
    graphics = createGraphics(400, 400);
    frameRate(30); // Changed frameRate to 30
    textFont(font1);
/*
    // Create buttons
    moveSmallButton = createButton('Move 1-5 People');
    moveSmallButton.position(50, 450);
    moveSmallButton.mousePressed(moveSmallGroup);
  
    moveLargeButton = createButton('Move 15-35 People');
    moveLargeButton.position(200, 450);
    moveLargeButton.mousePressed(moveLargeGroup);*/
  }
  

function draw() {
  background(200);
 // image(img, width / 2, height / 2);

  // Draw the rooms
  for (let i = 0; i < peopleInRoom.length; i++) {
    let x = roomPos[i][0]; 
    let y = roomPos[i][1];
    let w = roomSize[i][0];
    let h = roomSize[i][1];
    let c = map(peopleInRoom[i], 0, maxPeopleInRoom, 30, 255);
    fill(75, 45, c);
    rect(x, y, w, h);
  }

  
  // Draw the labels
  for (let i = 0; i < peopleInRoom.length; i++) {
    let x = roomPos[i][0] + roomSize[i][0] / 2;
    let y = roomPos[i][1] + roomSize[i][1] / 2;
    textSize(16);
    textAlign(CENTER, CENTER);
    fill(0);
    text(nf(peopleInRoom[i]), x, y);
  }
fill(0,0,0,0)
  rect(110, 145, 80, 95);
  rect(190, 145, 0, 205);
  rect(110, 305, 80, 45);
  rect(230, 145, 155, 100);

  rect(22, 120, 65, 77);

  /*
  // Process movements
  let movementsToProcess = min(movementQueue.length, 1); // Process up to 5 movements per frame
  for (let i = 0; i < movementsToProcess; i++) {
    let movement = movementQueue.shift(); // Get the next movement
    
    // Make sure there are still people in the room
    if (peopleInRoom[movement.fromRoom] > 0) {
      // Make sure the destination room has space
      if (peopleInRoom[movement.toRoom] < maxPeopleInRoom) {
        // Move a person
        peopleInRoom[movement.fromRoom]--;
        peopleInRoom[movement.toRoom]++;
      }
    }
  }*/
}

function movePeople(totalPeopleToMove) {
  for (let i = 0; i < totalPeopleToMove; i++) {
    let fromRoom;
    let toRoom;

    do {
      fromRoom = floor(random(peopleInRoom.length));
    } while (peopleInRoom[fromRoom] <= 0); // Ensure room has people

    do {
      toRoom = floor(random(peopleInRoom.length));
    } while (toRoom == fromRoom); // Ensure different room

    movementQueue.push({ fromRoom: fromRoom, toRoom: toRoom });
  }
}

function moveSmallGroup() {
  let totalPeopleToMove = floor(random(1, 6)); // 1 to 5 people
  movePeople(totalPeopleToMove);
}

function moveLargeGroup() {
  let totalPeopleToMove = floor(random(15, 36)); // 15 to 35 people
  movePeople(totalPeopleToMove);
}

function mousePressed() {
  // Determine the room that was clicked on
  let roomClicked = -1;
  for (let i = 0; i < roomPos.length; i++) {
      let x = roomPos[i][0];
      let y = roomPos[i][1];
      let w = roomSize[i][0];
      let h = roomSize[i][1];

      if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
          roomClicked = i;
          console.log(i);
          break;
      }
  }

  // If a room was clicked on
  if (roomClicked != -1) {
    let fromRoom = myRoom;
    
    // If this is the first movement of this client, they should be considered as moving from Room 0
    if (myRoom == -1) {
      fromRoom = 0;
    }

    socket.emit('move', { from: fromRoom, to: roomClicked });
    myRoom = roomClicked;
  }
}
