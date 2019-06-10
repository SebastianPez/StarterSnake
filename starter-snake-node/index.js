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

  // function checkForWalls() {
  //   if (myHeadY === 14) {
  //     noCollisionCheckCompass.down = true;
  //     if (myHeadX === 14) {
  //       noCollisionCheckCompass.right = true;
  //     }
  //     if (myHeadX === 0) {
  //       noCollisionCheckCompass.left = true;
  //     }
  //   }
  //   if (myHeadX === 0) {
  //     noCollisionCheckCompass.left = true;
  //     if (myHeadY === 14) {
  //       noCollisionCheckCompass.down = true;
  //     }
  //     if (myHeadY === 0) {
  //       noCollisionCheckCompass.up = true;
  //     }
  //   }
  //   if (myHeadY === 0) {
  //     noCollisionCheckCompass.up = true;
  //     if (myHeadX === 14) {
  //       noCollisionCheckCompass.right = true;
  //     }
  //     if (myHeadX === 0) {
  //       noCollisionCheckCompass.left = true;
  //     }
  //   }
  //   if (myHeadX === 14) {
  //     noCollisionCheckCompass.right = true;
  //     if (myHeadY === 14) {
  //       noCollisionCheckCompass.down = true;
  //     }
  //     if (myHeadY === 0) {
  //       noCollisionCheckCompass.up = true;
  //     }
  //   }
  
    // if (myHeadY === 0 && myHeadX === 0) {
    //   data.move = 'right';
    // }
    // if (myHeadY === 0 && myHeadX === 14) {
    //   data.move = 'down';
    // }
    // if (myHeadY === 14 && myHeadX === 14) {
    //   data.move = 'left';
    // }
    // if (myHeadY === 14 && myHeadX === 0) {
    //   data.move = 'up';
    // }
  // }
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
  let myId = request.body.you.id;
  let myHeadY = myBody[0].y;
  let myHeadX = myBody[0].x;
  let blocked = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  // Array of food objects on the board.
  const foodArray = request.body.board.food;
  // let foodY = {
  //   coords: {
  //     x: 0,
  //     y: 0
  //   },
  //   above: false,
  //   below: false
  // };

  // let foodX = {
  //   coords: {
  //     x: 0,
  //     y: 0
  //   },
  //   left: false,
  //   right: false
  // };

  let closestFood = {
    x: 0,
    y: 0,
    coords: {
      up: false,
      down: false,
      left: false,
      right: false
    }
  };

  let bodyBetweenFoodCompass = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  let snakeArray = request.body.board.snakes;
  let enemySnakesArray = [];

  function foodDirection() {
    if (closestFood.x < myHeadX) {
      closestFood.coords.left = true;
    }
    if (closestFood.x > myHeadX) {
      closestFood.coords.right = true;
    }
    if (closestFood.y < myHeadY) {
      closestFood.coords.up = true;
    }
    if (closestFood.y > myHeadY) {
      closestFood.coords.down = true;
    }
  };

  function checkForFood() {
    let tempFood = {
      x: 16,
      y: 16
    };
    for (let i = 0; i < foodArray.length; i ++) {
      // if (Math.abs((myHeadX - foodArray[i].x) < Math.abs(myHeadX - tempFood.x))) {
      //   tempFood.x = foodArray[i].x;
      //   tempFood.y = foodArray[i].y;
      // }
      let absX = Math.abs(myHeadX - foodArray[i].x);
      let absY = Math.abs(myHeadY - foodArray[i].y);
      let distanceFromHead = absX + absY;

      let tempX = Math.abs(myHeadX - tempFood.x);
      let tempY = Math.abs(myHeadY - tempFood.y);
      let currentClosestDistance = tempX + tempY;
      if (distanceFromHead < currentClosestDistance) {
        tempFood.x = foodArray[i].x;
        tempFood.y = foodArray[i].y;
      }
    };
    closestFood.x = tempFood.x;
    closestFood.y = tempFood.y;
    foodDirection();
  };


  // function checkForFood() {
  //   for (let i = 0; i < foodArray.length; i ++) {
  //     if (myHeadX === foodArray[i].x) {
  //       if (myHeadY > foodArray[i].y) {
  //         foodY.above = true;
  //         foodY.coords = {
  //           x: foodArray[i].x,
  //           y: foodArray[i].y
  //         };
  //         // return;
  //       } 
  //       else if (myHeadY < foodArray[i].y) {
  //         foodY.below = true;
  //         foodY.coords = {
  //           x: foodArray[i].x,
  //           y: foodArray[i].y
  //         };
  //         // return;
  //       }
  //     }
  //     if (myHeadY === foodArray[i].y) {
  //       if (myHeadX > foodArray[i].x) {
  //         foodX.left = true;
  //         foodX.coords = {
  //           x: foodArray[i].x,
  //           y: foodArray[i].y
  //         };
  //         // return;
  //       } else if (myHeadX < foodArray[i].x) {
  //         foodX.right = true;
  //         foodX.coords = {
  //           x: foodArray[i].x,
  //           y: foodArray[i].y
  //         };
  //         // return;
  //       }
  //     }
  //   }
  // };

  function checkForWalls() {
    if (myHeadY === 14) {
      blocked.down = true;
      if (myHeadX === 14) {
        blocked.right = true;
      }
      if (myHeadX === 0) {
        blocked.left = true;
      }
    }
    if (myHeadX === 0) {
      blocked.left = true;
      if (myHeadY === 14) {
        blocked.down = true;
      }
      if (myHeadY === 0) {
        blocked.up = true;
      }
    }
    if (myHeadY === 0) {
      blocked.up = true;
      if (myHeadX === 14) {
        blocked.right = true;
      }
      if (myHeadX === 0) {
        blocked.left = true;
      }
    }
    if (myHeadX === 14) {
      blocked.right = true;
      if (myHeadY === 14) {
        blocked.down = true;
      }
      if (myHeadY === 0) {
        blocked.up = true;
      }
    }
  }

  function checkForBody(){
    for (let i = 1; i < myBody.length; i ++) {
      if ((myHeadX + 1) === myBody[i].x && myHeadY === myBody[i].y) {
        blocked.right = true
        // console.log(`HeadX: ${myHeadX}, rightBodyX: ${myBody[i].x + 1}`);
      }
      if ((myHeadX - 1) === myBody[i].x && myHeadY === myBody[i].y) {
        blocked.left = true
        // console.log(`HeadX: ${myHeadX}, leftBodyX: ${myBody[i].x - 1}`);
      }
      if ((myHeadY - 1) === myBody[i].y && myHeadX === myBody[i].x) {
        blocked.up = true
        // console.log(`HeadY: ${myHeadY}, upBodyY: ${myBody[i].y + 1}`);
      }
      if ((myHeadY + 1) === myBody[i].y && myHeadX === myBody[i].x) {
        blocked.down = true
        // console.log(`HeadY: ${myHeadY}, downBodyY: ${myBody[i].y - 1}`);
      }
    }
    checkForWalls();
    checkForEnemies();
  };

  function doubleCheck() {
    if (data.move === 'up' && blocked.up) {
      data.move = 'right';
      console.log("Doublecheck: right");
    }
    if (data.move === 'right' && blocked.right) {
      data.move = 'down';
      console.log("Doublecheck: down");
    }
    if (data.move === 'down' && blocked.down) {
      data.move = 'left';
      console.log("Doublecheck: left");
    }
    if (data.move === 'left' && blocked.left) {
      data.move = 'up';
      console.log("Doublecheck: up");
    }
    if (blocked.up && checkCounter === 0 && data.move === 'up') {
      checkCounter += 1;
      checkForBody();
      doubleCheck();
    }
  }



  function bodyBetweenFood() {
    for (let i = 1; i < myBody.length; i ++) {
      let headDistanceFood = {
        fdX: {
          x: Math.abs(myHeadX - closestFood.coords.x),
          y: Math.abs(myHeadY - closestFood.coords.y)
        },
        fdY: {
          x: Math.abs(myHeadX - closestFood.coords.x),
          y: Math.abs(myHeadY - closestFood.coords.y)
        }
      };
      let headDistanceBody = {
        fdX: {
          x: Math.abs(myBody[i].x - closestFood.coords.x),
          y: Math.abs(myBody[i].y - closestFood.coords.y)
        },
        fdY: {
          x: Math.abs(myBody[i].x - closestFood.coords.x),
          y: Math.abs(myBody[i].y - closestFood.coords.y)
        }
      };
      if (myHeadX === myBody[i].x && headDistanceFood.fdY.y > headDistanceBody.fdY.y) {
        if (myBody[i].y > myHeadY) {
          bodyBetweenFoodCompass.down = true;
          // console.log("Blocked Down");
        }
        if (myBody[i].y < myHeadY) { 
          bodyBetweenFoodCompass.up = true;
          // console.log("Blocked Up");
        }
      }
      if (myHeadY === myBody[i].y && headDistanceFood.fdX.x > headDistanceBody.fdX.x) {
        if (myBody[i].x > myHeadX) {
          bodyBetweenFoodCompass.right = true;
          // console.log("Blocked Right");
        }
        if (myBody[i].x < myHeadX){
          bodyBetweenFoodCompass.left = true;
          // console.log("Blocked left")
        }
      }
    }
  }

  function checkForEnemies() {
    for (let i = 0; i < snakeArray.length; i ++) {
      if (myId !== snakeArray[i].id) {
        enemySnakesArray.push(snakeArray[i]);
      }
    }
    for (let i = 0; i < enemySnakesArray.length; i ++) {
      for (let k = 0; k < enemySnakesArray[i].body.length; k ++) {
        let enemySnake = enemySnakesArray[i].body;
        if ((myHeadX + 1) === enemySnake[k].x && myHeadY === enemySnake[k].y) {
          console.log("ENEMIES1");
          blocked.right = true
          // console.log(`HeadX: ${myHeadX}, rightBodyX: ${myBody[i].x + 1}`);
        }
        if ((myHeadX - 1) === enemySnake[k].x && myHeadY === enemySnake[k].y) {
          console.log("ENEMIES2");
          blocked.left = true
          // console.log(`HeadX: ${myHeadX}, leftBodyX: ${enemySnake[k].x - 1}`);
        }
        if ((myHeadY - 1) === enemySnake[k].y && myHeadX === enemySnake[k].x) {
          console.log("ENEMIES3");
          blocked.up = true
          // console.log(`HeadY: ${myHeadY}, upBodyY: ${enemySnake[k].y + 1}`);
        }
        if ((myHeadY + 1) === enemySnake[k].y && myHeadX === enemySnake[k].x) {
          console.log("ENEMIES4");
          blocked.down = true
          // console.log(`HeadY: ${myHeadY}, downBodyY: ${enemySnake.y - 1}`);
        }
      }
    }
  };

  let data = {
    move: 'right', // one of: ['up','down','left','right']
  }
  
  checkForFood();
  bodyBetweenFood();


  if (closestFood.coords.up && !blocked.up && !bodyBetweenFoodCompass.up) {
    console.log(closestFood);
    console.log("Food up");
    console.log("============");
    data.move = 'up';
    closestFood.coords.up = false;
  }

  if (closestFood.coords.down && !blocked.down && !bodyBetweenFoodCompass.down) {
    console.log(closestFood);
    console.log("Food down");
    console.log("============");
    data.move = 'down';
    closestFood.coords.down = false;
  }

  if (closestFood.coords.left && !blocked.left && !bodyBetweenFoodCompass.left) {
    console.log(closestFood);
    console.log("Food left");
    console.log("============");
    data.move = 'left';
    closestFood.coords.left = false;
  }

  if (closestFood.coords.right && !blocked.right && !bodyBetweenFoodCompass.right) {
    console.log(closestFood);
    console.log("Food right");
    console.log("============");
    data.move = 'right';
    closestFood.coords.right = false;
  }
  // if (foodY.above && !blocked.up && !bodyBetweenFoodCompass.up) {
  //   console.log(foodY);
  //   console.log("============");
  //   data.move = 'up';
  //   foodY.above = false;
  // }

  // if (foodY.below && !blocked.down && !bodyBetweenFoodCompass.down) {
  //   console.log(foodY);
  //   console.log("============");
  //   data.move = 'down';
  //   foodY.below = false;
  // }

  // if (foodX.left && !blocked.left && !bodyBetweenFoodCompass.left) {
  //   console.log(foodX);
  //   console.log("============");
  //   data.move = 'left';
  //   foodX.left = false;
  // }

  // if (foodX.right && !blocked.right && !bodyBetweenFoodCompass.right) {
  //   console.log(foodX);
  //   console.log("============");
  //   data.move = 'right';
  //   foodX.right = false;
  // }

  checkForBody();
  doubleCheck();
  checkCounter = 0;
  console.log("=============+++=============");
  console.log(blocked);
  console.log("============");
  console.log(bodyBetweenFoodCompass);
  blocked = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  bodyBetweenFoodCompass = {
    up: false,
    down: false,
    left: false,
    right: false
  }



  // console.log("Snake head: ", myBody[0]);
  console.log("============");
  console.log("Turn #: ", request.body.turn);
  console.log("============");
  console.log(data.move);
  console.log("============");
  // console.log(request.body.board.snakes);
  // console.log(request.body.you);
  console.log("=============+=============");
  // console.log(myBody);
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
