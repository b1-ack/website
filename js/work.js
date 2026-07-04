const langOrder = ['en', 'ru', 'de', 'fr', 'ge'];

function getCurrentLang() {
    const path = window.location.pathname;
    const parts = path.split('/');
    for (const part of parts) {
        if (langOrder.includes(part)) return part;
    }
    return 'en';
}

function getPageName() {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => nav.classList.toggle('active'));
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem('theme', next);
            if (typeof drawGrid === 'function') drawGrid();
        });
    }

    document.querySelectorAll('.nav-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parts = btn.getAttribute('href').split('/');
            for (const part of parts) {
                const clean = part.replace('.html', '');
                if (langOrder.includes(clean)) {
                    localStorage.setItem('b1ack-lang', clean);
                    break;
                }
            }
        });
    });

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = getCurrentLang();
            const idx = langOrder.indexOf(currentLang);
            const nextLang = langOrder[(idx + 1) % langOrder.length];
            const page = getPageName();
            localStorage.setItem('b1ack-lang', nextLang);
            window.location.href = `../${nextLang}/${page}`;
        });
    }

    initGame();
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.src = theme === 'dark' ? '../img/icons/dark.png' : '../img/icons/light.png';
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const newGameButton = document.getElementById('newGame');
const undoButton = document.getElementById('undo');

const GRID_SIZE = 4;
const CELL_SIZE = canvas.width / GRID_SIZE;
const CELL_MARGIN = 10;

const TILE_COLORS_DARK = {
    0: { bg: '#0d0d0d', text: '#0d0d0d' },
    2: { bg: '#1a1a1a', text: '#ffffff' },
    4: { bg: '#262626', text: '#ffffff' },
    8: { bg: '#333333', text: '#ffffff' },
    16: { bg: '#404040', text: '#ffffff' },
    32: { bg: '#4d4d4d', text: '#ffffff' },
    64: { bg: '#595959', text: '#ffffff' },
    128: { bg: '#666666', text: '#ffffff' },
    256: { bg: '#737373', text: '#ffffff' },
    512: { bg: '#808080', text: '#ffffff' },
    1024: { bg: '#8c8c8c', text: '#ffffff' },
    2048: { bg: '#999999', text: '#ffffff' },
    4096: { bg: '#a6a6a6', text: '#ffffff' }
};

const TILE_COLORS_LIGHT = {
    0: { bg: '#e5e7eb', text: '#e5e7eb' },
    2: { bg: '#ffffff', text: '#111827' },
    4: { bg: '#fef3c7', text: '#111827' },
    8: { bg: '#fde68a', text: '#111827' },
    16: { bg: '#fcd34d', text: '#111827' },
    32: { bg: '#fbbf24', text: '#111827' },
    64: { bg: '#f59e0b', text: '#111827' },
    128: { bg: '#d97706', text: '#ffffff' },
    256: { bg: '#b45309', text: '#ffffff' },
    512: { bg: '#92400e', text: '#ffffff' },
    1024: { bg: '#78350f', text: '#ffffff' },
    2048: { bg: '#451a03', text: '#ffffff' },
    4096: { bg: '#1f2937', text: '#ffffff' }
};

let grid = [];
let tiles = [];
let score = 0;
let bestScore = localStorage.getItem('2048-bestScore') || 0;
let gameOver = false;
let moveHistory = [];
let currentTheme = 'dark';

bestScoreElement.textContent = bestScore;

const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
            currentTheme = document.documentElement.getAttribute('data-theme');
            drawGrid();
        }
    });
});
themeObserver.observe(document.documentElement, { attributes: true });

function getTileColors() {
    return currentTheme === 'light' ? TILE_COLORS_LIGHT : TILE_COLORS_DARK;
}

function initGame() {
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    tiles = [];
    score = 0;
    gameOver = false;
    moveHistory = [];
    scoreElement.textContent = score;
    addRandomTile();
    addRandomTile();
    drawGrid();
}

function addRandomTile() {
    const emptyCells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x] === 0) emptyCells.push({ x, y });
        }
    }
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        grid[y][x] = value;
        tiles.push({ x, y, value, scale: 0, targetScale: 1, isNew: true });
    }
}

function saveState() {
    moveHistory.push({ grid: JSON.parse(JSON.stringify(grid)), score });
    if (moveHistory.length > 10) moveHistory.shift();
}

function undoMove() {
    if (moveHistory.length > 0) {
        const state = moveHistory.pop();
        grid = state.grid;
        score = state.score;
        gameOver = false;
        scoreElement.textContent = score;
        tiles = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] !== 0) {
                    tiles.push({ x, y, value: grid[y][x], scale: 1, targetScale: 1, isNew: false });
                }
            }
        }
        drawGrid();
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const gridBg = theme === 'light' ? '#f3f4f6' : '#0a0a0a';
    const gridLine = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';

    ctx.fillStyle = gridBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = gridLine;
    ctx.lineWidth = 2;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }

    let needsRedraw = false;
    for (let i = tiles.length - 1; i >= 0; i--) {
        const tile = tiles[i];
        if (tile.isNew && tile.scale < tile.targetScale) {
            tile.scale = Math.min(tile.scale + 0.15, tile.targetScale);
            needsRedraw = true;
        } else if (tile.isNew && tile.scale >= tile.targetScale) {
            tile.isNew = false;
        }
        if (tile.fromX !== undefined) {
            const dx = tile.x - tile.fromX;
            const dy = tile.y - tile.fromY;
            if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
                tile.fromX += dx * 0.3;
                tile.fromY += dy * 0.3;
                needsRedraw = true;
            } else {
                delete tile.fromX;
                delete tile.fromY;
            }
        }
        const drawX = tile.fromX !== undefined ? tile.fromX : tile.x;
        const drawY = tile.fromY !== undefined ? tile.fromY : tile.y;
        const scale = tile.isNew ? tile.scale : 1;
        drawTile(drawX, drawY, tile.value, scale);
    }
    if (needsRedraw && !gameOver) requestAnimationFrame(drawGrid);
}

function drawTile(x, y, value, scale) {
    const colors = getTileColors();
    const color = colors[value] || colors[4096];
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    const size = (CELL_SIZE - CELL_MARGIN) * scale;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = color.bg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    if (value !== 0) {
        ctx.fillStyle = color.text;
        ctx.font = `bold ${(value < 100 ? 36 : value < 1000 ? 30 : 24) * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value.toString(), 0, 0);
    }
    ctx.restore();
}

function move(direction) {
    if (gameOver) return false;
    saveState();
    let moved = false;
    const oldGrid = JSON.parse(JSON.stringify(grid));

    if (direction === 'up' || direction === 'down') grid = transpose(grid);
    if (direction === 'right' || direction === 'down') grid = grid.map(row => row.reverse());

    for (let y = 0; y < GRID_SIZE; y++) {
        let row = grid[y].filter(cell => cell !== 0);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row.splice(i + 1, 1);
                moved = true;
            }
        }
        while (row.length < GRID_SIZE) row.push(0);
        grid[y] = row;
    }

    if (direction === 'right' || direction === 'down') grid = grid.map(row => row.reverse());
    if (direction === 'up' || direction === 'down') grid = transpose(grid);

    moved = moved || JSON.stringify(oldGrid) !== JSON.stringify(grid);

    if (moved) {
        tiles = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] !== 0) tiles.push({ x, y, value: grid[y][x], scale: 1, targetScale: 1, isNew: false });
            }
        }
        addRandomTile();
        scoreElement.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            bestScoreElement.textContent = bestScore;
            localStorage.setItem('2048-bestScore', bestScore);
        }
        checkGameOver();
    }
    drawGrid();
    return moved;
}

function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function checkGameOver() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x] === 0) return;
        }
    }
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const current = grid[y][x];
            if ((y < GRID_SIZE - 1 && grid[y + 1][x] === current) || (x < GRID_SIZE - 1 && grid[y][x + 1] === current)) return;
        }
    }
    gameOver = true;
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const gameOverBg = theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.7)';
    const gameOverText = theme === 'light' ? '#111827' : '#ffffff';
    ctx.fillStyle = gameOverBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gameOverText;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '18px Arial';
    ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);
}

if (newGameButton) newGameButton.addEventListener('click', initGame);
if (undoButton) undoButton.addEventListener('click', undoMove);

document.addEventListener('keydown', function(e) {
    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        switch (e.key) {
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
        }
    }
    if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undoMove(); }
});

let touchStartX, touchStartY;
if (canvas) {
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (!touchStartX || !touchStartY) return;
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const diffY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diffX) > Math.abs(diffY)) {
            diffX > 0 ? move('left') : move('right');
        } else {
            diffY > 0 ? move('up') : move('down');
        }
        touchStartX = null;
        touchStartY = null;
    });
}
