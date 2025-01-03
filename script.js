const icons = ["\u2600", "\u2601", "\u2602", "\u2603", "\u2660", "\u2663", "\u2665", "\u2666"];
const themes = {
    default: { background: '#1e1e2e', tiles: '#444' },
    space: { background: '#000', tiles: '#333' },
    ocean: { background: '#0077be', tiles: '#005f8a' },
    forest: { background: '#2b7a0b', tiles: '#3e8914' },
    desert: { background: '#c2b280', tiles: '#a08960' }
};
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const clearScoresButton = document.getElementById('clear-scores');
const clearTimerButton = document.getElementById('clear-timer');
const timerDisplay = document.getElementById('timer');
const timesList = document.getElementById('times-list');
const themeSelect = document.getElementById('theme-select');
const levelSelect = document.getElementById('level');

let tiles = [];
let firstTile = null;
let secondTile = null;
let lockBoard = false;
let startTime = null;
let timerInterval = null;
let timerStarted = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

themeSelect.addEventListener('change', () => {
    const theme = themes[themeSelect.value];
    document.body.style.backgroundColor = theme.background;
    document.querySelectorAll('.tile').forEach(tile => {
        tile.style.backgroundColor = theme.tiles;
    });
});

levelSelect.addEventListener('change', () => {
    createGrid(parseInt(levelSelect.value));
});

function createGrid(size = 4) {
    const pairs = Array(size * size / 2).fill(icons).flat().slice(0, size * size);
    shuffle(pairs);
    gameContainer.style.gridTemplateColumns = `repeat(${size}, 80px)`;
    gameContainer.innerHTML = "";
    tiles = [];

    pairs.forEach((icon) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.icon = icon;
        tile.innerHTML = "&nbsp;";
        tile.addEventListener('click', () => flipTile(tile));
        gameContainer.appendChild(tile);
        tiles.push(tile);
    });
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsedTime} seconds`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    addTimeToTable(finalTime);
    return finalTime;
}

function clearTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "Time: 0 seconds";
    timerStarted = false;
}

function addTimeToTable(time) {
    const row = document.createElement('tr');
    const indexCell = document.createElement('td');
    const timeCell = document.createElement('td');

    indexCell.textContent = timesList.children.length + 1;
    timeCell.textContent = time;

    row.appendChild(indexCell);
    row.appendChild(timeCell);
    timesList.appendChild(row);
}

clearScoresButton.addEventListener('click', () => {
    timesList.innerHTML = "";
});

clearTimerButton.addEventListener('click', clearTimer);

function flipTile(tile) {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    if (lockBoard || tile === firstTile) return;

    tile.innerHTML = tile.dataset.icon;
    tile.classList.add('flipped');

    if (!firstTile) {
        firstTile = tile;
        return;
    }

    secondTile = tile;
    lockBoard = true;
    checkMatch();
}

function checkMatch() {
    const isMatch = firstTile.dataset.icon === secondTile.dataset.icon;

    if (isMatch) {
        disableTiles();
    } else {
        unflipTiles();
    }
}

function disableTiles() {
    firstTile.removeEventListener('click', () => flipTile(firstTile));
    secondTile.removeEventListener('click', () => flipTile(secondTile));

    resetBoard();

    if (tiles.every(tile => tile.classList.contains('flipped'))) {
        setTimeout(() => {
            alert(`Congratulations! You completed the game in ${stopTimer()} seconds.`);
        }, 500);
    }
}

function unflipTiles() {
    setTimeout(() => {
        firstTile.innerHTML = "&nbsp;";
        secondTile.innerHTML = "&nbsp;";
        firstTile.classList.remove('flipped');
        secondTile.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstTile, secondTile] = [null, null];
    lockBoard = false;
}

startButton.addEventListener('click', () => {
    alert('Bullet Hell Mode Coming Soon!');
});

createGrid();
