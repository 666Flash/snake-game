const snakeBloc = document.getElementById("snake-bloc");
const gameBoard = document.getElementById("game-board");

const bestInfo = document.getElementById("best-info");
const scoreInfo = document.getElementById("score-info");

const radioButtonDumpling = document.getElementById("radio-button-dumpling");
const radioButton = document.getElementById("radio-button");
const radioClassic = document.getElementById("radio-classic");
const radioNoDie = document.getElementById("radio-no-die");
const radioWalls = document.getElementById("radio-walls");
const radioPortal = document.getElementById("radio-portal");
const radioSpeed = document.getElementById("radio-speed");

const playButton = document.getElementById("play-button");
const exitButton = document.getElementById("exit-button");
const menuButton = document.getElementById("menu-button");

const context = gameBoard.getContext("2d");

// Colors
const boardColor = '#575757';
const wallsColorBrown = '#a96a0e';
const wallsColorWhite = '#f4f2f4';
const snakeColorHead = '#b8b926';
const snakeColorBody = '#f4f2f4';
const foodColorBranch = '#ED7D31';
const foodColorLeaflet = '#27865d';
const foodColorApple = '#FF0000';

const cellSize = 30;
const boardWidth = gameBoard.width - cellSize;
const boardHeight = gameBoard.height - cellSize;

let speed = 400;
let randomWalls = 0;
let randomBrick = 0;

const initialSnake = [
    { x: cellSize, y: 60 },
    { x: 60, y: 60 },
];
const initialWalls = [];
let snake = JSON.parse(JSON.stringify(initialSnake));
let snakeHead = {
    x: snake[0].x,
    y: snake[0].y,
};
const food = {
    x: 30,
    y: 30,
};
const foodPortal = {
    x: 30,
    y: 30,
};
const velocity = {
    x: cellSize,
    y: 0,
};
let score = 0;
let interval;


function drawBoard() {
    context.fillStyle = boardColor;
    context.fillRect(30, 30, boardWidth - cellSize, boardHeight - cellSize);

     if (radioWalls.checked) {
        context.fillStyle = wallsColorBrown;
	for(let index = 0; index < initialWalls.length; index++) {
            context.fillRect(initialWalls[index].x, initialWalls[index].y, 30, 30);
	}
     }
}

function drawWalls(color) {
    context.fillStyle = color;
    context.fillRect(0, 0, boardWidth + cellSize, 30);
    context.fillRect(boardWidth, 30, boardWidth, boardHeight);
    context.fillRect(30, boardHeight, boardWidth, boardHeight);
    context.fillRect(0, 0, 30, boardHeight + cellSize);
}

function drawSnake() {
    for(let index = 0; index < snake.length; index++) {
        const snakePart = snake[index];

        if (radioClassic.checked || radioPortal.checked || radioSpeed.checked || radioWalls.checked) {
            if(index === 0 && (snakePart.x === boardWidth || snakePart.y === boardHeight || snakePart.x < 30 || snakePart.y < 30)) {
                return finishGame();
            }
            if(index !== 0 && snakePart.x === snakeHead.x && snakePart.y === snakeHead.y) {
                return finishGame();
            }
        }
        // if (radioWalls.checked) {
        //     if(
        //         index !== 0 &&
        //         snakePart.x === snakeHead.x &&
        //         snakePart.y === snakeHead.y
        //     ) {
        //         return finishGame();
        //     }
        // }

        if (radioWalls.checked && index === 0) {
	   for(let index = 0; index < initialWalls.length; index++) {
              if(initialWalls[index].x === snakeHead.x && initialWalls[index].y === snakeHead.y) {
                 return finishGame();
              }
	   }
        }

        if (index === 0) {
            context.fillStyle = snakeColorHead;
        } else {
            context.fillStyle = snakeColorBody;
        }
        context.fillRect(snakePart.x, snakePart.y, cellSize, cellSize);
    }
}

function drawApple(x, y) {
    context.fillStyle = foodColorBranch;
    context.fillRect(x + 11, y, 2, 1);
    context.fillRect(x + 12, y + 1, 2, 1);
    context.fillRect(x + 13, y + 2, 2, 1);
    context.fillRect(x + 14, y + 3, 2, 5);
    context.fillStyle = foodColorLeaflet;
    context.fillRect(x + 19, y + 1, 3, 1);
    context.fillRect(x + 17, y + 2, 6, 1);
    context.fillRect(x + 16, y + 3, 2, 1);
    context.fillRect(x + 19, y + 3, 5, 1);
    context.fillRect(x + 16, y + 4, 1, 1);
    context.fillRect(x + 20, y + 4, 4, 1);
    context.fillRect(x + 21, y + 5, 3, 1);
    context.fillStyle = foodColorApple;
    context.fillRect(x + 5, y + 8, 7, 1);
    context.fillRect(x + 18, y + 8, 7, 1);
    context.fillRect(x + 3, y + 9, 24, 1);
    context.fillRect(x + 2, y + 10, 26, 1);
    context.fillRect(x + 1, y + 11, 28, 1);
    context.fillRect(x, y + 12, 30, 9);
    context.fillRect(x + 1, y + 21, 28, 1);
    context.fillRect(x + 2, y + 22, 26, 1);
    context.fillRect(x + 3, y + 23, 24, 1);
    context.fillRect(x + 4, y + 24, 22, 1);
    context.fillRect(x + 5, y + 25, 20, 1);
    context.fillRect(x + 6, y + 26, 18, 1);
    context.fillRect(x + 7, y + 27, 16, 1);
    context.fillRect(x + 8, y + 28, 14, 1);
    context.fillRect(x + 9, y + 29, 12, 1);
    context.fillRect(x + 10, y + 30, 4, 1);
    context.fillRect(x + 16, y + 30, 4, 1);

}

function drawFood() {
    drawApple(food.x, food.y);

    if (radioPortal.checked) {
	drawApple(foodPortal.x, foodPortal.y);
    }
}

function getRandomCoords() {
    return Math.floor(Math.random() * (boardWidth / cellSize - 2) + 1) * cellSize;
}

function placeFood() {
    food.x = getRandomCoords();
    food.y = getRandomCoords();

    if (radioPortal.checked) {
        foodPortal.x = getRandomCoords();
        foodPortal.y = getRandomCoords();
    }
}

function updateScore(newScore) {
    score = newScore;
    scoreInfo.textContent = score;
}

function checkIfEat() {
    if (radioPortal.checked) {
        if((snakeHead.x === food.x && snakeHead.y === food.y) || (snakeHead.x === foodPortal.x && snakeHead.y === foodPortal.y)) {
            if(snakeHead.x === food.x && snakeHead.y === food.y) {
                snakeHead.x = foodPortal.x;
                snakeHead.y = foodPortal.y;
            } else {
                snakeHead.x = food.x;
                snakeHead.y = food.y;
            }
            placeFood();
            updateScore(score + 1);
            return true;
        }
    } else {
        if(snakeHead.x === food.x && snakeHead.y === food.y) {
            placeFood();
            updateScore(score + 1);

            if (radioWalls.checked) {
                randomBrickX = getRandomCoords();
                randomBrickY = getRandomCoords();
                context.fillStyle = wallsColorBrown;
                context.fillRect(randomBrickX, randomBrickY, 30, 30);
		initialWalls.push({
		    x: randomBrickX,
		    y: randomBrickY,
		})
            }

            if (radioSpeed.checked) {
                speed = speed - speed / 100 * 10;
                setInterval(nextTick, speed);
            }
            return true;
        }
    }
    return false;
}

function move() {
    snakeHead.x += velocity.x;
    snakeHead.y += velocity.y;

    if(radioNoDie.checked) {
        if(snakeHead.x < 30) {
            snakeHead.x = boardWidth - cellSize;
        } else if(snakeHead.x > boardWidth - cellSize) {
            snakeHead.x = 30;
        } else if(snakeHead.y < 30) {
            snakeHead.y = boardHeight - cellSize;
        } else if(snakeHead.y > boardHeight - cellSize) {
            snakeHead.y = 30;
        }
    }
    snake.unshift({
        x: snakeHead.x,
        y: snakeHead.y,
    });

    if(!checkIfEat()) {
        snake.pop();
    }
}

function changeDirection(ev) {
    const isGoingRight = velocity.x > 0;
    const isGoingLeft = velocity.x < 0;
    const isGoingUp = velocity.y < 0;
    const isGoingDown = velocity.y > 0;

    if(ev.key === "ArrowRight" && !isGoingLeft) {
        velocity.x = cellSize;
        velocity.y = 0;
    } else if(ev.key === "ArrowLeft" && !isGoingRight) {
        velocity.x = -cellSize;
        velocity.y = 0;
    } else if(ev.key === "ArrowUp" && !isGoingDown) {
        velocity.x = 0;
        velocity.y = -cellSize;
    } else if(ev.key === "ArrowDown" && !isGoingUp) {
        velocity.x = 0;
        velocity.y = cellSize;
    }
}

function nextTick() {
    drawBoard()
    drawFood();
    drawSnake();
    move();
}

function finishGame() {
    drawWalls(wallsColorWhite);
    snakeBloc.style.display='none';
    gameBoard.style.display='block';
    radioButtonDumpling.style.display='none';
    radioButton.style.display='block';
    playButton.style.display='block';
    exitButton.style.display='block';
    menuButton.style.display='none';

    snake.pop();
    context.clearRect(0, 0, boardWidth, boardHeight);
    clearInterval(interval);
    context.fillStyle = '#27865d';
    context.font = "50px cursive";
    context.fillText("Game over !!!", 200, 200);

    if (score > bestInfo.textContent) {
        bestInfo.textContent = score
    }

    playButton.addEventListener("click", startGame);
    exitButton.addEventListener("click", finishGame);
}

function startGame() {
    snakeBloc.style.display='none';
    gameBoard.style.display='block';
    radioButtonDumpling.style.display='block';
    radioButton.style.display='none';
    playButton.style.display='none';
    exitButton.style.display='none';
    menuButton.style.display='block';

    // console.log('bestInfo', bestInfo.textContent);
    // console.log('radioClassic', radioClassic.checked);
    // console.log('radioNoDie', radioNoDie.checked);
    // console.log('radioWalls', radioWalls.checked);
    // console.log('radioPortal', radioPortal.checked);
    // console.log('radioSpeed', radioSpeed.checked);

    if (score > bestInfo.textContent) {
        bestInfo.textContent = score
    }

    drawWalls(wallsColorBrown);

    snake = JSON.parse(JSON.stringify(initialSnake));
    snakeHead = {
        x: snake[0].x,
        y: snake[0].y
    }
    velocity.x = cellSize;
    velocity.y = 0;
    updateScore(0);
    placeFood();
    menuButton.addEventListener("click", menuGame);
    window.addEventListener("keydown", changeDirection);
    interval = setInterval(nextTick, 400);
}

function menuGame() {
    finishGame()
    gameBoard.style.display='none';
    snakeBloc.style.display='block';
    radioButtonDumpling.style.display='none';
    radioButton.style.display='block'
    menuButton.style.display='none';
    playButton.style.display='block';
    exitButton.style.display='block';

    if (score > bestInfo.textContent) {
        bestInfo.textContent = score
    }

    playButton.addEventListener("click", startGame);
    exitButton.addEventListener("click", finishGame);
}

window.addEventListener("load", menuGame);




