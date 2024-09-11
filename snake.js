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
const foodColor = '#27865d';

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

        if (index === 0) {
            context.fillStyle = snakeColorHead;
        } else {
            context.fillStyle = snakeColorBody;
        }
        context.fillRect(snakePart.x, snakePart.y, cellSize, cellSize);
    }
}

function drawFood() {
    context.fillStyle = foodColor;
    context.fillRect(food.x, food.y, cellSize, cellSize);

    if (radioPortal.checked) {
        context.fillRect(foodPortal.x, foodPortal.y, cellSize, cellSize);
    }
}

function getRandomCoords() {
    return Math.floor(Math.random() * (boardWidth / cellSize - 2) + 1) * cellSize;
}

function getRandomWalls() {
    return Math.floor(Math.random() * 4);
}

function getRandomBrick() {
    return Math.floor(Math.random() * (boardWidth / cellSize)) * cellSize;
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
                randomWalls = getRandomWalls();
                randomBrick = getRandomBrick();
                context.fillStyle = wallsColorBrown;

                if (randomWalls === 0) {
                    context.fillRect(randomBrick, 0, 30, 30);
                }
                if (randomWalls === 1) {
                    context.fillRect(boardWidth, randomBrick, 30, 30);;
                }
                if (randomWalls === 2) {
                    context.fillRect(randomBrick, boardHeight, 30, 30);
                }
                if (randomWalls === 3) {
                    context.fillRect(0, randomBrick, 30, 30);
                }
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

    if (radioWalls.checked) {
        drawWalls(wallsColorWhite);
    } else {
        drawWalls(wallsColorBrown);
    }

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




