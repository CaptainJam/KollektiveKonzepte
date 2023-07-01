// Connect to the namespace
let socket = io('/sketch4');

// Get the position of the ellipse from the server


socket.on('gameover', function () {
    // Display "It's over" and stop the game
});

socket.on('reset', function () {
    // Reset the game
});




let ballPosition;
let gameover = false;


function setup() {
    createCanvas(800, 400);
    ballPosition = width/2;
    // Create the buttons
    let btnLeft = createButton('Move left');
    let btnRight = createButton('Move right');

    // When the buttons are clicked, send a 'move' event to the server
    btnLeft.mousePressed(() => socket.emit('move', -1));
    btnRight.mousePressed(() => socket.emit('move', 1));

    socket.on('position', function (data) {
        // Update the position of the ellipse in your p5.js draw function
        ballPosition = data;
    });
    


    // When the server sends a 'move' event, update the ball position
    socket.on('move', (data) => {
        ballPosition += data;
        checkGameover();
    });

    // When the server sends a 'reset' event, reset the game
    socket.on('reset', resetGame);
}

function draw() {
    background(200);

    // Draw the goals
    rect(0, height/2 - 50, 10, 100);
    rect(width-10, height/2 - 50, 10, 100);

    // Draw the ball
    ellipse(ballPosition, height/2, 50);

    if (gameover) {
        textSize(32);
        text("It's over", width/2, height/2);
    }
}

function checkGameover() {
    if (ballPosition < 20 || ballPosition > width - 20) {
        gameover = true;
        socket.emit('reset');
    }
}

function resetGame() {
    ballPosition = width/2;
    gameover = false;
}
/*
// When the buttons are clicked, send a 'move' event to the server
document.getElementById('leftButton').addEventListener('click', function () {
    socket.emit('move', -1);
});
document.getElementById('rightButton').addEventListener('click', function () {
    socket.emit('move', 1);
});*/

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        console.log('hey')
      //send 'left' to server
      socket.emit('move', -10);
    } else if (keyCode === RIGHT_ARROW) {
      //send 'right' to server
      socket.emit('move', 10);
    }
  }
  