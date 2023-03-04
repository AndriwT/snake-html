// HW
// Expected 2 days

// Update the score when eating a fruit
// Game Over Screen with restart button
// When Pressing the SpaceBar it pauses the game and shows Paused on screen

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

let SPEED = 20;

let score = 0;

const possiblePositions = new Array(SPEED)
  .fill(0)
  .map((space, idx) => SPEED * idx);

class Fruit {
  x = possiblePositions[getRandomInt(0, possiblePositions.length - 1)];
  y = possiblePositions[getRandomInt(0, possiblePositions.length - 1)];
  height = 20;
  width = 20;
}

class Snake {
  x = 0;
  y = 0;
  height = 20;
  width = 20;
}

class SnakeBodyPiece {
  x = 0;
  y = 0;
  height = 20;
  width = 20;
}

let xDirection = 1;
let yDirection = 0;

const snake = new Snake();
const fruit = new Fruit();

const snakeBodyPieces = [];

function createFruitElement() {
  const el = document.createElement("div");
  el.style.height = fruit.height + "px";
  el.style.width = fruit.width + "px";
  el.style.backgroundColor = "red";
  el.style.position = "absolute";
  el.style.left = fruit.x + "px";
  el.style.top = fruit.y + "px";
  el.style.border = "0px solid white";
  // el.style.borderRadius = "50%";
  return el;
}

function createSnakeElement() {
  const el = document.createElement("div");
  el.style.height = snake.height + "px";
  el.style.width = snake.width + "px";
  el.style.backgroundColor = "green";
  el.style.position = "absolute";
  el.style.left = snake.x + "px";
  el.style.top = snake.y + "px";
  el.style.border = "0px solid white";
  el.style.borderRadius = "50%";
  return el;
}

function clearContainer(gameContainer) {
  let children = gameContainer.children;

  for (let child of children) {
    child.remove();
  }
}

// function didSnakeEatFruit() {
//   if (snake.x === fruit.x && snake.y === fruit.y) {
//     return true;
//   }

//   return false;
// }

function checkHitDetectionForWalls(gameContainer) {
  if (snake.x + snake.width > gameContainer.clientWidth) {
    snake.x = 0;
  }

  if (snake.x < 0) {
    snake.x = gameContainer.clientWidth - snake.width;
  }

  if (snake.y + snake.height > gameContainer.clientHeight) {
    snake.y = 0;
  }

  if (snake.y < 0) {
    snake.y = gameContainer.clientHeight - snake.height;
  }
}

function checkIfAteFruit() {
  if (snake.x === fruit.x && snake.y === fruit.y) {
    return true;
  }
  return false;
}

function createBodyPiece(bodyPieces, gameContainer) {
  const snakeBodyPiece = new SnakeBodyPiece();

  if (!bodyPieces.length) {
    snakeBodyPiece.x = snake.x + snakeBodyPiece.width * (xDirection * -1);
    snakeBodyPiece.y = snake.y + snakeBodyPiece.height * (yDirection * -1);
  } else {
    let lastBodyPiece = bodyPieces[bodyPieces.length - 1];
    snakeBodyPiece.x =
      lastBodyPiece.x + snakeBodyPiece.width * (xDirection * -1);
    snakeBodyPiece.y =
      lastBodyPiece.y + snakeBodyPiece.height * (yDirection * -1);
  }

  const el = document.createElement("div");

  el.style.height = snakeBodyPiece.height + "px";
  el.style.width = snakeBodyPiece.width + "px";
  el.style.backgroundColor = "green";
  el.style.position = "absolute";
  el.style.left = snakeBodyPiece.x + "px";
  el.style.top = snakeBodyPiece.y + "px";
  el.style.border = "0px solid white";
  el.style.borderRadius = "30%";

  gameContainer.appendChild(el);
  snakeBodyPieces.push(snakeBodyPiece);
  bodyPieces.push(el);
}

function checkIfHitItself() {
  for (let piece of snakeBodyPieces) {
    if (piece.x === snake.x && piece.y === snake.y) {
      return true;
    }
  }

  return false;
}

function updateScore() {
  score++;
  const scoreEl = document.querySelector("#score");

  scoreEl.innerText = score;
}

async function main() {
  const gameContainer = document.querySelector("#game");

  const snakeEl = createSnakeElement();
  gameContainer.appendChild(snakeEl);

  const fruitEl = createFruitElement();
  gameContainer.appendChild(fruitEl);

  const bodyPiecesEl = [];

  while (true) {
    checkHitDetectionForWalls(gameContainer);
    const hitSelf = checkIfHitItself();
    if (hitSelf) {
      alert("YOU LOST");
      break;
    }
    const ateFruit = checkIfAteFruit();

    if (ateFruit) {
      fruit.x =
        possiblePositions[getRandomInt(0, possiblePositions.length - 1)];
      fruit.y =
        possiblePositions[getRandomInt(0, possiblePositions.length - 1)];
      fruitEl.style.left = fruit.x + "px";
      fruitEl.style.top = fruit.y + "px";

      updateScore();
      createBodyPiece(bodyPiecesEl, gameContainer);
    }

    for (let i = snakeBodyPieces.length - 1; i >= 0; i--) {
      let piece = snakeBodyPieces[i];
      if (i === 0) {
        piece.x = snake.x;
        piece.y = snake.y;
      } else {
        piece.x = snakeBodyPieces[i - 1].x;
        piece.y = snakeBodyPieces[i - 1].y;
      }

      bodyPiecesEl[i].style.left = piece.x + "px";
      bodyPiecesEl[i].style.top = piece.y + "px";
    }

    snake.x += SPEED * xDirection;
    snake.y += SPEED * yDirection;

    snakeEl.style.left = snake.x + "px";
    snakeEl.style.top = snake.y + "px";

    await sleep(50);
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
      xDirection = 1;
      yDirection = 0;
      break;
    case "ArrowLeft":
      xDirection = -1;
      yDirection = 0;
      break;
    case "ArrowDown":
      yDirection = 1;
      xDirection = 0;
      break;
    case "ArrowUp":
      yDirection = -1;
      xDirection = 0;
      break;
    default:
      console.log("Unknown key pressed: ", e.key);
  }
});

main();