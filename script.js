const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let scale = 20;  // Adjusted the scale for better visibility
let rows, columns;

let snake;
let snakeLength;
let food;
let score;
let direction;
let nextDirection;
let gameInterval;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rows = Math.floor(canvas.height / scale);
    columns = Math.floor(canvas.width / scale);
}

function initGame() {
    resizeCanvas();
    snake = [{ x: Math.floor(columns / 2) * scale, y: Math.floor(rows / 2) * scale }];
    snakeLength = 1;
    score = 0;
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    placeFood();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
        case 'UP': head.y -= scale; break;
        case 'DOWN': head.y += scale; break;
        case 'LEFT': head.x -= scale; break;
        case 'RIGHT': head.x += scale; break;
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
        clearInterval(gameInterval);
        alert('Game Over! Press OK to restart.');
        initGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeLength++;
        score += 10;
        placeFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + scale / 2, food.y + scale / 2, scale / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw the snake
    ctx.fillStyle = 'black';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, scale, scale);
    });

    document.getElementById('scoreBoard').textContent = `Score: ${score}`;
}

function placeFood() {
    let validPosition = false;
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * columns) * scale,
            y: Math.floor(Math.random() * rows) * scale
        };

        // Ensure food is not placed on the snake
        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

function collision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp': if (direction !== 'DOWN') nextDirection = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') nextDirection = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') nextDirection = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') nextDirection = 'RIGHT'; break;
    }
});

// Button controls
document.getElementById('upButton').addEventListener('click', () => {
    if (direction !== 'DOWN') nextDirection = 'UP';
});
document.getElementById('leftButton').addEventListener('click', () => {
    if (direction !== 'RIGHT') nextDirection = 'LEFT';
});
document.getElementById('downButton').addEventListener('click', () => {
    if (direction !== 'UP') nextDirection = 'DOWN';
});
document.getElementById('rightButton').addEventListener('click', () => {
    if (direction !== 'LEFT') nextDirection = 'RIGHT';
});

// Adjust canvas size when window is resized
window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
});

initGame();
