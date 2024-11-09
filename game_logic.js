const squares = document.querySelectorAll('.square');
const message = document.getElementById('winnerMessage');
const playAgainButton = document.getElementById('playAgain');
const resetScoresButton = document.getElementById('resetScores');
const playerText = document.getElementById('playerText');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const modeSelection = document.getElementById('modeSelection');
const gameContainer = document.getElementById('gameContainer');
const vsComputerButton = document.getElementById('vsComputer');
const vsPlayerButton = document.getElementById('vsPlayer');
const playerNameInputs = document.querySelectorAll('.player-name');
const backButton = document.getElementById('backButton');
const startGameButton = document.getElementById('startGame');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let isVsComputer = false;
let scoreXCount = 0;
let scoreOCount = 0;
let playerNames = ['Player 1', 'Player 2'];

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Back").addEventListener("click", function() {
        window.location.href = "index.html";
    });
});

// Function to update player names
function updatePlayerNames() {
    playerNames = [];
    playerNameInputs.forEach(input => playerNames.push(input.value || 'Player'));
}

// Function to check for a winner
function checkWinner() {
    const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combo of winCombinations) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameOver = true;
            message.innerText = `${gameBoard[a]} wins!`;
            message.style.display = 'block';
            updateScore(gameBoard[a]);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        gameOver = true;
        message.innerText = "It's a draw!";
        message.style.display = 'block';
    }
}

// Function to update scores
function updateScore(winner) {
    if (winner === 'X') {
        scoreXCount++;
        scoreX.textContent = scoreXCount;
    } else if (winner === 'O') {
        scoreOCount++;
        scoreO.textContent = scoreOCount;
    }
}

// Function to make a move
function makeMove(index) {
    if (!gameBoard[index] && !gameOver) {
        gameBoard[index] = currentPlayer;
        squares[index].textContent = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerText.innerText = `${playerNames[currentPlayer === 'X' ? 0 : 1]}'s turn`;
        checkWinner();
    }
}

// Function to reset the game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    currentPlayer = 'X';
    message.innerText = '';
    message.style.display = 'none';
    squares.forEach(square => square.textContent = '');
    playerText.innerText = `${playerNames[0]}'s turn`;
}

// Function to reset scores
function resetScores() {
    scoreXCount = 0;
    scoreOCount = 0;
    scoreX.textContent = scoreXCount;
    scoreO.textContent = scoreOCount;
    resetGame();
}

// Function to handle player vs player mode
function startVsPlayerMode() {
    isVsComputer = false;
    modeSelection.style.display = 'none';
    document.getElementById('playerInput').style.display = 'block';
}

// Function to handle player vs computer mode
function startVsComputerMode() {
    isVsComputer = true;
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    updatePlayerNames();
    playerText.innerText = `${playerNames[0]}'s turn`;
    resetGame();
}

// Event listeners
playAgainButton.addEventListener('click', resetGame);
resetScoresButton.addEventListener('click', resetScores);
vsComputerButton.addEventListener('click', startVsComputerMode);
vsPlayerButton.addEventListener('click', startVsPlayerMode);
startGameButton.addEventListener('click', () => {
    gameContainer.style.display = 'block';
    document.getElementById('playerInput').style.display = 'none';
    updatePlayerNames();
    resetGame();
});
backButton.addEventListener('click', () => {
    gameContainer.style.display = 'none';
    modeSelection.style.display = 'flex';
});

for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', () => {
        if (gameOver) return;

        makeMove(i);

        if (isVsComputer && currentPlayer === 'O' && !gameOver) {
            // AI's turn with simple strategy: random choice of empty squares
            const emptySquares = gameBoard.reduce((acc, value, index) => {
                if (!value) acc.push(index);
                return acc;
            }, []);
            const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            makeMove(randomIndex);
        }
    });
}
