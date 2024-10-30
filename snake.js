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
const colorBlack = '#000000';
const colorYellow = '#FFFF00';
const colorBrown = '#ED7D31';
const colorGreen = '#00B050';
const colorRed = '#FF0000';

const cellSize = 30;
const boardWidth = gameBoard.width - cellSize;
const boardHeight = gameBoard.height - cellSize;

let speed = 400;
let randomWalls = 0;
let randomBrick = 0;
let isMovement = 2;

const massColorBodiSnake = [
    colorYellow,
    colorBrown,
    colorGreen,
    colorRed,
];

const initialSnake = [
    { x: cellSize, y: 60 },
    { x: 60, y: 60 },
];

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
	    if(isMovement === 1) {
		drawHeadSnakeUp(snakePart.x, snakePart.y);
	    } else if(isMovement === 2) {
		drawHeadSnakeRight(snakePart.x, snakePart.y);
	    } else if(isMovement === 3) {
		drawHeadSnakeDown(snakePart.x, snakePart.y);
	    } else if(isMovement === 4) {
		drawHeadSnakeLeft(snakePart.x, snakePart.y);
	    }
        } else {
            drawBodySnake(snakePart.x, snakePart.y);
        }
    }
}

function drawApple(x, y) {
    context.fillStyle = colorBrown;
    context.fillRect(x + 11, y, 2, 1);
    context.fillRect(x + 12, y + 1, 2, 1);
    context.fillRect(x + 13, y + 2, 2, 1);
    context.fillRect(x + 14, y + 3, 2, 5);
    context.fillStyle = colorGreen;
    context.fillRect(x + 19, y + 1, 3, 1);
    context.fillRect(x + 17, y + 2, 6, 1);
    context.fillRect(x + 16, y + 3, 2, 1);
    context.fillRect(x + 19, y + 3, 5, 1);
    context.fillRect(x + 16, y + 4, 1, 1);
    context.fillRect(x + 20, y + 4, 4, 1);
    context.fillRect(x + 21, y + 5, 3, 1);
    context.fillStyle = colorRed;
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

function drawHeadSnakeUp(x, y) {
    context.fillStyle = colorBlack;
    context.fillRect(x + 9, y, 12, 1);
    context.fillRect(x + 8, y + 1, 14, 1);
    context.fillRect(x + 7, y + 2, 16, 28);
    context.fillRect(x + 6, y + 3, 18, 26);
    context.fillRect(x + 5, y + 4, 20, 22);
    context.fillRect(x + 4, y + 6, 22, 20);
    context.fillRect(x + 3, y + 7, 24, 18);
    context.fillRect(x + 2, y + 9, 26, 18);
    context.fillRect(x + 1, y + 11, 28, 14);
    context.fillRect(x, y + 12, 30, 12);
    context.fillStyle = colorGreen;
    context.fillRect(x + 11, y + 5, 8, 22);
    context.fillRect(x + 10, y + 6, 10, 21);
    context.fillRect(x + 9, y + 8, 12, 18);
    context.fillRect(x + 8, y + 10, 14, 15);
    context.fillRect(x + 7, y + 11, 16, 14);
    context.fillRect(x + 6, y + 12, 18, 13);
    context.fillRect(x + 5, y + 14, 20, 10);
    context.fillStyle = colorBlack;
    context.fillRect(x + 7, y + 15, 3, 3);
    context.fillRect(x + 20, y + 15, 3, 3);
    context.fillStyle = colorRed;
    context.fillRect(x + 12, y, 2, 2);
    context.fillRect(x + 16, y, 2, 2);
    context.fillRect(x + 13, y + 2, 4, 2);
}


function drawHeadSnakeRight(x, y) {
    context.fillStyle = colorBlack;
    context.fillRect(x + 5, y, 12, 30);
    context.fillRect(x + 4, y + 1, 15, 28);
    context.fillRect(x + 3, y + 2, 18, 26);
    context.fillRect(x + 2, y + 3, 20, 24);
    context.fillRect(x + 1, y + 4, 25, 22);
    context.fillRect(x + 1, y + 5, 23, 22);
    context.fillRect(x, y + 6, 28, 18);
    context.fillRect(x, y + 7, 29, 16);
    context.fillRect(x, y + 8, 30, 12);
    context.fillStyle = colorGreen;
    context.fillRect(x + 5, y + 5, 11, 20);
    context.fillRect(x + 4, y + 6, 14, 18);
    context.fillRect(x + 4, y + 7, 15, 16);
    context.fillRect(x + 3, y + 8, 17, 14);
    context.fillRect(x + 3, y + 9, 19, 12);
    context.fillRect(x + 3, y + 10, 22, 10);
    context.fillRect(x + 2, y + 11, 23, 8);
    context.fillStyle = colorBlack;
    context.fillRect(x + 13, y + 6, 3, 3);
    context.fillRect(x + 13, y + 19, 3, 3);
    context.fillStyle = colorRed;
    context.fillRect(x + 28, y + 12, 2, 2);
    context.fillRect(x + 26, y + 13, 2, 4);
    context.fillRect(x + 28, y + 16, 2, 2);
}

function drawHeadSnakeDown(x, y) {
    context.fillStyle = colorBlack;
    context.fillRect(x + 9, y, 12, 30);
    context.fillRect(x + 8, y, 14, 29);
    context.fillRect(x + 7, y, 16, 28);
    context.fillRect(x + 5, y + 1, 20, 24);
    context.fillRect(x + 4, y + 2, 22, 20);
    context.fillRect(x + 3, y + 3, 24, 18);
    context.fillRect(x + 2, y + 4, 26, 16);
    context.fillRect(x + 1, y + 5, 28, 14);
    context.fillRect(x, y + 6, 30, 12);
    context.fillStyle = colorGreen;
    context.fillRect(x + 10, y + 2, 8, 23);
    context.fillRect(x + 9, y + 2, 10, 22);
    context.fillRect(x + 8, y + 3, 12, 19);
    context.fillRect(x + 7, y + 3, 14, 17);
    context.fillRect(x + 6, y + 4, 16, 15);
    context.fillRect(x + 5, y + 4, 18, 14);
    context.fillRect(x + 4, y + 7, 20, 11);
    context.fillStyle = colorBlack;
    context.fillRect(x + 6, y + 12, 3, 3);
    context.fillRect(x + 19, y + 12, 3, 3);
    context.fillStyle = colorRed;
    context.fillRect(x + 12, y + 26, 4, 2);
    context.fillRect(x + 11, y + 28, 2, 2);
    context.fillRect(x + 15, y + 28, 2, 2);
}

function drawHeadSnakeLeft(x, y) {
    context.fillStyle = colorBlack;
    context.fillRect(x + 11, y, 12, 30);
    context.fillRect(x + 9, y + 1, 15, 28);
    context.fillRect(x + 7, y + 2, 18, 26);
    context.fillRect(x + 6, y + 3, 20, 22);
    context.fillRect(x + 5, y + 4, 22, 20);
    context.fillRect(x + 3, y + 5, 25, 18);
    context.fillRect(x + 2, y + 6, 26, 16);
    context.fillRect(x + 1, y + 7, 28, 14);
    context.fillRect(x, y + 8, 30, 12);
    context.fillStyle = colorGreen;
    context.fillRect(x + 12, y + 4, 11, 20);
    context.fillRect(x + 10, y + 5, 14, 18);
    context.fillRect(x + 9, y + 6, 15, 16);
    context.fillRect(x + 8, y + 7, 17, 14);
    context.fillRect(x + 6, y + 8, 19, 12);
    context.fillRect(x + 4, y + 9, 21, 10);
    context.fillRect(x + 3, y + 10, 22, 8);
    context.fillStyle = colorBlack;
    context.fillRect(x + 13, y + 6, 3, 3);
    context.fillRect(x + 13, y + 19, 3, 3);
    context.fillStyle = colorRed;
    context.fillRect(x, y + 12, 2, 2);
    context.fillRect(x + 2, y + 13, 2, 4);
    context.fillRect(x, y + 16, 2, 2);
}

function drawBodySnake(x, y) {
    //context.fillStyle = colorGreen;
    context.fillStyle = massColorBodiSnake[getRandomColor()];
    context.fillRect(x + 12, y + 1, 6, 30);
    context.fillRect(x + 9, y + 2, 12, 28);
    context.fillRect(x + 6, y + 3, 18, 26);
    context.fillRect(x + 5, y + 4, 20, 24);
    context.fillRect(x + 4, y + 5, 22, 22);
    context.fillRect(x + 3, y + 6, 24, 20);
    context.fillRect(x + 2, y + 7, 26, 18);
    context.fillRect(x + 1, y + 10, 28, 12);
    context.fillRect(x, y + 13, 30, 6);
//    context.fillStyle = colorYellow;
    context.fillStyle = massColorBodiSnake[getRandomColor()];
    context.fillRect(x + 14, y + 3, 2, 26);
    context.fillRect(x + 13, y + 4, 4, 24);
    context.fillRect(x + 12, y + 5, 6, 22);
    context.fillRect(x + 7, y + 6, 16, 20);
    context.fillRect(x + 6, y + 7, 18, 18);
    context.fillRect(x + 5, y + 8, 20, 16);
    context.fillRect(x + 4, y + 13, 22, 6);
    context.fillRect(x + 3, y + 14, 24, 4);
    context.fillRect(x + 2, y + 15, 26, 2);
//    context.fillStyle = colorBrown;
    context.fillStyle = massColorBodiSnake[getRandomColor()];
    context.fillRect(x + 14, y + 8, 2, 16);
    context.fillRect(x + 12, y + 9, 6, 14);
    context.fillRect(x + 11, y + 10, 8, 12);
    context.fillRect(x + 10, y + 11, 10, 10);
    context.fillRect(x + 9, y + 12, 12, 8);
    context.fillRect(x + 8, y + 14, 14, 4);
    context.fillRect(x + 7, y + 15, 16, 2);
//    context.fillStyle = colorRed;
    context.fillStyle = massColorBodiSnake[getRandomColor()];
    context.fillRect(x + 14, y + 13, 2, 6);
    context.fillRect(x + 13, y + 14, 4, 4);
    context.fillRect(x + 12, y + 15, 6, 2);
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

function getRandomColor() {
    return Math.floor(Math.random() * 4);
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
	isMovement = 2;
    } else if(ev.key === "ArrowLeft" && !isGoingRight) {
        velocity.x = -cellSize;
        velocity.y = 0;
	isMovement = 4;
    } else if(ev.key === "ArrowUp" && !isGoingDown) {
        velocity.x = 0;
        velocity.y = -cellSize;
	isMovement = 1;
    } else if(ev.key === "ArrowDown" && !isGoingUp) {
        velocity.x = 0;
        velocity.y = cellSize;
	isMovement = 3;
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
