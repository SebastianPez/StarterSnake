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
  const myBody = request.body.you.body;
  let myHeadY = myBody[0].y;
  let myHeadX = myBody[0].x;
  // Array of food objects on the board.
  const foodArray = request.body.board.food;
  let foodY = {
    above: false,
    below: false
  };

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
    }
  };

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

  if (myBody)



  // console.log("Snake head: ", myBody[0]);
  // console.log("============");
  // console.log(data.move);
  // console.log("============");
  // console.log("Turn #: ", request.body.turn);
  console.log("============");
  console.log(myBody);
  // console.log(request.body);
  console.log("============");
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
