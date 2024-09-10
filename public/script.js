class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
        this.isOpen = false;
        this.isFlagged = false;
    }
}

let board = [];
let bombProbability = 3;
let maxProbability = 15;
let currentDifficulty = 'easy';
const difficulties = {
    easy: { rows: 9, cols: 9 },
    medium: { rows: 16, cols: 16 },
    hard: { rows: 30, cols: 16 },
};

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('difficulty').addEventListener('change', updateDifficulty);
document.getElementById('bombProbability').addEventListener('input', updateBombProbability);

function updateDifficulty() {
    currentDifficulty = document.getElementById('difficulty').value;
}

function updateBombProbability() {
    bombProbability = parseInt(document.getElementById('bombProbability').value);
}

function startGame() {
    const { rows, cols } = difficulties[currentDifficulty];
    generateBoard(rows, cols);
    renderBoard(rows, cols);
}

function generateBoard(rows, cols) {
    board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            const hasBomb = Math.random() * maxProbability < bombProbability;
            board[i][j] = new BoardSquare(hasBomb, 0);
        }
    }
    calculateBombsAround(rows, cols);
}

function calculateBombsAround(rows, cols) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j].hasBomb) continue;

            let bombsAround = 0;
            for (const [dx, dy] of directions) {
                const x = i + dx, y = j + dy;
                if (x >= 0 && x < rows && y >= 0 && y < cols && board[x][y].hasBomb) {
                    bombsAround++;
                }
            }
            board[i][j].bombsAround = bombsAround;
        }
    }
}

function renderBoard(rows, cols) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.addEventListener('click', () => openSquare(i, j));
            square.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagSquare(i, j);
            });
            gameBoard.appendChild(square);
        }
    }
}

function openSquare(i, j) {
    const square = board[i][j];
    if (square.isOpen || square.isFlagged) return;

    square.isOpen = true;
    const element = document.getElementById('gameBoard').children[i * difficulties[currentDifficulty].cols + j];
    element.classList.add('open');
    if (square.hasBomb) {
        element.classList.add('bomb');
        element.innerHTML = '💣';
        alert('Game Over!');
        startGame();
    } else {
        element.innerHTML = square.bombsAround > 0 ? square.bombsAround : '';
        if (square.bombsAround === 0) {
            openAdjacentSquares(i, j);
        }
    }
}

function openAdjacentSquares(i, j) {
    const { rows, cols } = difficulties[currentDifficulty];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        const x = i + dx, y = j + dy;
        if (x >= 0 && x < rows && y >= 0 && y < cols) {
            openSquare(x, y);
        }
    }
}

function flagSquare(i, j) {
    const square = board[i][j];
    if (square.isOpen) return;

    square.isFlagged = !square.isFlagged;
    const element = document.getElementById('gameBoard').children[i * difficulties[currentDifficulty].cols + j];
    element.classList.toggle('flagged');
    element.innerHTML = square.isFlagged ? '🚩' : '';
}

startGame();
