var delay = 300;
var size = 20;

function getRandomDirection() {
  const v = Math.floor(Math.random() * 3);
  switch (v) {
    case 0:
      return "right";
    case 1:
      return "left";
    case 2:
      return "up";
    default:
      return "down";
  }
}

var direction = getRandomDirection();
var food;
var snake = [
  {
    x: size / 2,
    y: size / 2,
  },
];

var interval;
var score = 0;
var maxScore = 0;
var hardness = 1;
var scoreCounter = 1;

function checkFood(f) {
  if (f.x < 0 || f.y < 0) {
    return false;
  }
  for (let item of snake) {
    if (f.x === item.x && f.y === item.y) {
      return false;
    }
  }
  return true;
}

function newFood() {
  let f = {
    x: Math.floor(Math.random() * size - 1),
    y: Math.floor(Math.random() * size - 1),
  };
  while (!checkFood(f)) {
    f = {
      x: Math.floor(Math.random() * size - 1),
      y: Math.floor(Math.random() * size - 1),
    };
  }
  return f;
}

function tick() {
  for (let item of snake) {
    const index = item.x * size + item.y;
    //group.children[index].position.y = -0.1;

    group.children[index].material.color.setHex(0xd1d1d1);
    group.children[index].visible = false;
  }

  if (snake.length > 1) {
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }
  }

  const headAnt = {
    x: snake[0].x,
    y: snake[0].y,
  };

  switch (direction) {
    case "right":
      if (snake[0].x + 1 >= size) {
        snake[0].x = 0;
      } else {
        snake[0].x += 1;
      }
      break;
    case "left":
      if (snake[0].x - 1 < 0) {
        snake[0].x = size - 1;
      } else {
        snake[0].x -= 1;
      }
      break;
    case "up":
      if (snake[0].y + 1 >= size) {
        snake[0].y = 0;
      } else {
        snake[0].y += 1;
      }
      break;
    default:
      if (snake[0].y - 1 < 0) {
        snake[0].y = size - 1;
      } else {
        snake[0].y -= 1;
      }
  }

  if (snake[0].x == food.x && snake[0].y == food.y) {
    snake.push({ x: headAnt.x, y: headAnt.y });
    group.children[food.x * size + food.y].material.color.setHex(0xd1d1d1);
    group.children[food.x * size + food.y].visible = false;
    food = newFood();

    if (score > maxScore) {
      maxScore = score;
    }

    if (scoreCounter == 5) {
      scoreCounter = 1;
      hardness += 1;
      clearInterval(interval);
      interval = setInterval(() => {
        tick();
      }, delay - hardness * 20);
    }

    score += 10 * hardness;
    scoreCounter++;

    console.log(score);
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      snake = [
        {
          x: size / 2,
          y: size / 2,
        },
      ];
      score = 0;
      scoreCounter = 1;
      hardness = 1;
      clearInterval(interval);
      alert("Fim de Jogo");

      interval = setInterval(() => {
        tick();
      }, delay - hardness * 20);
    }
  }

  let c = 0;
  for (let item of snake) {
    const index = item.x * size + item.y;
    //group.children[index].material.color.setHex(`0x${c.toString(16)}8405`)
    group.children[index].material.color.setHex(0x380555);
    group.children[index].visible = true;
    //group.children[index].position.y = 0.1;
    c += 5;
  }

  //group.children[(food.x * size) + food.y].position.y = 0.1;
  group.children[food.x * size + food.y].visible = true;
  group.children[food.x * size + food.y].material.color.setHex(0x947bc4);
}

var group1 = new THREE.Group();
var group = new THREE.Group();
this.add(group);
this.add(group1);

function checkKey(e) {
  var event = window.event ? window.event : e;

  if (e.keyCode == "38" && direction != "down") {
    direction = "up";
  } else if (e.keyCode == "40" && direction != "up") {
    direction = "down";
  } else if (e.keyCode == "37" && direction != "right") {
    direction = "left";
  } else if (e.keyCode == "39" && direction != "left") {
    direction = "right";
  }

  document.onkeydown = () => {};
  setTimeout(() => {
    document.onkeydown = checkKey;
  }, delay);
}

var box = this.getObjectByName("ball");
var box1 = this.getObjectByName("box");

for (var j = 0; j < size; j++) {
  for (var i = 0; i < size; i++) {
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var object = box.clone();
    object.position.x = i * 0.11;
    object.position.z = j * 0.11;
    object.position.y = 0.1;
    object.material = material;
    object.visible = false;
    group.add(object);

    const v = j % 2 == 0;
    const v2 = v ? i % 2 == 0 : i % 2 != 0;

    var material1 = new THREE.MeshPhongMaterial({
      color: v2 ? 0xe2a7ff : 0xca83f2,
    });
    var object1 = box1.clone();
    object1.position.x = i * 0.11;
    object1.position.z = j * 0.11;
    object1.position.y = 0.031;
    object1.material = material1;
    group1.add(object1);
  }
}

//group.children[1].position.y -=0.1;
box.material.opacity = 0;
box.position.y = -0.23;

console.log(group.children[30]);

document.onkeydown = checkKey;

food = newFood();

interval = setInterval(() => {
  tick();
}, delay);

function update(event) {}
