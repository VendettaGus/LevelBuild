const canvas = document.getElementById('editor');
const ctx = canvas.getContext('2d');
let gridSize = 20;
canvas.width = 1788;
canvas.height = 733;
canvas.width = Math.floor(canvas.width / gridSize) * gridSize;
canvas.height = Math.floor(canvas.height / gridSize) * gridSize;
const platforms = [];
let isDrawing = false;
let startX, startY;
let currentCellX = null;
let currentCellY = null;

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  currentCellX = Math.floor((e.clientX - rect.left) / gridSize) * gridSize;
  currentCellY = Math.floor((e.clientY - rect.top) / gridSize) * gridSize;
  drawGrid(); // Перерисовываем сетку с подсветкой
});

canvas.addEventListener('mouseout', () => {
  currentCellX = null;
  currentCellY = null;
  drawGrid(); // Перерисовываем сетку без подсветки
});

const gridSizeInput = document.getElementById('gridSizeInput');
const platformTypeSelect = document.getElementById('platformType');

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#555';

  // Рисуем сетку
  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.strokeRect(x, y, gridSize, gridSize);
    }
  }

  // Подсветка текущей ячейки
  if (currentCellX !== null && currentCellY !== null) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.96)'; // Полупрозрачный желтый цвет
    ctx.fillRect(currentCellX, currentCellY, gridSize, gridSize);
  }

  // Отрисовка платформ
  platforms.forEach(platform => {
    ctx.fillStyle = platform.color || 'blue';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

// Начало рисования
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  startX = Math.floor((e.clientX - rect.left) / gridSize) * gridSize;
  startY = Math.floor((e.clientY - rect.top) / gridSize) * gridSize;
  isDrawing = true;
});

// Завершение рисования
canvas.addEventListener('mouseup', e => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const endX = Math.floor((e.clientX - rect.left) / gridSize) * gridSize;
  const endY = Math.floor((e.clientY - rect.top) / gridSize) * gridSize;
  const width = Math.abs(endX - startX) || gridSize;
  const height = Math.abs(endY - startY) || gridSize;
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);

  const platformType = platformTypeSelect.value;

  if (platformType === 'horizontal' && width >= height) {
    if (!platformExists(x, y, width, gridSize)) {
      platforms.push({ x, y, width, height: gridSize, color: 'red' });
    }
  } else if (platformType === 'vertical' && height > width) {
    if (!platformExists(x, y, gridSize, height)) {
      platforms.push({ x, y, width: gridSize, height, color: 'green' });
    }
  } else if (platformType === 'rectangle') {
    if (!platformExists(x, y, width, height)) {
      platforms.push({ x, y, width, height, color: 'blue' });
    }
  }

  isDrawing = false;
  updateOutput();
  drawGrid();
});

document.getElementById('clearCanvas').addEventListener('click', () => {
  platforms.length = 0;
  updateOutput();
  drawGrid();
});

gridSizeInput.addEventListener('input', () => {
  gridSize = parseInt(gridSizeInput.value, 10) || 20;
  drawGrid();
});

function platformExists(x, y, width, height) {
  return platforms.some(
    platform =>
      platform.x === x &&
      platform.y === y &&
      platform.width === width &&
      platform.height === height
  );
}

function updateOutput() {
  const output = document.getElementById('output');
  output.style.fontSize = '20px'; // Устанавливаем размер текста
  output.textContent = platforms
    .map(platform =>
      `{x:${platform.x},y:${platform.y},width:${platform.width},height:${platform.height}}`
    )
    .join(',\n');
}

drawGrid();
