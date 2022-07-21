const horizontal = 36;
const vertical = 18;
const square = document.getElementById("square");
const restartButton = document.getElementById("restart");

let food;
let interval;
let score = 0;
let maxScore = 0;
let snake;
let level = 1;

/**
 * Creates a html elements needed to show the game interface
 */
function createScene() {
  for (let i = 0; i < vertical; i++) {
    for (let j = 0; j < horizontal; j++) {
      const newElement = document.createElement("div");
      newElement.classList.add("item");
      newElement.id = `${i}_${j}`;
      square.appendChild(newElement);
    }
  }
}

/**
 * Remove the background color of the referenced square in the screen
 * @param {number} x
 * @param {number} y
 */
function removeColorFromSquare(x, y) {
  document.getElementById(`${y}_${x}`).classList.remove("selected");
  document.getElementById(`${y}_${x}`).classList.remove("head");
}

/**
 * Give color to the referenced square in the screen
 * @param {number} x
 * @param {number} y
 * @param {boolean} head
 */
function colorItem(x, y, head) {
  if (head) {
    document.getElementById(`${y}_${x}`).classList.add("head");
  } else {
    document.getElementById(`${y}_${x}`).classList.add("selected");
    document.getElementById(`${y}_${x}`).classList.remove("head");
  }
}

/**
 * Change de direction of the snake
 * @param {string} d "left"|"right" | "up" | "down"
 */
function changeDirection(d) {
  switch (snake.direction) {
    case "left":
      if (d !== "right") {
        snake.direction = d;
      }
      break;
    case "right":
      if (d !== "left") {
        snake.direction = d;
      }
      break;
    case "up":
      if (d !== "down") {
        snake.direction = d;
      }
      break;
    case "down":
      if (d !== "up") {
        snake.direction = d;
      }
      break;
  }
}

/**
 * Change the coordinates of the elements of the snakes body
 */
function moveBody() {
  if (snake.path.length == 1) {
    //If the snake have only the head
    removeColorFromSquare(snake.path[0].x, snake.path[0].y);
  } else {
    removeColorFromSquare(
      snake.path[snake.path.length - 1].x,
      snake.path[snake.path.length - 1].y
    );

    for (let i = snake.path.length - 1; i > 0; i--) {
      snake.path[i].x = snake.path[i - 1].x;
      snake.path[i].y = snake.path[i - 1].y;
      colorItem(snake.path[i].x, snake.path[i].y);
    }
  }
}

/**
 * Check is the referenced position is a food
 * @param {number} x
 * @param {number} y
 * @returns boolean
 */
function isFood(x, y) {
  const r = food.x === x && y === food.y;
  if (r) {
    score = score + 10;
    if (score > maxScore) {
      maxScore = score;
      document.getElementById("max-score").innerHTML = maxScore;
      if (score % 50 === 0 && 300 - level * 50 >= 100) {
        level++;
        document.getElementById("level").innerHTML = level;
        clearInterval(interval);

        interval = setInterval(() => {
          moveSnake(snake);
        }, 300 - level * 50);
      }
    }
    document.getElementById("score").innerHTML = score;

    removeFood(food);
    food = newFood();
    printFood(food);
  }
  return r;
}

/**
 * Check if the referenced position is a invalid position
 * @param {number} x
 * @param {*=number} y
 * @returns boolean
 */
function detectColision(x, y) {
  if (x >= horizontal || x < 0 || y >= vertical || y < 0) {
    return true;
  }

  for (let i = 1; i < snake.path.length; i++) {
    if (x === snake.path[i].x && y === snake.path[i].y) {
      return true;
    }
  }
  return false;
}

/**
 * Action to be performed when a colision happens
 */
function handleColision() {
  document.onkeydown = () => {};
  document.getElementById("end-modal").classList.remove("hidden");
  clearInterval(interval);
}

/**
 * Determines whats happens with the snake to moving
 * @param {objetct} snake
 */
function moveSnake(snake) {
  switch (snake.direction) {
    case "right":
      if (!detectColision(snake.path[0].x + 1, snake.path[0].y)) {
        moveBody();
        if (isFood(snake.path[0].y, snake.path[0].x + 1)) {
          snake.path.unshift({
            x: snake.path[0].x + 1,
            y: snake.path[0].y,
          });
        } else {
          snake.path[0].x++;
        }
        colorItem(snake.path[0].x, snake.path[0].y, true);
      } else {
        handleColision();
      }
      break;
    case "left":
      if (!detectColision(snake.path[0].x - 1, snake.path[0].y)) {
        moveBody();
        if (isFood(snake.path[0].y, snake.path[0].x - 1)) {
          snake.path.unshift({
            x: snake.path[0].x - 1,
            y: snake.path[0].y,
          });
        } else {
          snake.path[0].x--;
        }
        colorItem(snake.path[0].x, snake.path[0].y, true);
      } else {
        handleColision();
      }
      break;
    case "down":
      if (!detectColision(snake.path[0].x, snake.path[0].y + 1)) {
        moveBody();
        if (isFood(snake.path[0].y + 1, snake.path[0].x)) {
          snake.path.unshift({
            x: snake.path[0].x,
            y: snake.path[0].y + 1,
          });
        } else {
          snake.path[0].y++;
        }
        colorItem(snake.path[0].x, snake.path[0].y, true);
      } else {
        handleColision();
      }
      break;
    case "up":
      if (!detectColision(snake.path[0].x, snake.path[0].y - 1)) {
        moveBody();
        if (isFood(snake.path[0].y - 1, snake.path[0].x)) {
          snake.path.unshift({
            x: snake.path[0].x,
            y: snake.path[0].y - 1,
          });
        } else {
          snake.path[0].y--;
        }
        colorItem(snake.path[0].x, snake.path[0].y, true);
      } else {
        handleColision();
      }
      break;
  }

  document.onkeydown = checkKey;
}

/**
 * Get the keys action of the keyboard
 * @param {event} e
 */
function checkKey(e) {
  var event = window.event ? window.event : e;
  if (e.keyCode == "38") {
    changeDirection("up");
  } else if (e.keyCode == "40") {
    changeDirection("down");
  } else if (e.keyCode == "37") {
    changeDirection("left");
  } else if (e.keyCode == "39") {
    changeDirection("right");
  }

  document.onkeydown = () => {};
}

/**
 * Check id the foot id part of the snake
 * @param {object} f
 * @returns boolean
 */
function checkFood(f) {
  if (f.x < 0 || f.y < 0) {
    return false;
  }
  for (let item of snake.path) {
    if (f.y === item.x && f.x === item.y) {
      return false;
    }
  }
  return true;
}

/**
 * Shows the food in the screen
 * @param {object} f
 */
function printFood(f) {
  const a = document.getElementById(`${f.x}_${f.y}`);
  if (a) {
    a.classList.add("food");
  }
}

/**
 * Remove the food from the screen
 * @param {object} f
 */
function removeFood(f) {
  const a = document.getElementById(`${f.x}_${f.y}`);
  if (a) {
    a.classList.remove("food");
  }
}

/**
 * Generate a new food
 * @returns Object
 */
function newFood() {
  let f = {
    x: Math.floor(Math.random() * vertical - 1),
    y: Math.floor(Math.random() * horizontal - 1),
  };
  while (!checkFood(f)) {
    f = {
      x: Math.floor(Math.random() * vertical - 1),
      y: Math.floor(Math.random() * horizontal - 1),
    };
  }
  return f;
}

/**
 * Restart the game and all the variables needed
 */
function resetGame() {
  level = 1;
  document.getElementById("level").innerHTML = level;
  document.onkeydown = checkKey;

  for (let i = 0; i < vertical; i++) {
    for (let j = 0; j < horizontal; j++) {
      removeColorFromSquare(j, i);
      removeFood({ x: i, y: j });
    }
  }

  snake = {
    path: [
      {
        x: 10,
        y: 10,
      },
    ],
    direction: "right",
  };

  food = newFood();
  printFood(food);

  score = 0;
  document.getElementById("score").innerHTML = score;
}

restartButton.addEventListener("click", () => {
  document.getElementById("end-modal").classList.add("hidden");
  interval = setInterval(() => {
    moveSnake(snake);
  }, 300);

  resetGame();
});

createScene();

/**
 * Start the game for the first time
 */
interval = setInterval(() => {
  moveSnake(snake);
}, 300);
resetGame();
