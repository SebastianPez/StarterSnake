const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// <Functions>
  // function checkForFood(head, foodArray) {
  //   for (let i = 0; i < foodArray.length; i ++) {
  //     if (head.x = foodArray[i].x) {
  //       if (head.y > foodArray[i].y) {
  //         foodY.above = true;
  //       } 
  //       else {
  //         foodY.below = true;
  //       }
  //     }
  //     return;
  //   }
  // };

  // function checkForBody(head, bodyArray){
  //   for (let i = 1; i < bodyArray.length; i ++) {
  //     if ((head.x + 1) === bodyArray[i].x && head.y === bodyArray[i].y) {
  //       noCollisionCheckCompass.right = true
  //     }
  //     if ((head.x - 1) === bodyArray[i].x && head.y === bodyArray[i].y) {
  //       noCollisionCheckCompass.left = true
  //     }
  //     if ((head.y + 1) === bodyArray[i].y && head.x === bodyArray[i].x) {
  //       noCollisionCheckCompass.up = true
  //     }
  //     if ((head.y - 1) === bodyArray[i].y && head.x === bodyArray[i].x) {
  //       noCollisionCheckCompass.down = true
  //     }
  //   }
  // };
// </Functions>

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#DFFF00',
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  let checkCounter = 0;
  const myBody = request.body.you.body;
  let myHeadY = myBody[0].y;
  let myHeadX = myBody[0].x;
  // Array of food objects on the board.
  const foodArray = request.body.board.food;
  let foodY = {
    above: false,
    below: false
  };

  let foodX = {
    left: false,
    right: false
  };

  let noCollisionCheckCompass = {
    up: false,
    down: false,
    left: false,
    right: false
  }

  function checkForFood() {
    for (let i = 0; i < foodArray.length; i ++) {
      if (myHeadX === foodArray[i].x) {
        if (myHeadY > foodArray[i].y) {
          foodY.above = true;
          return;
        } 
        else if (myHeadY < foodArray[i].y) {
          foodY.below = true;
          return;
        }
      }
      if (myHeadY === foodArray[i].y) {
        if (myHeadX > foodArray[i].x) {
          foodX.left = true;
          return;
        } else if (myHeadX < foodArray[i].x) {
          foodX.right = true;
          return;
        }
      }
    }
  };

  function checkForBody(){
    for (let i = 1; i < myBody.length; i ++) {
      if ((myHeadX + 1) === myBody[i].x && myHeadY === myBody[i].y) {
        noCollisionCheckCompass.right = true
        // console.log(`HeadX: ${myHeadX}, rightBodyX: ${myBody[i].x + 1}`);
      }
      if ((myHeadX - 1) === myBody[i].x && myHeadY === myBody[i].y) {
        noCollisionCheckCompass.left = true
        // console.log(`HeadX: ${myHeadX}, leftBodyX: ${myBody[i].x - 1}`);
      }
      if ((myHeadY - 1) === myBody[i].y && myHeadX === myBody[i].x) {
        noCollisionCheckCompass.up = true
        // console.log(`HeadY: ${myHeadY}, upBodyY: ${myBody[i].y + 1}`);
      }
      if ((myHeadY + 1) === myBody[i].y && myHeadX === myBody[i].x) {
        noCollisionCheckCompass.down = true
        // console.log(`HeadY: ${myHeadY}, downBodyY: ${myBody[i].y - 1}`);
      }
    }
  };

  function doubleCheck() {
    if (data.move === 'up' && noCollisionCheckCompass.up) {
      data.move = 'right';
      // console.log("Going right");
    }
    if (data.move === 'right' && noCollisionCheckCompass.right) {
      data.move = 'down';
      // console.log("Going down");
    }
    if (data.move === 'down' && noCollisionCheckCompass.down) {
      data.move = 'left';
      // console.log("Going left");
    }
    if (data.move === 'left' && noCollisionCheckCompass.left) {
      data.move = 'up';
      // console.log("Going up");
    }
    noCollisionCheckCompass.up = false;
    noCollisionCheckCompass.right = false;
    noCollisionCheckCompass.down = false;
    noCollisionCheckCompass.left = false;
    if (noCollisionCheckCompass.up && checkCounter === 0 && data.move === 'up') {
      checkCounter += 1;
      checkForBody();
      doubleCheck();
    }
  }

  let data = {
    move: 'right', // one of: ['up','down','left','right']
  }
  
  if (myHeadY === 14) {
    data.move = 'left';
  }
  if (myHeadX === 0) {
    data.move = 'up';
  }
  if (myHeadY === 0) {
    data.move = 'right';
  }
  if (myHeadX === 14) {
    data.move = 'down';
  }

  if (myHeadY === 0 && myHeadX === 0) {
    data.move = 'right';
  }
  if (myHeadY === 0 && myHeadX === 14) {
    data.move = 'down';
  }
  if (myHeadY === 14 && myHeadX === 14) {
    data.move = 'left';
  }
  if (myHeadY === 14 && myHeadX === 0) {
    data.move = 'up';
  }
  
  checkForFood();

  if (foodY.above) {
    console.log(foodY);
    console.log("============");
    data.move = 'up';
    foodY.above = false;
  }

  if (foodY.below) {
    console.log(foodY);
    console.log("============");
    data.move = 'down';
    foodY.below = false;
  }

  if (foodX.left) {
    console.log(foodX);
    console.log("============");
    data.move = 'left';
    foodX.left = false;
  }

  if (foodX.right) {
    console.log(foodX);
    console.log("============");
    data.move = 'right';
    foodX.right = false;
  }

  checkForBody();
  doubleCheck();
  checkCounter = 0;



  // console.log("Snake head: ", myBody[0]);
  // console.log("============");
  console.log(data.move);
  console.log("============");
  console.log("Turn #: ", request.body.turn);
  console.log("============");
  // console.log(myBody);
  // console.log(request.body);
  // console.log("============");
  // console.log(myBody[0], "=========", myBody[1]);
  // console.log("============");
  // console.log(foodArray);


  // Response data

  return response.json(data)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
