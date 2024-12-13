const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset-button");
const xWinsText = document.getElementById("x-wins");
const oWinsText = document.getElementById("o-wins");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // X is always the player
let gameActive = true;
let xWins = 0;
let oWins = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize game board
function initializeGame() {
    gameBoard.innerHTML = "";
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = `${currentPlayer}'s turn`;

    board.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = index;
        cell.addEventListener("click", handleCellClick);
        gameBoard.appendChild(cell);
    });
}

// Handle a cell click
function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `${currentPlayer} wins!`;
        updateScore(currentPlayer);
        highlightWinningCells();
        gameActive = false;
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a tie!";
        highlightTie();
        gameActive = false;
    } else {
        currentPlayer = "O"; // Switch to AI
        statusText.textContent = `AI's turn`;
        setTimeout(aiMove, 500); // Add a slight delay for better UX
    }
}

// AI Move Logic
function aiMove() {
    if (!gameActive) return;

    let index = findBestMove();
    board[index] = currentPlayer;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `AI wins!`;
        updateScore(currentPlayer);
        highlightWinningCells();
        gameActive = false;
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a tie!";
        highlightTie();
        gameActive = false;
    } else {
        currentPlayer = "X"; // Switch back to player
        statusText.textContent = `Your turn`;
    }
}

// Find the best move for AI
function findBestMove() {
    // Check if AI can win
    for (let [a, b, c] of winningCombinations) {
        if (board[a] === "O" && board[b] === "O" && board[c] === "") return c;
        if (board[a] === "O" && board[b] === "" && board[c] === "O") return b;
        if (board[a] === "" && board[b] === "O" && board[c] === "O") return a;
    }

    // Check if AI needs to block player
    for (let [a, b, c] of winningCombinations) {
        if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
        if (board[a] === "X" && board[b] === "" && board[c] === "X") return b;
        if (board[a] === "" && board[b] === "X" && board[c] === "X") return a;
    }

    // Choose a random available spot
    const availableSpaces = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
}

// Check for a win
function checkWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[b] === board[c];
    });
}

// Highlight winning cells
function highlightWinningCells() {
    winningCombinations.forEach(combination => {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            document.querySelectorAll(".cell")[a].classList.add("winner");
            document.querySelectorAll(".cell")[b].classList.add("winner");
            document.querySelectorAll(".cell")[c].classList.add("winner");
        }
    });
}

// Highlight all cells for a tie
function highlightTie() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.add("tie");
    });
}

// Update the scoreboard
function updateScore(winner) {
    if (winner === "X") {
        xWins++;
        xWinsText.textContent = xWins;
    } else if (winner === "O") {
        oWins++;
        oWinsText.textContent = oWins;
    }
}

// Reset the game
resetButton.addEventListener("click", initializeGame);

// Start the game
initializeGame();
