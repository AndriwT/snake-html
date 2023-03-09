// HW
// Expected 2 days

// Update the score when eating a fruit - DONE
// Game Over Screen with restart button - kind of done
// When Pressing the SpaceBar it pauses the game and shows Paused on screen - DONE

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

let snakeBodyPieces = [];

function createFruitElement() {
  const el = document.createElement("div");
  el.style.height = fruit.height + "px";
  el.style.width = fruit.width + "px";
  el.style.backgroundColor = "red";
  el.style.position = "absolute";
  el.style.left = fruit.x + "px";
  el.style.top = fruit.y + "px";
  el.style.border = "0px solid white";
  el.style.borderRadius = "50%";
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

// doFoo.onclick = () => {
//   const myNode = document.getElementById("foo");
//   while (myNode.firstChild) {
//     myNode.removeChild(myNode.lastChild);
//   }
// };

function clearContainer() {
  let scoreEl = document.querySelector("#score");
  scoreEl.innerText = "0";

  for (let i = 0; i < bodyPiecesEl.length; i++) {
    const bodyPieceEl = bodyPiecesEl[i];
    bodyPieceEl.remove();
  }

  bodyPiecesEl = [];
  snakeBodyPieces = [];

  snake.x = 0;
  snake.y = 0;

  // fruitEl.remove();

  // snakeEl = null;
  // fruitEl = null;

  return;
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

function gameOver(gameContainer) {
  console.log("game over");
  createGameOverModal(gameContainer);
}

function createGameOverModal(gameContainer) {
  const modalEl = document.createElement("div");
  modalEl.style.backgroundColor = "rgb(0 201 210 / 47%)";
  modalEl.style.position = "absolute";
  modalEl.style.height = "200px";
  modalEl.style.width = "500px";
  modalEl.style.top = "40%";
  modalEl.style.left = "40%";
  modalEl.style.display = "flex";
  modalEl.style.flexDirection = "column";
  modalEl.style.justifyContent = "center";
  modalEl.style.alignItems = "center";
  modalEl.style.fontSize = "50px";
  modalEl.style.border = "0px solid black";
  modalEl.style.borderRadius = "15px";
  modalEl.id = "modal";

  const text = document.createElement("h4");
  text.style.margin = "0px";
  text.innerText = "GAME OVER";

  const restartButtonEl = document.createElement("button");
  restartButtonEl.innerText = "Restart";

  restartButtonEl.addEventListener("click", () => {
    console.log("click");
    modalEl.remove();
    clearContainer();
    score = 0;
    xDirection = 1;
    yDirection = 0;
    gameState = "RUNNING";
  });

  gameState = "GAME_OVER";
  modalEl.appendChild(text);
  modalEl.appendChild(restartButtonEl);
  document.body.appendChild(modalEl);
}

function gamePaused() {
  const pauseIconEl = document.createElement("div");

  pauseIconEl.style.position = "absolute";
  pauseIconEl.style.height = "100px";
  pauseIconEl.style.width = "200px";
  pauseIconEl.style.backgroundColor = "rgb(98 50 182 / 45%)";
  pauseIconEl.style.top = "40%";
  pauseIconEl.style.left = "40%";
  pauseIconEl.style.display = "flex";
  pauseIconEl.style.justifyContent = "center";
  pauseIconEl.style.alignItems = "center";
  pauseIconEl.style.border = "thick solid black";
  pauseIconEl.style.borderRadius = "15px";
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case " ":
        pauseIconEl.remove();
      default:
        console.log("Unknown key pressed: ", event.key);
    }
  });

  const modalEl = document.createElement("div");
  modalEl.className = "modal-card";

  const pauseText = document.createElement("h4");
  pauseText.style.fontSize = "30px";
  pauseText.style.color = "black";
  pauseText.innerText = "PAUSED";

  modalEl.appendChild(pauseText);

  pauseIconEl.appendChild(modalEl);
  document.body.appendChild(pauseIconEl);
}
let gameState = "RUNNING"; // RUNNING, PAUSED, GAME_OVER

let shouldGameRun = true;
let isPaused = false;
let isGameOver = false;

let snakeEl = null;
let fruitEl = null;

let bodyPiecesEl = [];

async function main() {
  const gameContainer = document.querySelector("#game");

  snakeEl = createSnakeElement();
  gameContainer.appendChild(snakeEl);

  fruitEl = createFruitElement();
  gameContainer.appendChild(fruitEl);

  while (shouldGameRun) {
    if (gameState === "PAUSED" || gameState === "GAME_OVER") {
      await sleep(50);
      continue;
    }

    checkHitDetectionForWalls(gameContainer);
    const hitSelf = checkIfHitItself();
    if (hitSelf) {
      gameOver(gameContainer);
      continue;
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
    case " ":
      if (gameState === "RUNNING") {
        gamePaused();
        gameState = "PAUSED";
      } else if (gameState === "PAUSED") {
        gameState = "RUNNING";
      }
      break;
    default:
      console.log("Unknown key pressed: ", event.key);
  }
});

main();
