// DOM references
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const highScoreScreen = document.getElementById('highScoreScreen');

const startGameBtn = document.getElementById('startGameBtn');
const viewHighScoresBtn = document.getElementById('viewHighScoresBtn');
const exitBtn = document.getElementById('exitBtn');
const restartGameBtn = document.getElementById('restartGameBtn');
const backBtn = document.getElementById('backBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');

const gameMessage = document.getElementById('gameMessage');
const currentScore = document.getElementById('currentScore');
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const highScoreList = document.getElementById('highScoreList');

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("exitBtn").addEventListener("click", function() {
        window.location.href = "index.html";
    });
});

const grid = 20; // Size of each grid cell
let snake, apple;
let running = false; // Game state
let count = 0; // Frame count for controlling speed
let score = 0; // Player's score
const highScores = JSON.parse(localStorage.getItem('snakeHighScores')) || []; // High scores stored in localStorage

// Function to reset and initialize the game
function resetGame() {
    snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [{ x: 160, y: 160 }], // Initial snake cells
        maxCells: 4, // Starting length
    };

    apple = {
        x: getRandomInt(0, canvas.width / grid) * grid,
        y: getRandomInt(0, canvas.height / grid) * grid,
    };

    score = 0; // Reset score
    running = true; // Game is running
    gameMessage.textContent = ''; // Clear game over message
    updateScore(); // Update score display
}

// Function to update the score display
function updateScore() {
    currentScore.textContent = `Score: ${score}`;
}

// Function to update high scores display
function updateHighScores() {
    highScoreList.innerHTML = ''; // Clear the list
    highScores
        .slice(0, 5) // Keep the top 5 high scores
        .forEach((highScore, index) => {
            const li = document.createElement('li');
            li.textContent = `${highScore}`;
            highScoreList.appendChild(li);
        });
}

// Function to check and update high scores if needed
function checkHighScore() {
    if (score > 0) { // Only consider scores greater than zero
        highScores.push(score);
        highScores.sort((a, b) => b - a); // Sort in descending order
        if (highScores.length > 5) { // Keep only the top 5
            highScores.pop();
        }
        localStorage.setItem('snakeHighScores', JSON.stringify(highScores)); // Save high scores to localStorage
    }
}

// Main game loop
function loop() {
    if (!running) {
        return; // Stop if the game is over or paused
    }

    requestAnimationFrame(loop); // Schedule the next frame

    if (++count < 4) { // Control speed (higher means slower)
        return;
    }

    count = 0; // Reset the count
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Move the snake
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Wrap around the edges of the canvas
    if (snake.x >= canvas.width) {
        snake.x = 0;
    } else if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }

    if (snake.y >= canvas.height) {
        snake.y = 0;
    } else if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }

    // Add the new head position
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Remove the tail if the snake is longer than its max length
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Draw the apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Draw the snake
    context.fillStyle = 'green';
    snake.cells.forEach((cell, index) => {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Check if the snake's head collides with its tail
        if (index > 0 && cell.x === snake.cells[0].x && cell.y === snake.cells[0].y) {
            running = false; // Game over
            gameMessage.textContent = `Game over! Your score is ${score}. Try again!`;
            checkHighScore(); // Update high scores if it's a high score
            return; // Exit the loop
        }

        // Check if the snake eats the apple
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++; // Grow the snake
            score++; // Increase the score
            apple.x = getRandomInt(0, canvas.width / grid) * grid; // New apple position
            apple.y = getRandomInt(0, canvas.height / grid) * grid;
            updateScore(); // Update the score display
            return; // No need to continue checking
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; // Random integer
}

// Handle arrow button clicks for snake control
document.getElementById('upBtn').addEventListener('click', () => {
    if (snake.dy !== grid) {
        snake.dy = -grid;
        snake.dx = 0;
    }
});

document.getElementById('leftBtn').addEventListener('click', () => {
    if (snake.dx !== grid) {
        snake.dx = -grid;
        snake.dy = 0;
    }
});

document.getElementById('downBtn').addEventListener('click', () => {
    if (snake.dy !== -grid) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

document.getElementById('rightBtn').addEventListener('click', () => {
    if (snake.dx !== -grid) {
        snake.dx = grid;
        snake.dy = 0;
    }
});

// Handle keyboard inputs for snake control
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// Handle touch events for snake control
let touchStartX, touchStartY;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0 && snake.dx === 0) {
            // Swipe right
            snake.dx = grid;
            snake.dy = 0;
        } else if (dx < 0 && snake.dx === 0) {
            // Swipe left
            snake.dx = -grid;
            snake.dy = 0;
        }
    } else {
        // Vertical swipe
        if (dy > 0 && snake.dy === 0) {
            // Swipe down
            snake.dy = grid;
            snake.dx = 0;
        } else if (dy < 0 && snake.dy === 0) {
            // Swipe up
            snake.dy = -grid;
            snake.dx = 0;
        }
    }
});

// Handle button events for transitioning between screens
startGameBtn.addEventListener('click', () => {
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resetGame(); // Start the game
    loop(); // Begin the game loop
});

restartGameBtn.addEventListener('click', () => {
    resetGame(); // Restart the game
    loop(); // Start the game loop
});

backBtn.addEventListener('click', () => {
    running = false;
    menuScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    updateHighScores(); // Refresh high scores
});

viewHighScoresBtn.addEventListener('click', () => {
    menuScreen.classList.add('hidden');
    highScoreScreen.classList.remove('hidden');
    updateHighScores(); // Display high scores
});

backToMenuBtn.addEventListener('click', () => {
    highScoreScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
});

exitBtn.addEventListener('click', () => {
    alert("Goodbye!");
    running = false;
});

// Initialize the game by updating the high scores
updateHighScores();
