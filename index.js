'use strict';
//-----------------------------------------------------------------------------------------------------------------------------------------
// БЛОК НАЧАЛЬНЫХ ЗНАЧЕНИЙ И ФУНКЦИЙ.

// 2-МЕРНЫЙ МАССИВ ДЛЯ ЯЧЕЕК.
let cells1 = []; // Массив для ячеек текущего поколения клеток.
let cells2 = []; // Массив для ячеек следующего поколения клеток.

for (let i = 0; i < 2000; i++) {
  cells1[i] = [];
  cells2[i] = [];
  for (let j = 0; j < 2000; j++) {
    cells1[i][j] = 0;
    cells2[i][j] = 0;
  }
}

// ОСНОВНОЙ КАНВАС.
const canvas = document.querySelector('#canvas'); // Канвас.
const context = canvas.getContext('2d'); // 2D контекст канвас.
const inptNumberOfCellsWidthWorld = document.querySelector('#inptNumberOfCellsWidthWorld'); // Поле ввода количества ячеек ширины.
const inptNumberOfCellsHeightWorld = document.querySelector('#inptNumberOfCellsHeightWorld'); // Поле ввода количества ячеек высоты.
const wrapperCanvas = document.querySelector('#wrapperCanvas'); // Обертка канвас.

let cellSize = 10; // Размер ячейки (начальное значение).
let isCurrentGeneration = true; // Переменная смены поколений: (true - текущее поколение, false - следующее).
let isTrackMode = false; // Переменная режима следов (true - активирован, false - деактивирован).

const maxNumberOfCellsWidthCanvas = // Максимальное количество ячеек ширины окна канвас при различных размерах клеток.
  { 0.25: 0, 0.5: 0, 1: 0, 2: 0, 5: 0, 10: 0, 20: 0 };

const maxNumberOfCellsHeightCanvas = // Максимальное колчичество ячеек высоты окна канвас при различных размерах клеток.
  { 0.25: 0, 0.5: 0, 1: 0, 2: 0, 5: 0, 10: 0, 20: 0 };

for (let key in maxNumberOfCellsWidthCanvas) {
  maxNumberOfCellsWidthCanvas[key] = Math.floor((wrapperCanvas.clientWidth - 35) / key); // Расчет количества ячеек в окне канвас.
  if (maxNumberOfCellsWidthCanvas[key] > 2000) maxNumberOfCellsWidthCanvas[key] = 2000; // Ограничение количества ячеек.
}

for (let key in maxNumberOfCellsHeightCanvas) {
  maxNumberOfCellsHeightCanvas[key] = Math.floor((wrapperCanvas.clientHeight - 35) / key);
  if (maxNumberOfCellsHeightCanvas[key] > 2000) maxNumberOfCellsHeightCanvas[key] = 2000;
}

let numberOfCellsWidthWorld = 0; // Количество ячеек ширины мира.
let numberOfCellsHeightWorld = 0; // Количество ячеек высоты мира.
let worldWidth = 0; // Ширина мира (px).
let worldHeight = 0; // Высота мира (px).

// ФУНКЦИИ ОТРИСОВКИ ОСНОВНОГО КАНВАС.
const inptLivingCellColor = document.querySelector('#inptLivingCellColor'); // Поле ввода цвета живой клетки.
const inptEmptyCellColor = document.querySelector('#inptEmptyCellColor'); // Поле ввода цвета пустой клетки.
const inptTrackCellColor = document.querySelector('#inptTrackCellColor'); // Поле ввода цвета клетки в режиме следов.

function drawBackground() { // Отрисовать фон.
  context.fillStyle = inptEmptyCellColor.value;
  context.fillRect(0, 0, worldWidth, worldHeight); // Отрисовка всего поля.
}

function drawGrid() { // Отрисовать сетку.
  if (cellSize <= 2 || isGridMode) return;
  context.fillStyle = 'lightgray';
  for (let i = 1; i <= numberOfCellsWidthWorld; i++) {
    context.fillRect(cellSize * i - 1, 0, 1, worldHeight); // Вертикальные линии.
  }
  for (let i = 1; i <= numberOfCellsHeightWorld; i++) {
    context.fillRect(0, cellSize * i - 1, worldWidth, 1); // Горизонтальные линии.
  }
}

function drawLivingCell(x, y) { // Отрисовать живую клетку.
  if (x >= maxNumberOfCellsWidthCanvas[cellSize] || y >= maxNumberOfCellsHeightCanvas[cellSize]) return;
  context.fillStyle = inptLivingCellColor.value;
  if (cellSize <= 0.5) {
    context.fillRect(Math.ceil(x * cellSize), Math.ceil(y * cellSize), 1, 1);
  } else if (cellSize <= 2 || isGridMode) {
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    context.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
  }
}

function drawEmptyCell(x, y) { // Отрисовать пустую клетку.
  if (x >= maxNumberOfCellsWidthCanvas[cellSize] || y >= maxNumberOfCellsHeightCanvas[cellSize]) return;
  context.fillStyle = inptEmptyCellColor.value;
  if (cellSize <= 0.5) {
    context.fillRect(Math.ceil(x * cellSize), Math.ceil(y * cellSize), 1, 1);
  } else if (cellSize <= 2 || isGridMode) {
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    context.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
  }
}

function drawShadowCell(x, y) { // Отрисовать клетку тени.
  if (x >= maxNumberOfCellsWidthCanvas[cellSize] || y >= maxNumberOfCellsHeightCanvas[cellSize]) return;
  context.fillStyle = 'lightgray';
  if (cellSize <= 0.5) {
    context.fillRect(Math.ceil(x * cellSize), Math.ceil(y * cellSize), 1, 1);
  } else if (cellSize <= 2 || isGridMode) {
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    context.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
  }
}

function drawTrackCell(x, y) { // Отрисовать клетку для отслеживания следа.
  if (x >= maxNumberOfCellsWidthCanvas[cellSize] || y >= maxNumberOfCellsHeightCanvas[cellSize]) return;
  context.fillStyle = inptTrackCellColor.value;
  if (cellSize <= 0.5) {
    context.fillRect(Math.ceil(x * cellSize), Math.ceil(y * cellSize), 1, 1);
  } else if (cellSize <= 2 || isGridMode) {
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    context.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
  }
}

function drawInitialCells() { // Отрисовать стартовые клетки.
  const cells = (isCurrentGeneration) ? cells1 : cells2; // Массив для ячеек поколения клеток.
  for (let x = 0; x < numberOfCellsWidthWorld; x++) {
    for (let y = 0; y < numberOfCellsHeightWorld; y++) {
      if (cells[x][y] === 1) {
        drawLivingCell(x - horizontalShift, y - verticalShift);
      }
    }
  }
}

//-----------------------------------------------------------------------------------------------------------------------------------------
// БЛОК НАСТРОЕК.

// СТАРТ ИГРЫ.
const btnStartStop = document.querySelector('#btnStartStop'); // Кнопка старт/стоп.
const slctGenSpeed = document.querySelector('#slctGenSpeed'); // Селект скорости смены колоний.

let isStart = false; // Переменная старта автоматической смены колоний.
let interval = null; // Переменная интервала для скорости смены колоний.

btnStartStop.addEventListener('click', startOrStopGame);

function startOrStopGame() { // Начать или остановить игру.
  if (isStart) {
    isStart = false;
    btnStartStop.classList.remove('start');
    btnStartStop.classList.add('stop');
    clearInterval(interval);
    if (superSpeedValue) {
      drawBackground();
      drawGrid();
      drawTracks();
      drawInitialCells();
      setClusters.clear();
    }
  } else {
    isStart = true;
    btnStartStop.classList.add('start');
    btnStartStop.classList.remove('stop');
    interval = setInterval(changeGeneration, slctGenSpeed.value);
  }
}

// СКОРОСТЬ СМЕНЫ ПОКОЛЕНИЙ.
slctGenSpeed.addEventListener('change', changeRateOfGenerationalChange);

function changeRateOfGenerationalChange() { // Изменить скорость смены поколений.
  if (isStart) {
    clearInterval(interval);
    interval = setInterval(changeGeneration, slctGenSpeed.value);
  }
}

function changeGeneration() { // Cменить поколение.

  let cellsA, cellsB; // Переменные для массивов клеток.
  if (isCurrentGeneration) {
    isCurrentGeneration = false;
    cellsA = cells1;
    cellsB = cells2;
  } else {
    isCurrentGeneration = true;
    cellsA = cells2;
    cellsB = cells1;
  }

  // Если включен режим следов и весь мир заполнен следами.
  if (isTrackMode && setTrackCells.size === numberOfCellsWidthWorld * numberOfCellsHeightWorld) {
    setTrackCells.clear();
    drawBackground();
    drawGrid();
    drawInitialCells();
  }

  if (superSpeedValue) {

    const cluster = calculateGeneration(cellsA, cellsB)[0]; // Вычисленные данные для отрисовки.
    cellsForViewing = getCellsToView(cluster);

    if (generationCount % superSpeedValue === 0) { // Если пришел черед определенного поколения.
      drawSuperSpeed(cellsB, setClusters);
      setClusters.clear();
    }

  } else {

    const [cluster, livingCells, emptyCells] = calculateGeneration(cellsA, cellsB); // Вычисленные данные для отрисовки.
    if (cellSize > 0.5) drawCells(livingCells, emptyCells);
    else drawCellsMini(livingCells, emptyCells);
    cellsForViewing = getCellsToView(cluster);

  }
}

let generationCount = 0; // Переменная счета поколений.
const spanGenerationCount = document.querySelector('#spanGenerationCount'); // Текст счета поколений.
let cellsForViewing = null; // Коллекция клеток для просмотра.
const setClusters = new Set(); // Коллекция склеенных координат клеток для просмотра для режима супер скорости.

function calculateGeneration(cellsA, cellsB) { // Расчитать данные для отображения поколения.

  generationCount++;
  spanGenerationCount.textContent = generationCount;

  if (!cellsForViewing) return [[], [], []];

  const cluster = []; // Массив координат для прогона в следующем поколении.
  const livingCells = new Set(); // Коллекция координат для отрисовки живых клеток.
  const emptyCells = new Set(); // Коллекция координат для отрисовки пустых клеток.

  for (const item of cellsForViewing) {
    const x = item / 10_000 ^ 0;
    const y = item - x * 10_000;
    // Условия телепортирования клеток с краев карты.
    let toRight = x;
    let toLeft = x;
    let toBottom = y;
    let toUp = y;
    if (x === 0) toRight = numberOfCellsWidthWorld;
    else if (x === numberOfCellsWidthWorld - 1) toLeft = -1;
    if (y === 0) toBottom = numberOfCellsHeightWorld;
    else if (y === numberOfCellsHeightWorld - 1) toUp = -1;
    const nbrs = // Переменная клеток-соседей.
      // добавление каждой клетки-соседки.
      cellsA[toRight - 1][toBottom - 1] +
      cellsA[toRight - 1][y] +
      cellsA[toRight - 1][toUp + 1] +
      cellsA[x][toBottom - 1] +
      cellsA[x][toUp + 1] +
      cellsA[toLeft + 1][toBottom - 1] +
      cellsA[toLeft + 1][y] +
      cellsA[toLeft + 1][toUp + 1];
    // Применение правила игры.
    if (cellsA[x][y]) {
      if (arrCellSurvivalRule.includes(nbrs)) {
        cellsB[x][y] = 1;
        if (cellSize > 0.5) livingCells.add([x, y]);
        else livingCells.add(Math.ceil(x * cellSize) * 10_000 + Math.ceil(y * cellSize));
      } else {
        cellsB[x][y] = 0;
        cluster.push([x, y]);
        if (cellSize > 0.5) emptyCells.add([x, y]);
        else emptyCells.add(Math.ceil(x * cellSize) * 10_000 + Math.ceil(y * cellSize));
        if (superSpeedValue && isStart) setClusters.add(x * 10_000 + y);
        if (isTrackMode) setTrackCells.add(x * 10_000 + y);
      }
    } else if (!cellsA[x][y] && arrCellBirthRule.includes(nbrs)) {
      cellsB[x][y] = 1;
      cluster.push([x, y]);
      if (cellSize > 0.5) livingCells.add([x, y]);
      else livingCells.add(Math.ceil(x * cellSize) * 10_000 + Math.ceil(y * cellSize));
      if (superSpeedValue && isStart) setClusters.add(x * 10_000 + y);
    }
  }
  for (const [x, y] of cluster) {
    cellsA[x][y] = 0; // Очистка ячеек текущего поколения которые вошли в перечень для прогона.
  }
  return [cluster, livingCells, emptyCells];
}

function getCellsToView(cluster) { // Получить клетки для просмотра.
  const set = new Set(); // Множество строк неповторяющихся координат.
  for (const [x, y] of cluster) {
    // Условия телепортирования клеток с краев карты.
    let toRight = x;
    let toLeft = x;
    let toBottom = y;
    let toUp = y;
    if (x === 0) toRight = numberOfCellsWidthWorld;
    if (x === numberOfCellsWidthWorld - 1) toLeft = -1;
    if (y === 0) toBottom = numberOfCellsHeightWorld;
    if (y === numberOfCellsHeightWorld - 1) toUp = -1;
    set.add((toRight - 1) * 10_000 + (toBottom - 1));
    set.add((toRight - 1) * 10_000 + y);
    set.add((toRight - 1) * 10_000 + (toUp + 1));
    set.add(x * 10_000 + (toBottom - 1));
    set.add(x * 10_000 + y);
    set.add(x * 10_000 + (toUp + 1));
    set.add((toLeft + 1) * 10_000 + (toBottom - 1));
    set.add((toLeft + 1) * 10_000 + y);
    set.add((toLeft + 1) * 10_000 + (toUp + 1));
  }
  return set;
}

function drawSuperSpeed(cells, set) { // Отрисовать клетки в определенной области (для режима супер скорости).
  for (const item of set) {
    const x = item / 10_000 ^ 0;
    const y = item - x * 10_000;
    if (cells[x][y]) {
      drawLivingCell(x - horizontalShift, y - verticalShift);
    } else {
      if (isTrackMode) drawTrackCell(x - horizontalShift, y - verticalShift);
      else drawEmptyCell(x - horizontalShift, y - verticalShift);
    }
  }
}

function drawCells(livingCells, emptyCells) { // Отрисовать клетки.
  for (const [x, y] of livingCells) {
    drawLivingCell(x - horizontalShift, y - verticalShift);
  }
  for (const [x, y] of emptyCells) {
    if (isTrackMode) drawTrackCell(x - horizontalShift, y - verticalShift);
    else drawEmptyCell(x - horizontalShift, y - verticalShift);
  }
}

function drawCellsMini(livingCells, emptyCells) { // Отрисовать клетки.
  for (const item of livingCells) {
    const x = item / 10_000 ^ 0;
    const y = item - x * 10_000;
    context.fillStyle = inptLivingCellColor.value;
    context.fillRect(x - horizontalShift, y - verticalShift, 1, 1);
  }
  for (const item of emptyCells) {
    const x = item / 10_000 ^ 0;
    const y = item - x * 10_000;
    if (isTrackMode) {
      context.fillStyle = inptTrackCellColor.value;
      context.fillRect(x - horizontalShift, y - verticalShift, 1, 1);
    } else {
      context.fillStyle = inptEmptyCellColor.value;
      context.fillRect(x - horizontalShift, y - verticalShift, 1, 1);
    }
  }
}

// ОДИН ШАГ ИГРЫ.
const btnOneStep = document.querySelector('#btnOneStep'); // Кнопка одного шага игры.
btnOneStep.addEventListener('click', makeOneStepOfGame);

function makeOneStepOfGame() { // Сделать один шаг игры (режим супер скорости игнорируется).

  if (isStart) {
    isStart = false;
    btnStartStop.classList.remove('start');
    btnStartStop.classList.add('stop');
    clearInterval(interval);
    if (superSpeedValue) {
      setClusters.clear();
      drawBackground();
      drawGrid();
      drawTracks();
      drawInitialCells();
    }
  }

  let cellsA, cellsB; // Переменные для массивов клеток.
  if (isCurrentGeneration) {
    isCurrentGeneration = false;
    cellsA = cells1;
    cellsB = cells2;
  } else {
    isCurrentGeneration = true;
    cellsA = cells2;
    cellsB = cells1;
  }

  const [cluster, livingCells, emptyCells] = calculateGeneration(cellsA, cellsB); // Вычисленные данные для отрисовки.
  if (cellSize > 0.5) drawCells(livingCells, emptyCells);
  else drawCellsMini(livingCells, emptyCells);
  cellsForViewing = getCellsToView(cluster);

  // Если включен режим следов и весь мир заполнен следами.
  if (isTrackMode && setTrackCells.size === numberOfCellsWidthWorld * numberOfCellsHeightWorld) {
    setTrackCells.clear();
    drawBackground();
    drawGrid();
    drawInitialCells();
  }

}

// ОЧИСТКА МИРА.
const btnClear = document.querySelector('#btnClear') // Кнопка очистки мира.

btnClear.addEventListener('click', clearGame);

function clearGame() { // Очистить игру.
  clearCells();
  drawBackground();
  drawGrid();
  clearInterval(interval);
  cellsForViewing = null;
  setClusters.clear();
  setTrackCells.clear();
  isCurrentGeneration = true;
  isStart = false;
  generationCount = 0;
  spanGenerationCount.textContent = '0';
  colonyPattern.textContent = '';
  numberOfColonyCells.textContent = `Количество клеток: 0`;
  btnStartStop.classList.remove('start');
  btnStartStop.classList.add('stop');
  btnSaveClipboard.disabled = true;
}

function clearCells() { // Очистить клетки мира.
  for (let i = 0; i < numberOfCellsWidthWorld; i++) {
    for (let j = 0; j < numberOfCellsHeightWorld; j++) {
      cells1[i][j] = 0;
      cells2[i][j] = 0;
    }
  }
}

// МАСШТАБ.
const btnZoomInOfWorld = document.querySelector('#btnZoomInOfWorld'); // Кнопка увеличения масштаба мира.
const btnZoomOutOfWorld = document.querySelector('#btnZoomOutOfWorld'); // Кнопка уменьшения масштаба мира.

btnZoomInOfWorld.addEventListener('click', zoomInOfWorld);
btnZoomOutOfWorld.addEventListener('click', zoomOutOfWorld);

function zoomInOfWorld() { // Увеличить масштаб мира.
  switch (cellSize) {
    case 0.25: cellSize = 0.5; btnZoomOutOfWorld.disabled = false;
      break;
    case 0.5: cellSize = 1;
      break;
    case 1: cellSize = 2;
      break;
    case 2: cellSize = 5;
      break;
    case 5: cellSize = 10;
      break;
    case 10: cellSize = 20; btnZoomInOfWorld.disabled = true;
      break;
    case 20: return;
  }
  btnRemoveOrDrawGrid.disabled = (cellSize <= 2) ? true : false;
  setScrolling();
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
}

function zoomOutOfWorld() { // Уменьшить масштаб мира.
  switch (cellSize) {
    case 20: cellSize = 10; btnZoomInOfWorld.disabled = false;
      break;
    case 10: cellSize = 5;
      break;
    case 5: cellSize = 2;
      break;
    case 2: cellSize = 1;
      break;
    case 1: cellSize = 0.5;
      break;
    case 0.5: cellSize = 0.25; btnZoomOutOfWorld.disabled = true;
      break;
    case 0.25: return;
  }
  btnRemoveOrDrawGrid.disabled = (cellSize <= 2) ? true : false;
  setScrolling();
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
}

// РЕЖИМ СЛЕДОВ.
const setTrackCells = new Set(); // Коллекция клеток следов.

const btnTrackMode = document.querySelector('#btnTrackMode'); // Кнопка включения/выключения режима следов.

btnTrackMode.addEventListener('click', turnTrackModeOnOrOff);

function turnTrackModeOnOrOff() { // Включить или выключить режим следа.
  if (isTrackMode) {
    isTrackMode = false;
    setTrackCells.clear();
    btnTrackMode.textContent = 'Включить режим следов';
    drawBackground();
    drawGrid();
    drawInitialCells();
  } else {
    isTrackMode = true;
    btnTrackMode.textContent = 'Выключить режим следов';
  }
}

function drawTracks() { // Отрисовать следы.
  if (!isTrackMode) return;
  for (const item of setTrackCells) {
    const x = item / 10_000 ^ 0;
    const y = item - x * 10_000;
    drawTrackCell(x - horizontalShift, y - verticalShift);
  }
}

// УБРАТЬ СЕТКУ.
const btnRemoveOrDrawGrid = document.querySelector('#btnRemoveOrDrawGrid'); // Кнопка для режима с сеткой или без.
let isGridMode = false; // Режим сетки.

btnRemoveOrDrawGrid.addEventListener('click', removeOrDrawGrid);

function removeOrDrawGrid() { // Удалить или нарисовать сетку.
  if (cellSize <= 2) return;
  if (isGridMode) {
    isGridMode = false;
    btnRemoveOrDrawGrid.textContent = 'Удалить сетку';
  } else {
    isGridMode = true;
    btnRemoveOrDrawGrid.textContent = 'Поставить сетку';
  }
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
}

// РЕЖИМ СУПЕР СКОРОСТИ
const btnInfoSuperSpeed = document.querySelector('#btnInfoSuperSpeed'); // Кнопка информации о режиме супер скорости.
const inptSuperSpeed = document.querySelector('#inptSuperSpeed'); // Поле ввода поколения которое следует отображать.
let superSpeedValue = false; // Значение поколения которое следует отображать.

btnInfoSuperSpeed.addEventListener('click', () => {
  infoWindowType.key = 'information';
  showInfoWindow(`Число введенное в поле показывает какое поколение периодично отображать (каждое 1-е, 2-е, 3-е и т.д.).
Это может ускорить большие паттерны клеток.`);
});

inptSuperSpeed.addEventListener('input', e => {
  let value = Number(e.target.value);
  if (value < 1) {
    value = 1;
    inptSuperSpeed.value = 1;
  }
  if (value === 1) superSpeedValue = false;
  else superSpeedValue = value;
});

// КОНСТАНТЫ ЭВОЛЮЦИИ.
const inptBirthRule = document.querySelector('#inptBirthRule'); // Поле ввода количества соседей для зарождения клетки (правило зарождения).
const inptSurvivalRule = document.querySelector('#inptSurvivalRule'); // Поле ввода количества соседей для выживания клетки (правило выживания).
const inptNumberOfRule = document.querySelector('#inptNumberOfRule'); // Поле ввода порядкового номера правила.
const spanRuleText = document.querySelector('#spanRuleText'); // Текст правила.
let arrCellBirthRule = []; // Массив констант эволюции для зарождения клеток.
let arrCellSurvivalRule = []; // Массив констант эволюции для сохранения клеток.

inptBirthRule.addEventListener('input', () => {
  if (/^[0-9]+$/.test(inptBirthRule.value)) {
    inptBirthRule.value = sortAndRemoveDuplicates(inptBirthRule.value);
    if (!inptBirthRule.value || !inptSurvivalRule.value) return;
    arrCellBirthRule = inptBirthRule.value.split('').map(Number);
    inptNumberOfRule.value = getNumberOfRulesArray(inptBirthRule.value, inptSurvivalRule.value);
  } else {
    arrCellBirthRule = [];
    inptBirthRule.value = '';
  }
  spanRuleText.textContent = `B${inptBirthRule.value}\/S${inptSurvivalRule.value}`;
});

inptSurvivalRule.addEventListener('input', () => {
  if (/^[0-9]+$/.test(inptSurvivalRule.value)) {
    inptSurvivalRule.value = sortAndRemoveDuplicates(inptSurvivalRule.value);
    if (!inptBirthRule.value || !inptSurvivalRule.value) return;
    arrCellSurvivalRule = inptSurvivalRule.value.split('').map(Number);
    inptNumberOfRule.value = getNumberOfRulesArray(inptBirthRule.value, inptSurvivalRule.value);
  } else {
    arrCellSurvivalRule = [];
    inptSurvivalRule.value = '';
  }
  spanRuleText.textContent = `B${inptBirthRule.value}\/S${inptSurvivalRule.value}`;
});

function sortAndRemoveDuplicates(str) { // Сортировать и удалить повторения из строки правила.
  let set = new Set(); // Набор чисел правила без повторений.
  let arr = str.split('').sort() // Массив расщепленной строки правила сортированный.
  for (let item of arr) {
    if (item === '9') continue;
    set.add(item);
  }
  return Array.from(set).join('');
}

let arrRules1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8']; // Массив правил одной клетки.
let arrRules2 = getArrofRules(arrRules1); // Массив правил двух клеток.
let arrRules3 = getArrofRules(arrRules2); // Массив правил трех клеток.
let arrRules4 = getArrofRules(arrRules3); // Массив правил четырех клеток.
let arrRules5 = getArrofRules(arrRules4); // Массив правил пяти клеток.
let arrRules6 = getArrofRules(arrRules5); // Массив правил шести клеток.
let arrRules7 = getArrofRules(arrRules6); // Массив правил семи клеток.
let arrRules8 = getArrofRules(arrRules7); // Массив правил восьми клеток.
let arrRules9 = '012345678'; // Правило для девяти клеток.

function getArrofRules(rulesNums) { // Получить массив правил n-клеток с помощью предыдущего массива.
  let rulesNumsTemp = []; // Временный массив правил для n-клеток.
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < rulesNums.length; j++) {
      rulesNumsTemp.push(i + rulesNums[j]);
    }
  }
  let rulesNumsSet = new Set(); // Набор правил для n-клеток без повторений.
  for (let item of rulesNumsTemp) {
    let arr = item.split(''); // Массив расщепленной строки правила.
    const duplicates = arr.filter((number, index, numbers) => { // Получить дублирующие цифры.
      return numbers.indexOf(number) !== index;
    });
    if (duplicates.length) continue;
    arr.sort();
    let joinItem = arr.join(''); // Склеенная строка правила.
    rulesNumsSet.add(joinItem);
  }
  return Array.from(rulesNumsSet);
}

let arrAllRules = []; // Массив со всеми правилами (511 правил).
arrAllRules.push(...arrRules1, ...arrRules2, ...arrRules3, ...arrRules4, ...arrRules5, ...arrRules6, ...arrRules7, ...arrRules8, arrRules9);
let arrRulesBirthSurv = []; // Массив с подмассивами правил для зарождения и выживания клетки. (261_121 правило)
for (let a of arrAllRules) {
  for (let b of arrAllRules) {
    arrRulesBirthSurv.push([a, b]);
  }
}

function getNumberOfRulesArray(birthRule, survivalRule) { // Получить порядковый номер правила.
  for (let i = 0; i < arrRulesBirthSurv.length; i++) {
    if (birthRule === arrRulesBirthSurv[i][0] && survivalRule === arrRulesBirthSurv[i][1]) return i + 1;
  }
}

inptNumberOfRule.addEventListener('input', () => { // При вводе: изменение правила в мире.
  let inptNumberOfRuleValue = Number(inptNumberOfRule.value); // Значение поля ввода порядкового номера правила.
  inptNumberOfRule.value = (inptNumberOfRuleValue < 1) ? 1 :
    (inptNumberOfRuleValue > arrRulesBirthSurv.length) ? arrRulesBirthSurv.length :
      (inptNumberOfRuleValue % 1 !== 0) ? Math.floor(inptNumberOfRuleValue) : inptNumberOfRuleValue;
  inptBirthRule.value = arrRulesBirthSurv[inptNumberOfRule.value - 1][0];
  inptSurvivalRule.value = arrRulesBirthSurv[inptNumberOfRule.value - 1][1];
  arrCellBirthRule = inptBirthRule.value.split('').map(Number);
  arrCellSurvivalRule = inptSurvivalRule.value.split('').map(Number);
  spanRuleText.textContent = `B${inptBirthRule.value}\/S${inptSurvivalRule.value}`;
});

// ПОКАЗ ИНФОРМАЦИОННОГО ОКНА ПРИ НАВЕДЕНИИ НА ИКОНКУ ВОПРОСА ВВОДА КОНСТАНТ ЭВОЛЮЦИИ.
const btnInfoRule = document.querySelector('#btnInfoRule'); // Кнопка информации о правиле.

btnInfoRule.addEventListener('click', () => {
  infoWindowType.key = 'information';
  showInfoWindow(`<b>B</b> – количество клеток-соседей способных зародить новую клетку,<br>
<b>S</b> – количество клеток-соседей способных сохранить жизнь клетки.<br>
<b>B3/S23</b> – правило для классической игры «Жизнь», которая наиболее разнообразна и изучена.<br>
Можете попробовать другие правила, например <b>B3/S35</b>, «HighLife» <b>B36/S23</b>, «LowDeath» <b>B368/S238</b>`);
});

// ИЗМЕНЕНИЕ РАЗМЕРА МИРА.
inptNumberOfCellsWidthWorld.addEventListener('input', changeSizeOfWorld);
inptNumberOfCellsHeightWorld.addEventListener('input', changeSizeOfWorld);

function changeSizeOfWorld() { // Измененить размер мира.
  let numOfWidth = Number(inptNumberOfCellsWidthWorld.value);
  let numOfHeight = Number(inptNumberOfCellsHeightWorld.value);
  // Введенное в поле ввода должно быть: целое число от 0 до 2000.
  inptNumberOfCellsWidthWorld.value = numberOfCellsWidthWorld = (numOfWidth > 2000) ? 2000 :
    (numOfWidth < 0) ? 1 :
      (numOfWidth % 1 !== 0) ? Math.floor(numOfWidth) :
        numOfWidth;
  inptNumberOfCellsHeightWorld.value = numberOfCellsHeightWorld = (numOfHeight > 2000) ? 2000 :
    (numOfHeight < 0) ? 1 :
      (numOfHeight % 1 !== 0) ? Math.floor(numOfHeight) :
        numOfHeight;
  if (numOfWidth * numOfHeight > 1_000_000) {
    showBigWorldWarning();
  }
  clearCellsOutsideWorld();
  setScrolling();
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
}

function showBigWorldWarning() { // Показать предупреждение о большом мире.
  if (infoWindowType.bigWorld === 'Ok') return;
  infoWindowType.key = 'bigWorld';
  showInfoWindow(`Внимание, большие карты могут замедлить работу браузера!`);
}

function clearCellsOutsideWorld() { // Очистить клетки вне мира.
  for (let x = 0; x < 2000; x++) {
    for (let y = 0; y < 2000; y++) {
      if (x >= numberOfCellsWidthWorld || y >= numberOfCellsHeightWorld) {
        cells1[x][y] = 0;
        cells2[x][y] = 0;
      }
    }
  }
}

// ВПИСЫВАНИЕ МИРА В ОКНО.
const btnInWindow = document.querySelector('#btnInWindow'); // Кнопка для вписывания мира в окно просмотра.

let canvasWidth = 0; // Ширина окна канвас (px).
let canvasHeight = 0; // Высота окна канвас (px).

btnInWindow.addEventListener('click', fitWorldIntoWindow); // При нажатии: вписывание мира в окно просмотра.

function fitWorldIntoWindow() { // Вписать мир в окно просмотра.

  let nativeCrdntsFromCanvas = getNativeCrdntsFromCanvas(); // Переменная нативных координат находящихся в окне канвас.
  clearCells();
  let leftShift = (numberOfCellsWidthWorld < maxNumberOfCellsWidthCanvas[cellSize]) // Переменная смещения колонии слева. 
    ? Math.floor((maxNumberOfCellsWidthCanvas[cellSize] - numberOfCellsWidthWorld) / 2)
    : 0;
  let topShift = (numberOfCellsHeightWorld < maxNumberOfCellsHeightCanvas[cellSize]) // Переменная смещения колонии сверху.
    ? Math.floor((maxNumberOfCellsHeightCanvas[cellSize] - numberOfCellsHeightWorld) / 2)
    : 0;
  const cells = (isCurrentGeneration) ? cells1 : cells2; // Массив для ячеек поколения клеток.
  for (const [x, y] of nativeCrdntsFromCanvas) { // Внесение клеток в текущее окно.
    cells[x + leftShift][y + topShift] = 1;
  }

  if (isTrackMode) {
    let leftShiftTrack = (numberOfCellsWidthWorld < maxNumberOfCellsWidthCanvas[cellSize]) // Переменная смещения следа слева. 
      ? Math.floor((maxNumberOfCellsWidthCanvas[cellSize] - numberOfCellsWidthWorld) / 2)
      : Math.ceil((maxNumberOfCellsWidthCanvas[cellSize] - numberOfCellsWidthWorld) / 2);
    let topShiftTrack = (numberOfCellsHeightWorld < maxNumberOfCellsHeightCanvas[cellSize]) // Переменная смещения следа сверху.
      ? Math.floor((maxNumberOfCellsHeightCanvas[cellSize] - numberOfCellsHeightWorld) / 2)
      : Math.ceil((maxNumberOfCellsHeightCanvas[cellSize] - numberOfCellsHeightWorld) / 2);

    const temp = Array.from(setTrackCells);
    setTrackCells.clear();
    for (const item of temp) {
      const x = item / 10_000 ^ 0;
      const y = item - x * 10_000;
      // Условие для обрезки следов с краев.
      if (x >= numberOfCellsWidthWorld || y >= numberOfCellsHeightWorld || x < horizontalShift || y < verticalShift) continue;
      const a = (horizontalShift) ? leftShiftTrack + horizontalShift : 0;
      const b = (verticalShift) ? topShiftTrack + verticalShift : 0;
      setTrackCells.add((x + leftShiftTrack - a) * 10_000 + (y + topShiftTrack - b));
    }
  }

  main.style.gridTemplateColumns = '1fr 0px';
  main.style.gridTemplateRows = '1fr 0px';
  inptNumberOfCellsHeightWorld.value = numberOfCellsHeightWorld = maxNumberOfCellsHeightCanvas[cellSize];
  inptNumberOfCellsWidthWorld.value = numberOfCellsWidthWorld = maxNumberOfCellsWidthCanvas[cellSize];
  worldWidth = canvasWidth = canvas.width = maxNumberOfCellsWidthCanvas[cellSize] * cellSize;
  worldHeight = canvasHeight = canvas.height = maxNumberOfCellsHeightCanvas[cellSize] * cellSize;
  if (numberOfCellsWidthWorld * numberOfCellsHeightWorld > 1_000_000) {
    showBigWorldWarning();
  }

  cellsForViewing = getCellsToView(getNativeCrdnts());
  setScrolling();
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
}

function getNativeCrdntsFromCanvas() { // Получить нативные координаты находящиеся в окне канвас.
  const nativeCrdntsFromCanvas = []; // Массив для нативных клеток колонии окна канвас.
  let numberOfCellsWidthCanvasWindow = (numberOfCellsWidthWorld > maxNumberOfCellsWidthCanvas[cellSize]) ?
    maxNumberOfCellsWidthCanvas[cellSize] : numberOfCellsWidthWorld; // Количество ячеек ширины окна канвас.
  let numberOfCellsHeightCanvasWindow = (numberOfCellsHeightWorld > maxNumberOfCellsHeightCanvas[cellSize]) ?
    maxNumberOfCellsHeightCanvas[cellSize] : numberOfCellsHeightWorld; // Количество ячеек ширины окна канвас.
  let cells = (isCurrentGeneration) ? cells1 : cells2;
  for (let i = horizontalShift; i < horizontalShift + numberOfCellsWidthCanvasWindow; i++) {
    for (let j = verticalShift; j < verticalShift + numberOfCellsHeightCanvasWindow; j++) {
      if (cells[i][j]) {
        nativeCrdntsFromCanvas.push([i - horizontalShift, j - verticalShift]);
      }
    }
  }
  return nativeCrdntsFromCanvas;
}

function getNativeCrdnts() { // Получить нативные координаты мира.
  let cells = (isCurrentGeneration) ? cells1 : cells2; // Массив для ячеек поколения клеток.
  const nativeCrdnts = [];
  for (let i = 0; i < numberOfCellsWidthWorld; i++) {
    for (let j = 0; j < numberOfCellsHeightWorld; j++) {
      if (cells[i][j] === 1) {
        nativeCrdnts.push([i, j]);
      }
    }
  }
  return nativeCrdnts;
}

// ПРОКРУТКА БОЛЬШОГО МИРА.
const btnScrollRight = document.querySelector('#btnScrollRight'); // Кнопка прокрутки вправо.
const btnScrollLeft = document.querySelector('#btnScrollLeft'); // Кнопка прокрутки влево.
const btnScrollDown = document.querySelector('#btnScrollDown'); // Кнопка прокрутки вниз.
const btnScrollUp = document.querySelector('#btnScrollUp'); // Кнопка прокрутки вверх.
const scrollBarVertical = document.querySelector('#scrollBarVertical'); // Полоса прокрутки вертикальная.
const scrollBarHorizontal = document.querySelector('#scrollBarHorizontal'); // Полоса прокрутки горизонтальная.
const main = document.querySelector('#main'); // Основное поле.

let horizontalShift = 0; // Переменная сдвига по горизонтали.
let verticalShift = 0; // Переменная сдвига по вертикали.

btnScrollRight.addEventListener('click', scrollRight);
btnScrollLeft.addEventListener('click', scrollLeft);
btnScrollDown.addEventListener('click', scrollDown);
btnScrollUp.addEventListener('click', scrollUp);

function scrollRight() { // Прокрутить мир вправо.
  let remainingWidthCells = numberOfCellsWidthWorld - maxNumberOfCellsWidthCanvas[cellSize]; // Остаток клеток ширины.
  if (horizontalShift === remainingWidthCells) return;
  if (horizontalShift + 1 === remainingWidthCells) btnScrollRight.disabled = true;
  btnScrollLeft.disabled = false;
  horizontalShift++;
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
  changeThumbHorizontalPosition();
}

function scrollLeft() { // Прокрутить мир влево.
  if (horizontalShift === 0) return;
  if (horizontalShift === 1) btnScrollLeft.disabled = true;
  btnScrollRight.disabled = false;
  horizontalShift--;
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
  changeThumbHorizontalPosition();
}

function scrollDown() { // Прокрутить мир вниз.
  let remainingHeightCells = numberOfCellsHeightWorld - maxNumberOfCellsHeightCanvas[cellSize]; // Остаток клеток высоты.
  if (verticalShift === remainingHeightCells) return;
  if (verticalShift + 1 === remainingHeightCells) btnScrollDown.disabled = true;
  btnScrollUp.disabled = false;
  verticalShift++;
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
  changeThumbVerticalPosition();
}

function scrollUp() { // Прокрутить мир вверх.
  if (verticalShift === 0) return;
  if (verticalShift === 1) btnScrollUp.disabled = true;
  btnScrollDown.disabled = false;
  verticalShift--;
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
  changeThumbVerticalPosition();
}

function setScrolling() { // Установить прокрутку.
  if (numberOfCellsWidthWorld <= maxNumberOfCellsWidthCanvas[cellSize]) {
    btnScrollRight.disabled = true;
    btnScrollLeft.disabled = true;
    btnScrollRight.classList.add('none');
    btnScrollLeft.classList.add('none');
    scrollBarHorizontal.classList.add('none');
    main.style.gridTemplateRows = '1fr 0px';
    horizontalShift = 0;
  } else {
    btnScrollRight.disabled = false;
    btnScrollLeft.disabled = false;
    btnScrollRight.classList.remove('none');
    btnScrollLeft.classList.remove('none');
    scrollBarHorizontal.classList.remove('none');
    main.style.gridTemplateRows = '1fr 25px';
    horizontalShift = Math.floor((numberOfCellsWidthWorld - maxNumberOfCellsWidthCanvas[cellSize]) / 2); // Перемещение к центру.
    if (horizontalShift === 0) btnScrollLeft.disabled = true;
    changeThumbHorizontalPosition();
  }
  if (numberOfCellsHeightWorld <= maxNumberOfCellsHeightCanvas[cellSize]) {
    btnScrollDown.disabled = true;
    btnScrollUp.disabled = true;
    btnScrollDown.classList.add('none');
    btnScrollUp.classList.add('none');
    scrollBarVertical.classList.add('none');
    main.style.gridTemplateColumns = '1fr 0px';
    verticalShift = 0;
  } else {
    btnScrollDown.disabled = false;
    btnScrollUp.disabled = false;
    btnScrollDown.classList.remove('none');
    btnScrollUp.classList.remove('none');
    scrollBarVertical.classList.remove('none');
    main.style.gridTemplateColumns = '1fr 25px';
    verticalShift = Math.floor((numberOfCellsHeightWorld - maxNumberOfCellsHeightCanvas[cellSize]) / 2); // Перемещение к центру.
    if (verticalShift === 0) btnScrollUp.disabled = true;
    changeThumbVerticalPosition();
  }
  worldWidth = numberOfCellsWidthWorld * cellSize;
  worldHeight = numberOfCellsHeightWorld * cellSize;
  let canvasWidthMax = maxNumberOfCellsWidthCanvas[cellSize] * cellSize; // Максимальная ширина окна канвас.
  let canvasHeightMax = maxNumberOfCellsHeightCanvas[cellSize] * cellSize;  // Максимальная высота окна канвас.
  canvasWidth = canvas.width = (worldWidth > canvasWidthMax) ? canvasWidthMax : worldWidth;
  canvasHeight = canvas.height = (worldHeight > canvasHeightMax) ? canvasHeightMax : worldHeight;
  let horizontalPadding = (wrapperCanvas.clientWidth - canvasWidth) / 2; // Горизонтальный отступ.
  let verticalPadding = (wrapperCanvas.clientHeight - canvasHeight) / 2; // Вертикальный отступ.
  scrollBarVertical.style.top = `${verticalPadding}px`;
  scrollBarVertical.style.height = `${canvasHeight}px`;
  scrollBarVertical.style.right = `${-(25 - horizontalPadding)}px`;
  scrollBarHorizontal.style.left = `${horizontalPadding}px`;
  scrollBarHorizontal.style.width = `${canvasWidth}px`;
  scrollBarHorizontal.style.bottom = `${-(25 - verticalPadding)}px`;
}

// ПРОКРУТКА ПОЛЗУНКОВ.
const sliderVertical = document.querySelector('#sliderVertical'); // Вертикальный слайдер (желоб).
const thumbVertical = document.querySelector('#thumbVertical'); // Вертикальный ползунок.
const sliderHorizontal = document.querySelector('#sliderHorizontal'); // Горизонтальный слайдер (желоб).
const thumbHorizontal = document.querySelector('#thumbHorizontal'); // Горизонтальный ползунок.

function changeThumbVerticalPosition() { // Сменить позицию вертикального ползунка.
  sliderVertical.style.gridTemplateRows = `repeat(${numberOfCellsHeightWorld}, 1fr)`;
  thumbVertical.style.gridRow = `${verticalShift + 1}/${verticalShift + 1 + maxNumberOfCellsHeightCanvas[cellSize]}`;
}

function changeThumbHorizontalPosition() { // Сменить позицию горизонтального ползунка.
  sliderHorizontal.style.gridTemplateColumns = `repeat(${numberOfCellsWidthWorld}, 1fr)`;
  thumbHorizontal.style.gridColumn = `${horizontalShift + 1}/${horizontalShift + 1 + maxNumberOfCellsWidthCanvas[cellSize]}`;
}

let yCoordOfThumb = 0; // Y-координата нажатия на ползунок.
thumbVertical.addEventListener('pointerdown', e => { // Назначить обработчики для вертикального ползунка.
  thumbVertical.setPointerCapture(e.pointerId);
  yCoordOfThumb = e.clientY - thumbVertical.getBoundingClientRect().top;
  changeThumbVerticalPositionManually(e);
  thumbVertical.addEventListener('pointermove', changeThumbVerticalPositionManually);
  thumbVertical.ondragstart = e => e.preventDefault();
  thumbVertical.onpointerup = () => {
    thumbVertical.removeEventListener('pointermove', changeThumbVerticalPositionManually);
    thumbVertical.ondragstart = null;
    thumbVertical.onpointerup = null;
  };
});

let xCoordOfThumb = 0; // X-координата нажатия на ползунок.
thumbHorizontal.addEventListener('pointerdown', e => { // Назначить обработчики для горизонтального ползунка.
  thumbHorizontal.setPointerCapture(e.pointerId);
  xCoordOfThumb = e.clientX - thumbHorizontal.getBoundingClientRect().left;
  changeThumbHorizontalPositionManually(e);
  thumbHorizontal.addEventListener('pointermove', changeThumbHorizontalPositionManually);
  thumbHorizontal.ondragstart = e => e.preventDefault();
  thumbHorizontal.onpointerup = () => {
    thumbHorizontal.removeEventListener('pointermove', changeThumbHorizontalPositionManually);
    thumbHorizontal.ondragstart = null;
    thumbHorizontal.onpointerup = null;
  };
});

function changeThumbVerticalPositionManually(e) { // Изменить позицию вертикального ползунка вручную.
  let yCoordOfSlider = e.clientY - sliderVertical.getBoundingClientRect().top; // Y-координата нажатия на слайдер.
  let sliderHeight = sliderVertical.offsetHeight; // Высота вертикального желоба включая границы.
  let sliderHeightToOneCell = // Высота вертикального желоба соответствующая одной ячейке.
    sliderHeight / numberOfCellsHeightWorld;
  let yPositionPointer = // Положение указателя по вертикали.
    Math.floor(yCoordOfThumb / sliderHeightToOneCell);
  let countCell = // Счет ячейки с учетом вычета положения указателя.
    Math.floor(yCoordOfSlider / sliderHeightToOneCell) - yPositionPointer;
  let remainingHeightCells = numberOfCellsHeightWorld - maxNumberOfCellsHeightCanvas[cellSize]; // Остаток клеток высоты.
  verticalShift = (countCell < 0) ? 0 : (countCell > remainingHeightCells) ? remainingHeightCells : countCell;
  btnScrollUp.disabled = (verticalShift === 0) ? true : false;
  btnScrollDown.disabled = (verticalShift === remainingHeightCells) ? true : false;
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
  changeThumbVerticalPosition();
}

function changeThumbHorizontalPositionManually(e) { // Изменить позицию горизонтального ползунка вручную.
  let xCoordOfSlider = e.clientX - sliderHorizontal.getBoundingClientRect().left; // X-координата нажатия слайдер.
  let sliderWidth = sliderHorizontal.offsetWidth; // Ширина горизонтального желоба включая границы.
  let sliderWidthToOneCell = // Ширина горизонтального желоба соответствующая одной ячейке.
    sliderWidth / numberOfCellsWidthWorld;
  let xPositionPointer = // Положение указателя по вертикали.
    Math.floor(xCoordOfThumb / sliderWidthToOneCell);
  let countCell = // Счет ячейки с учетом вычета положения указателя.
    Math.floor(xCoordOfSlider / sliderWidthToOneCell) - xPositionPointer;
  let remainingWidthCells = numberOfCellsWidthWorld - maxNumberOfCellsWidthCanvas[cellSize]; // Остаток клеток ширины.
  horizontalShift = (countCell < 0) ? 0 : (countCell > remainingWidthCells) ? remainingWidthCells : countCell;
  btnScrollLeft.disabled = (horizontalShift === 0) ? true : false;
  btnScrollRight.disabled = (horizontalShift === remainingWidthCells) ? true : false;
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
  changeThumbHorizontalPosition();
}

// ЦВЕТОВОЕ ОФОРМЛЕНИЕ.
const inptsColor = document.querySelectorAll('.inpt_color'); // Поля ввода цвета цветового оформления.

inptsColor.forEach(e => e.addEventListener('change', () => {
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
}));

// НАЧАЛЬНЫЕ НАСТРОЙКИ / СБРОС НАСТРОЕК.
const btnResetSet = document.querySelector('#btnResetSet'); // Кнопка сброса настроек.

window.addEventListener('load', setInitialSettings);
btnResetSet.addEventListener('click', setInitialSettings);

function setInitialSettings() { // Установить стартовые настройки.
  cellSize = 10;
  inptBirthRule.value = '3';
  arrCellBirthRule = [3];
  inptSurvivalRule.value = '23';
  arrCellSurvivalRule = [2, 3];
  spanRuleText.textContent = 'B3/S23';
  inptNumberOfRule.value = '1558';
  inptLivingCellColor.value = '#800080';
  inptEmptyCellColor.value = '#FFFFFF';
  inptTrackCellColor.value = '#61D6A0';
  btnZoomInOfWorld.disabled = false;
  btnZoomOutOfWorld.disabled = false;
  slctGenSpeed.value = 100;
  inptSuperSpeed.value = 1;
  isTrackMode = false;
  setTrackCells.clear();
  btnTrackMode.textContent = 'Включить режим следов';
  canvas.classList.remove('border');
  fitWorldIntoWindow();
  changeRateOfGenerationalChange();
}

// ИНФОРМАЦИОННОЕ ОКНО ОБ УПРАВЛЕНИИ С КЛАВИАТУРЫ.
const btnInformKeys = document.querySelector('#btnInformKeys'); // Кнопка показа информации об управлении с клавиатуры.

btnInformKeys.addEventListener('click', () => {
  infoWindowType.key = 'information';
  showInfoWindow(`<ul class="inform-keys">
      <h2 class="sub-title">Управление:</h2>
      <li><span class="key">A</span> - старт / стоп</li>
      <li><span class="key">S</span> - 1 шаг Игры</li>
      <li><span class="key">Del</span> - очистить мир</li>
      <h2 class="sub-title">В режиме отрисовки колонии на карту:</h2>
      <li><span class="key">Q</span> - отразить по горизонтали</li>
      <li><span class="key">W</span> - отразить по вертикали</li>
      <li><span class="key">E</span> - повернуть на 90° влево</li>
      <li><span class="key">R</span> - повернуть на 90° вправо</li>
      <li><span class="key">T</span> - повернуть на 180°</li>
      <h2 class="sub-title">Настройки мира:</h2>
      <li><span class="key">D</span> - вкл/вкл режим следов</li>
      <li><span class="key">F</span> - вкл/вкл сетку</li>
      <li><span class="key">G</span> - вписать мир в окно просмотра</li>
      <li><span class="key">+</span> - увеличить масштаб</li>
      <li><span class="key">-</span> - уменьшить масштаб</li>
      <li>
        <div style="display: flex;">
          <span class="key key_arrow">
            <img class="ico ico-arrow ico-arrow_up" src="icons/ico-arrow-up.svg" alt="">
          </span>
          <span class="key key_arrow">
            <img class="ico ico-arrow ico-arrow_down" src="icons/ico-arrow-down.svg" alt="">
          </span>
          <span class="key key_arrow">
            <img class="ico ico-arrow ico-arrow_left" src="icons/ico-arrow-left.svg" alt="">
          </span>
          <span class="key key_arrow">
            <img class="ico ico-arrow ico-arrow_right" src="icons/ico-arrow-right.svg" alt="">
          </span>
          &nbsp;- прокрутить карту
        </div>
      </li>  
    </ul>`);
});

//-----------------------------------------------------------------------------------------------------------------------------------------
// БЛОК ВЫВОДА КОЛОНИЙ НА КАНВАС.

let colony = { // Объект колонии.
  name: '', // Имя колонии.
  author: '', // Автор колонии.
  comments: '', // Комментарии для колонии.
  crdnts: [], // Массив координат колонии.
  rule: [[3], [2, 3]], // Правила зарождения и сохранения клеток.
  width: 0, // Количество клеток ширины колонии.
  height: 0, // Количество клеток высоты колонии.
  rle: '', // RLE-формат паттерна.
  fullRle: '', // Полный RLE-формат паттерна.
  plaintext: '', // Plaintext-формат паттерна.
  fullPlaintext: '' // Полный Plaintext-формат паттерна.
}

// ОТРИСОВКА ТЕНИ КОЛОНИИ.
let coursorX = 0; // Переменная положения курсора мыши по X-координате.
let coursorY = 0; // Переменная положения курсора мыши по Y-координате.

let coursorXList = null; // Переменная списка для X-координат.
let coursorYList = null; // Переменная списка для Y-координат.

canvas.addEventListener('mousemove', e => { // При движении курсора мыши: вычисление координат.
  coursorX = Math.floor(e.offsetX / cellSize);
  coursorY = Math.floor(e.offsetY / cellSize);
  if (coursorX < 0) coursorX = 0;
  if (coursorY < 0) coursorY = 0;
  changeCrdnts();
});

canvas.addEventListener('touchmove', e => { // При движении касания сенсорного экрана: вычисление координат.
  let rect = canvas.getBoundingClientRect(); // Перменная положения канвас относительно окна просмотра.
  coursorX = Math.floor((e.touches[0].clientX - rect.x) / cellSize);
  coursorY = Math.floor((e.touches[0].clientY - rect.y) / cellSize);
  changeCrdnts();
});

const spanMouseXcoordinate = document.querySelector('#spanMouseXcoordinate'); // Текст для X-координаты.
const spanMouseYcoordinate = document.querySelector('#spanMouseYcoordinate'); // Текст для Y-координаты.

let isShadowMode = false; // Переменная режима тени (true - активирован, false - деактивирован);

function changeCrdnts() { // Изменить координаты.
  coursorXList = { value: coursorX, next: coursorXList };
  coursorYList = { value: coursorY, next: coursorYList };
  if (coursorXList.next?.next) coursorXList.next.next = null;
  if (coursorYList.next?.next) coursorYList.next.next = null;
  if (coursorXList.value !== coursorXList.next?.value || coursorYList.value !== coursorYList.next?.value) {
    if (isShadowMode) drawShadow();
    spanMouseXcoordinate.textContent = coursorX + horizontalShift + 1;
    spanMouseYcoordinate.textContent = coursorY + verticalShift + 1;
  }
}

function drawShadow() { // Отрисовать тень колонии.
  if (colony.width <= numberOfCellsWidthWorld && colony.height <= numberOfCellsHeightWorld) {
    drawBackground();
    drawGrid();
    drawTracks();
    drawInitialCells();
    let stopDrawingWidth = // Переменная количества ячеек которые позволят не отрисовывать тень за границей по ширине.
      (coursorX > numberOfCellsWidthWorld - colony.width - horizontalShift) ?
        colony.width - (numberOfCellsWidthWorld - coursorX - horizontalShift) : 0;
    let stopDrawingHeight = // Переменная количества ячеек которые позволят не отрисовывать тень за границей по высоте.
      (coursorY > numberOfCellsHeightWorld - colony.height - verticalShift) ?
        colony.height - (numberOfCellsHeightWorld - coursorY - verticalShift) : 0;
    let cells = (isCurrentGeneration) ? cells1 : cells2; // Массив для ячеек поколения клеток.
    for (const [x, y] of colony.crdnts) {
      if (cells[x + horizontalShift + coursorX - stopDrawingWidth][y + verticalShift + coursorY - stopDrawingHeight] === 0) {
        drawShadowCell(x + coursorX - stopDrawingWidth, y + coursorY - stopDrawingHeight);
      }
    }
  } else {
    infoWindowType.key = 'bigColony';
    showInfoWindow(`Карта меньше выбранной вами колонии.<br>Увеличить карту под подходящий размер для колонии?`);
  }
}

// ОТРИСОВКА КОЛОНИИ И РУЧНОГО РИСУНКА.
const nameColony = document.querySelector('#nameColony') // Название выбранной колонии
const canvasPreview = document.querySelector('#canvasPreview'); // Канвас предпросмотра колонии.
const ctxPC = canvasPreview.getContext('2d'); // 2D контекст канвас предпросмотра.

canvas.addEventListener('touchend', () => { if (isShadowMode) drawColony() });

canvas.addEventListener('click', () => {
  if (isShadowMode) {
    drawColony();
  } else {
    drawHand();
  }
  colony = {};
});

function drawColony() { // Отрисовать колонию.
  let stopDrawingWidth = // Переменная количества ячеек которые позволят не отрисовывать тень за границей по ширине.
    (coursorX > numberOfCellsWidthWorld - colony.width - horizontalShift) ?
      colony.width - (numberOfCellsWidthWorld - coursorX - horizontalShift) : 0;
  let stopDrawingHeight = // Переменная количества ячеек которые позволят не отрисовывать тень за границей по высоте.
    (coursorY > numberOfCellsHeightWorld - colony.height - verticalShift) ?
      colony.height - (numberOfCellsHeightWorld - coursorY - verticalShift) : 0;
  let cells = (isCurrentGeneration) ? cells1 : cells2; // Массив для ячеек поколения клеток.
  for (const [x, y] of colony.crdnts) {
    cells[x + horizontalShift + coursorX - stopDrawingWidth][y + verticalShift + coursorY - stopDrawingHeight] = 1;
    drawLivingCell(x + coursorX - stopDrawingWidth, y + coursorY - stopDrawingHeight);
  }
  arrCellBirthRule = colony.rule[0];
  arrCellSurvivalRule = colony.rule[1];
  inptBirthRule.value = arrCellBirthRule.join('');
  inptSurvivalRule.value = arrCellSurvivalRule.join('');
  inptNumberOfRule.value = getNumberOfRulesArray(inptBirthRule.value, inptSurvivalRule.value);
  spanRuleText.textContent = `B${arrCellBirthRule.join('')}\/S${arrCellSurvivalRule.join('')}`;
  cellsForViewing = getCellsToView(getNativeCrdnts());
  clearPreviewCanvas();
}

function clearPreviewCanvas() { // Очистить канвас предпросмотра.
  ctxPC.fillStyle = 'white';
  ctxPC.fillRect(0, 0, 100, 100);
  isShadowMode = false;
  colony = {};
  nameColony.textContent = 'Название колонии';
  otherData.textContent = 'Прочие данные';
  if (localStorage.length) {
    optFirstSlctCustomColony.textContent = 'Выбрать'
    wrapperSlctCustomColony.classList.remove('disabled');
  } else {
    optFirstSlctCustomColony.textContent = 'Здесь будут ваши колонии';
    slctCustomColony.disabled = true;
    wrapperSlctCustomColony.classList.add('disabled');
  }
  btnDelColony.disabled = true;
  btnResetColony.disabled = true;
}

function drawHand() { // Отрисовать вручную.
  if (coursorX >= numberOfCellsWidthWorld || coursorY >= numberOfCellsHeightWorld) return; // Запрет отрисовки за границами мира.
  let cells = (isCurrentGeneration) ? cells1 : cells2; // Массив для ячеек поколения клеток.
  if (cells[coursorX + horizontalShift][coursorY + verticalShift] === 0) {
    cells[coursorX + horizontalShift][coursorY + verticalShift] = 1;
    drawLivingCell(coursorX, coursorY);
  } else {
    cells1[coursorX + horizontalShift][coursorY + verticalShift] = 0;
    cells2[coursorX + horizontalShift][coursorY + verticalShift] = 0;
    drawEmptyCell(coursorX, coursorY);
  }
  cellsForViewing = getCellsToView(getNativeCrdnts());
}

// СБРОС КОЛОНИИ.
const btnResetColony = document.querySelector('#btnResetColony'); // Кнопка сброса отрисовки колонии на предпросмотре и тени на карте.

btnResetColony.addEventListener('click', resetColony);

function resetColony() { // Сбросить отрисовку колонии на предпросмотре и тени на карте.
  clearPreviewCanvas();
  drawBackground();
  drawGrid();
  drawTracks();
  drawInitialCells();
}

//-----------------------------------------------------------------------------------------------------------------------------------------
// БЛОК ТРАНСФОРМАЦИИ КОЛОНИИ.

const btnHorizReflection = document.querySelector('#btnHorizReflection'); // Кнопка отражения колонии по горизонтали.
const btnVertReflection = document.querySelector('#btnVertReflection'); // Кнопка отражения колонии по вертикали.
const btnRightTurn = document.querySelector('#btnRightTurn'); // Кнопка поворота колонии вправо на 90 градусов.
const btnLeftTurn = document.querySelector('#btnLeftTurn'); // Кнопка поворота колонии влево на 90 градусов.
const btnRotate180deg = document.querySelector('#btnRotate180deg'); // Кнопка поворота колонии на 180 градусов.

btnHorizReflection.addEventListener('click', () => { flipHorizontally(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas(); });
btnVertReflection.addEventListener('click', () => { flipVertically(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas(); });
btnRightTurn.addEventListener('click', () => { turnRight(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas() });
btnLeftTurn.addEventListener('click', () => { turnLeft(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas(); });
btnRotate180deg.addEventListener('click', () => { rotate180deg(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas(); });

function flipHorizontally() { // Отразить колонию по горизонтали (слева направо).
  if (!isShadowMode) return;
  const result = []; // Массив для измененных координат колонии.
  for (const [x, y] of colony.crdnts) {
    result.push([0 - x + colony.width - 1, y]);
  }
  colony.crdnts = result;
}

function flipVertically() { // Отразить колонию по вертикали (сверху вниз).
  if (!isShadowMode) return;
  const result = []; // Массив для измененных координат колонии.
  for (const [x, y] of colony.crdnts) {
    result.push([x, 0 - y + colony.height - 1]);
  }
  colony.crdnts = result;
}

function turnRight() { // Повернуть колонию на 90 градусов по часовой (поворот вправо).
  if (!isShadowMode) return;
  const result = []; // Массив для измененных координат колонии.
  for (const [x, y] of colony.crdnts) {
    result.push([y, x]); // Координаты меняются местами.
  }
  let width = colony.height;
  let height = colony.width;
  colony.width = width;
  colony.height = height;
  colony.crdnts = result;
  flipHorizontally();
}

function turnLeft() { // Повернуть колонию на 90 градусов против часовой (поворот влево).
  if (!isShadowMode) return;
  const result = []; // Массив для измененных координат колонии.
  for (const [x, y] of colony.crdnts) {
    result.push([y, x]); // Координаты меняются местами.
  }
  let width = colony.height;
  let height = colony.width;
  colony.width = width;
  colony.height = height;
  colony.crdnts = result;
  flipVertically();
}

function rotate180deg() { // Повернуть колонию на 180 градусов.
  if (!isShadowMode) return;
  flipHorizontally();
  flipVertically();
}

function drawPreviewCanvas() { // Отрисовать канвас предпросмотра.
  if (!isShadowMode) return;
  let maxNumberOfCellsColony = Math.max(colony.width, colony.height); // Максимальное количество ячеек в ширине или в высоте колонии.
  let cellSizePreviewCanvas = 100 / maxNumberOfCellsColony; // Размер ячейки канвас предпросмотра.
  canvasPreview.width = cellSizePreviewCanvas * colony.width;
  canvasPreview.height = cellSizePreviewCanvas * colony.height;
  let cellsPreviewCanvas = []; // Массив координат канвас предпросмотра.
  for (let i = 0; i < maxNumberOfCellsColony; i++) { // Цикл генерации координат канвас предпросмотра.
    cellsPreviewCanvas[i] = [];
    for (let j = 0; j < maxNumberOfCellsColony; j++) {
      cellsPreviewCanvas[i][j] = 0;
    }
  }
  for (const [x, y] of colony.crdnts) {
    cellsPreviewCanvas[x][y] = 1;
  }
  for (let i = 0; i < maxNumberOfCellsColony; i++) {
    for (let j = 0; j < maxNumberOfCellsColony; j++) {
      if (cellsPreviewCanvas[i][j] === 1) {
        ctxPC.fillStyle = 'black';
        if (maxNumberOfCellsColony > 50) {
          ctxPC.fillRect(i * cellSizePreviewCanvas, j * cellSizePreviewCanvas, cellSizePreviewCanvas, cellSizePreviewCanvas);
        } else {
          ctxPC.fillRect(i * cellSizePreviewCanvas, j * cellSizePreviewCanvas, cellSizePreviewCanvas - 1, cellSizePreviewCanvas - 1);
        }
      }
    }
  }
}

//-----------------------------------------------------------------------------------------------------------------------------------------
// БЛОК ВЫБОРА ГОТОВЫХ КОЛОНИЙ ПРИ ИЗМЕНЕНИИ СООТВЕТСТВУЮЩИХ СЕЛЕКТОРОВ.

const defaultColony = document.querySelector('#defaultColony'); // Секция паттернов готовых колоний.

window.addEventListener('load', populate());

async function populate() { // Внести данные колоний из JSON.
  try {
    const request = new Request('coloniesDB.json');
    const response = await fetch(request);
    const data = await response.json();
    addDefaultColonyToSelect(data, defaultColony);
    addEventListenersForDropDownSubpanels();
    addEventListenersForSlctsDefaultColonies();
    selectDefaultColony(data);
  } catch {
    defaultColony.textContent = 'К сожалению данные колоний не загрузились.';
  }
}

function addDefaultColonyToSelect(data, currentPanel) { // Добавить готовые колонии в селект.
  for (const group of data.groups) {
    if (group.colonies) {
      let wrapperSelect = document.createElement('div'); // Обёртка селекта.
      wrapperSelect.setAttribute('class', 'wrapper-slct wrapper-slct_default-colony close');
      currentPanel.appendChild(wrapperSelect);
      let select = document.createElement('select'); // Селект готовых колоний.
      select.setAttribute('class', 'slct slct_default-colony');
      select.innerHTML = `<option value="0" selected disabled>${group.name}</option>`;
      wrapperSelect.appendChild(select);
      for (let colony of group.colonies) {
        select.insertAdjacentHTML('beforeend', `<option>${colony.name}</option>`);
      }
    } else {
      currentPanel.innerHTML += `<button class="btn btn_tab btn_tab_drop-down
btn_tab_drop-down_default-colony close">${group.name}</button>`;
      let nextPanel = document.createElement('div'); // Выпадающая панель внутренняя.
      nextPanel.setAttribute('class', 'panel panel_drop-down panel_drop-down_default-colony none');
      currentPanel.appendChild(nextPanel);
      addDefaultColonyToSelect(group, nextPanel);
    }
  }
}

function addEventListenersForDropDownSubpanels() { // Добавление прослушивателей события для выпадающих субпанелей.
  const btnsTabDropDC = document.querySelectorAll('.btn_tab_drop-down_default-colony'); // Кнопки открытия/скрытия панелей.
  const panelDropDownDC = document.querySelectorAll('.panel_drop-down_default-colony'); // Выпадающие субпанели вкладки готовых колоний.
  for (let i = 0; i < btnsTabDropDC.length; i++) {
    btnsTabDropDC[i].addEventListener('click', () => {
      if (btnsTabDropDC[i].classList.contains('open')) {
        btnsTabDropDC[i].classList.remove('open');
        btnsTabDropDC[i].classList.add('close');
        panelDropDownDC[i].classList.add('none');
      } else {
        btnsTabDropDC[i].classList.remove('close');
        btnsTabDropDC[i].classList.add('open');
        panelDropDownDC[i].classList.remove('none');
      }
    });
  }
}

function addEventListenersForSlctsDefaultColonies() { // Добавить прослушиватели события для селектов готовых колоний.
  openOrCloseSelectsDefaultColonies('click');
  openOrCloseSelectsDefaultColonies('change');
  openOrCloseSelectsDefaultColonies('blur');
}

function openOrCloseSelectsDefaultColonies(eventListener) { // Открыть или закрыть селекты готовых колоний.
  const wrappersSlctsDefaultColonies = // Обёртки селектов готовых колоний.
    document.querySelectorAll('.wrapper-slct_default-colony');
  const slctsDefaultColonies = document.querySelectorAll('.slct_default-colony'); // Селекты готовых колоний.
  for (let i = 0; i < slctsDefaultColonies.length; i++) {
    slctsDefaultColonies[i].addEventListener(eventListener, () => {
      if (wrappersSlctsDefaultColonies[i].classList.contains('open')) {
        wrappersSlctsDefaultColonies[i].classList.remove('open');
        wrappersSlctsDefaultColonies[i].classList.add('close');
      } else {
        wrappersSlctsDefaultColonies[i].classList.remove('close');
        wrappersSlctsDefaultColonies[i].classList.add('open');
      }
    });
  }
}

function selectDefaultColony(data) { // Выбрать готовую колонию (паттерн).
  defaultColony.addEventListener('change', e => {
    if (!mapDefaultColonies.has(e.target.value)) addDefaultColonyToMap(data, e);
    let fullRle = mapDefaultColonies.get(e.target.value);
    enterDataIntoColonyFromFullRle(fullRle);
    displayOtherColonyData();
    isShadowMode = true;
    drawPreviewCanvas();
    e.target.blur();
    nameColony.textContent = e.target.value;
    optFirstSlctCustomColony.textContent = (localStorage.length) ? 'Выбрать' : 'Здесь будут ваши колонии';
    btnDelColony.disabled = true;
    btnResetColony.disabled = false;
  });
}

let mapDefaultColonies = new Map(); // Map-объект для готовых колоний (паттернов).

function addDefaultColonyToMap(data, e) { // Добавить готовую колонию (паттерн) в Map-объект.
  for (const group of data.groups) {
    if (group.colonies) {
      for (const colony of group.colonies) {
        if (e.target.value === colony.name) {
          mapDefaultColonies.set(colony.name, colony.pattern);
        }
      }
    } else {
      addDefaultColonyToMap(group, e);
    }
  }
}

function enterDataIntoColonyFromFullRle(fullRle) { // Внести данные в объект "colony" из полного RLE-паттерна.
  let data = splitFullRle(fullRle);
  colony.name = data.name;
  colony.author = data.author;
  colony.comments = data.comments;
  colony.rule = data.rule;
  colony.rle = data.rle;
  colony.plaintext = convertRleToPlaintext(colony.rle);
  let crdnts = convertPlaintextToCrdnts(colony.plaintext);
  colony.crdnts = crdnts.crdnts;
  colony.width = crdnts.width;
  colony.height = crdnts.height;
}

function splitFullRle(fullRle) { // Выделить из полного RLE-формата RLE-паттерн и прочие данные.
  let birth = (/rule\s=\sb\d{1,8}\/s\d{1,8}/i.test(fullRle)) ? // Массив констант эволюции для зарождения клеток.
    fullRle.match(/rule\s=\sb?(\d{1,8})\/s?\d{1,8}/i)[1].split('').map(Number) : false;
  let survival = (/rule\s=\sb\d{1,8}\/s\d{1,8}/i.test(fullRle)) ? // Массив констант эволюции для сохранения клеток.
    fullRle.match(/rule\s=\sb?\d{1,8}\/s?(\d{1,8})/i)[1].split('').map(Number) : false;
  let newFullRle = // Новая строка полного RLE-паттерна с заменой правил на "#".
    fullRle.replace(/x\s=\s\d+,\sy\s=\s\d+,\srule\s=\sb\d{1,8}\/s\d{1,8}/gi, '#');
  let altBirth = (/#r\s\d{1,8}\/\d{1,8}/.test(newFullRle)) ? // Альтернативный массив констант эволюции для зарождения клеток.
    newFullRle.match(/#r\s\d{1,8}\/(\d{1,8})/)[1].split('').map(Number) : [3];
  let altSurvival = (/#r\s\d{1,8}\/\d{1,8}/.test(newFullRle)) ? // Альтернативный массив констант эволюции для сохранения клеток.
    newFullRle.match(/#r\s(\d{1,8})\/\d{1,8}/)[1].split('').map(Number) : [2, 3];
  let name = (/#N\s/.test(newFullRle)) ? newFullRle.match(/#N\s([^\n]+)/)[1] : ''; // Название колонии.
  let author = (/#O\s+/.test(newFullRle)) ? newFullRle.match(/#O\s([^\n]+)/)[1] : ''; // Автор колонии.
  let comments = (/#C\s+/.test(newFullRle)) ? // Массив комментариев для колонии.
    Array.from(newFullRle.matchAll(/#C\s?([^\n]+)/g)).map(item => item[1]) : [];
  newFullRle = newFullRle.replace(/#[^\n]+/g, ''); // Новая строка полного RLE-паттерна без прочих данных.
  let rle = (/[\dbo$\s\n]+!/.test(newFullRle)) ? newFullRle.match(/\n*([\dbo$\s\n]+!)/)[1] : ''; // RLE-паттерн.
  if (!birth) birth = altBirth;
  if (!survival) survival = altSurvival;
  return { name, author, comments, rule: [birth, survival], rle }
}

function convertRleToPlaintext(rle) { // Преобразовать RLE-паттерн в Plaintext-паттерн.
  return rle.replace('!', '').replace(/\s/g, '').replace(/\n/g, '').replace(/(\d+)([bo$])/g, (match, count, tag) => tag.repeat(count))
    .replace(/b/g, '.').replace(/o/g, 'O').replace(/\$/g, '\n');
}

function convertPlaintextToCrdnts(plaintext) { // Функция преобразования Plaintext-паттерна в массив координат
  let array = plaintext.split('\n'); // Массив строк Plaintext-паттерна.
  let height = array.length; // Высота колонии.
  let xCrdnts = []; // Массив для X-координат колонии.
  for (let i = 0; i < height; i++) {
    xCrdnts.push(array[i].length)
  }
  let width = xCrdnts.reduce((a, b) => a > b ? a : b); // Ширина колонии (максимальная X-координата).
  let cells = []; // Массив для клеток колонии.
  for (let x = 0; x < width; x++) {
    cells[x] = [];
    for (let y = 0; y < height; y++) {
      if (array[y][x] === 'O') {
        cells[x][y] = 1;
      } else {
        cells[x][y] = 0;
      }
    }
  }
  let crdnts = []; // Массив для координат колонии.
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (cells[x][y] === 1) {
        crdnts.push([x, y]);
      }
    }
  }
  return { crdnts, width, height };
}

//-----------------------------------------------------------------------------------------------------------------------------------------
// БЛОК ВЫБОРА, СОХРАНЕНИЯ И УДАЛЕНИЯ ПОЛЬЗОВАТЕЛЬСКИХ КОЛОНИЙ.

// СОХРАНЕНИЕ ПОЛЬЗОВАТЕЛЬСКОЙ КОЛОНИИ.
const slctCustomColony = document.querySelector('#slctCustomColony'); // Селект имён пользовательских колоний.
const inptCustomName = document.querySelector('#inptCustomName'); // Поле ввода имени пользовательской колонии.
const inptCustomAuthor = document.querySelector('#inptCustomAuthor'); // Поле ввода автора колонии.
const inptCustomComments = document.querySelector('#inptCustomComments'); // Поле ввода комментариев.
const inptCustomPattern = document.querySelector('#inptCustomPattern'); // Поле ввода паттерна колонии.
const btnSavePattern = document.querySelector('#btnSavePattern'); // Кнопка сохранения шаблона колонии.

inptCustomPattern.addEventListener('input', () => { // При введении данных: автоматическое заполнение полей ввода.
  let pattern = // Строка паттерна без сопровождающих данных.
    inptCustomPattern.value.replace(/x\s=\s\d+,\sy\s=\s\d+,\srule\s=\sb\d{1,8}\/s\d{1,8}/gi, '')
      .replace(/#[^\n]+/g, '').replace(/![^\n]+/g, '');
  if (/[\dbo$]+/.test(pattern)) { // RLE.
    let fullRle = splitFullRle(inptCustomPattern.value); // Полный RLE-паттерн.
    inptCustomName.value = fullRle.name;
    inptCustomAuthor.value = fullRle.author;
    inptCustomComments.value = fullRle.comments.join('\n');
  } else if (/[.O]+/.test(pattern)) { // Plaintext.
    let fullPlaintext = splitFullPlaintext(inptCustomPattern.value); // Полный plaintext-паттерн.
    inptCustomName.value = fullPlaintext.name;
    inptCustomAuthor.value = fullPlaintext.author;
    inptCustomComments.value = fullPlaintext.comments.join('\n');
  }
});

function splitFullPlaintext(fullPlaintext) {  // Выделить из полного Plaintext-формата Plaintext-паттерн и прочие данные.
  let name = (/!Name:/.test(fullPlaintext)) ? fullPlaintext.match(/!Name:\s?([^\n]+)/)[1] : ''; // Имя колонии.
  let author = (/!Author:/.test(fullPlaintext)) ? fullPlaintext.match(/!Author:\s?([^\n]+)/)[1] : ''; // Автор колонии.
  let birth = (/!Rule:\s?b\d{1,8}\/s\d{1,8}/i.test(fullPlaintext)) ? // Массив констант эволюции для зарождения клеток.
    fullPlaintext.match(/!Rule:\s?b(\d{1,8})\/s\d{1,8}/i)[1].split('').map(Number) : [3];
  let survival = (/!Rule:\s?b\d{1,8}\/s\d{1,8}/i.test(fullPlaintext)) ? // Массив констант эволюции для сохранения клеток.
    fullPlaintext.match(/!Rule:\s?b\d{1,8}\/s(\d{1,8})/i)[1].split('').map(Number) : [2, 3];
  let newFullPlaintext =  // Новая строка полного plaintext-паттерна без имени, автора и правила.
    fullPlaintext.replace(/(!Name:|!Author:|!Rule:)[^\n]+/g, '');
  let comments = // Массив комментариев для колонии.
    (/![^\n]+/.test(fullPlaintext)) ? Array.from(newFullPlaintext.matchAll(/!\s?([^\n]+)/g)).map(item => item[1]) : [];
  newFullPlaintext = fullPlaintext.replace(/![^\n]+/g, ''); // Новая строка полного plaintext-паттерна без прочих данных.
  let plaintext = // Plaintext-паттерн.
    (/[.O]+/.test(newFullPlaintext)) ? newFullPlaintext.match(/\n*([.O\s\n]+)/)[1] : '';
  return { name, author, rule: [birth, survival], comments, plaintext }
}

btnSavePattern.addEventListener('click', () => { // При нажатии: сохранение пользовательской колонии.
  if (isShadowMode) resetColony();
  let inptCustomPatternValue = inptCustomPattern.value;
  if (inptCustomPatternValue) { // Сохранение колонии из поля ввода паттерна.
    let pattern = // Строка паттерна без сопровождающих данных.
      inptCustomPattern.value.replace(/x\s=\s\d+,\sy\s=\s\d+,\srule\s=\sb\d{1,8}\/s\d{1,8}/gi, '')
        .replace(/#[^\n]+/g, '').replace(/![^\n]+/g, '');
    if (/[\dbo$]+/.test(pattern)) { // RLE.
      if (checkValidityOfRle(inptCustomPatternValue)) {
        enterDataIntoColonyFromFullRle(inptCustomPatternValue);
        colony.fullRle = getFullRleWithDataFromInpts();
        saveFullRle(colony.fullRle);
      } else {
        infoWindowType.key = 'information';
        showInfoWindow(`<strong>Введенный RLE-паттерн некорректен!</strong><br>
Он должен иметь примерный вид: «<span class="code">bo$2bo$3o!</span>»,
где: символ «<span class="code">b</span>» - пустая клетка, символ «<span class="code">o</span>» - живая клетка,
символ «<span class="code">$</span>» - перенос строки, числа перед символами означают количество символов.
Размер колонии не должен превышать 2000x2000 клеток`);
      }
    } else if (/[.O]+/.test(pattern)) { // Plaintext.
      if (checkValidityOfPlaintext(inptCustomPatternValue)) {
        enterDataIntoColonyFromFullPlaintext(inptCustomPatternValue);
        colony.fullRle = getFullRleWithDataFromInpts();
        saveFullRle(colony.fullRle);
      } else {
        infoWindowType.key = 'information';
        showInfoWindow(`<strong>Введенный Plaintext-паттерн некорректен!</strong><br>
Он должен иметь примерный вид:<br><span class="code">.O.<br>..O<br>OOO</span><br>
где: символ «<span class="code">.</span>» - пустая клетка, символ «<span class="code">O</span>» - живая клетка.
Размер колонии не должен превышать 2000x2000 клеток`);
      }
    } else {
      infoWindowType.key = 'information';
      showInfoWindow(`Введенные в поле ввода данные не соотвествуют ни
<a href="https://conwaylife.com/wiki/Run_Length_Encoded">RLE-паттерну</a>, ни
<a href="https://conwaylife.com/wiki/Plaintext">Plaintext-паттерну</a>.`);
    }
  } else { // Сохранение колонии из мира.
    if (checkWorldForCells()) {
      if (!colony.crdnts?.length) enterDataIntoColonyFromWorld();
      colony.fullRle = getFullRleWithDataFromInpts();
      saveFullRle(colony.fullRle);
    } else {
      infoWindowType.key = 'information';
      showInfoWindow(`Создайте свою колонию на карте или введите паттерн колонии в поле ввода!`);
    }
  }
});

function checkWorldForCells() { // Проверить мир на наличие клеток.
  let cells = (isCurrentGeneration) ? cells1 : cells2;
  for (let x = 0; x < numberOfCellsWidthWorld; x++) {
    for (let y = 0; y < numberOfCellsHeightWorld; y++) {
      if (cells[x][y] === 1) return true;
    }
  }
  return false;
}

function checkValidityOfRle(fullRle) { // Функция проверки валидности RLE-паттерна фигуры.
  let rle = splitFullRle(fullRle).rle;
  if (rle) {
    let plaintext = convertRleToPlaintext(rle);
    let crdnts = convertPlaintextToCrdnts(plaintext).crdnts;
    for (let [x, y] of crdnts) {
      if (x >= 2000 || y >= 2000) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function getFullRleWithDataFromInpts() { // Получить полный RLE-паттерн с данными из полей ввода.
  let name = (inptCustomName.value) ? `#N ${inptCustomName.value}\n` : ''; // Имя колонии.
  let author = (inptCustomAuthor.value) ? `#O ${inptCustomAuthor.value}\n` : ''; // Автор колонии.
  let comments = // Комментарии для колонии.
    (inptCustomComments.value) ? inptCustomComments.value.split('\n').map(item => `#C ${item}\n`).join('') : '';
  let rle = colony.rle.replace(/.{70}/g, '$&\n'); // Разделение строки по 70 символов.
  let sizeAndRule = // Размер колонии и правила жизни.
    `x = ${colony.width}, y = ${colony.height}, rule = b${colony.rule[0].join('')}/s${colony.rule[1].join('')}\n`;
  return name + author + comments + sizeAndRule + rle;
}

function saveFullRle(fullRle) { // Сохранить полный RLE-паттерн.
  if (inptCustomName.value) {
    if (inptCustomName.value === '0') inptCustomName.value = '0.'; // Исправление бага при удалении колонии со значением названия '0'.
    if (!(localStorage.getItem(inptCustomName.value))) {
      localStorage.setItem(inptCustomName.value, fullRle);
      slctCustomColony.insertAdjacentHTML('beforeend', `<option value="${inptCustomName.value}">${inptCustomName.value}</option>`);
      inptCustomName.value = '';
      inptCustomAuthor.value = '';
      inptCustomComments.value = '';
      inptCustomPattern.value = '';
      btnClearInpts.disabled = true;
      if (infoWindowType.firstCustomColony === "noOk") showWarningAboutSavingColonies();
    } else {
      infoWindowType.key = 'rewriteCustomColony';
      showInfoWindow(`У вас уже есть колония под названием "${inptCustomName.value}".<br>
Хотите переписать данные колонии "${inptCustomName.value}"?`);
    }
    optFirstSlctCustomColony.textContent = 'Выбрать';
    slctCustomColony.disabled = false;
    wrapperSlctCustomColony.classList.remove('disabled');
  } else {
    infoWindowType.key = 'information';
    showInfoWindow(`Введите название для своей колонии!`);
  }
}

function showWarningAboutSavingColonies() {  // Показать предупреждение о сохранении колоний в хранилище браузера.
  infoWindowType.key = 'firstCustomColony';
  showInfoWindow(`Внимание, паттерны колоний сохраняются только в Вашем браузере и могут удалиться при очистке истории
или не сохраниться в режиме инкогнито.<br>Если вам важно сохранить паттерны, нажмите на одну из кнопок показа паттернов
(RLE или Plaintext) в разделе "Паттерн колонии на карте" и сохраните их где-либо в текстовой документ.<br>
Затем можете восстановить свои колонии, введя паттерны в поле ввода и сохранить их для текущей сессии браузера`)
}

function checkValidityOfPlaintext(fullPlaintext) { // Проверить валидность Plaintext-паттерна.
  let plaintext = splitFullPlaintext(fullPlaintext).plaintext;
  if (plaintext) {
    let crdnts = convertPlaintextToCrdnts(plaintext).crdnts;
    for (let [x, y] of crdnts) {
      if (x >= 2000 || y >= 2000) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function enterDataIntoColonyFromFullPlaintext(fullPlaintext) {  // Внести данные в объект "colony" из полного Plaintext-паттерна.
  let data = splitFullPlaintext(fullPlaintext);
  colony.name = data.name;
  colony.author = data.author;
  colony.comments = data.comments;
  colony.rule = data.rule;
  colony.plaintext = data.plaintext;
  let crdnts = convertPlaintextToCrdnts(colony.plaintext);
  colony.crdnts = crdnts.crdnts;
  colony.width = crdnts.width;
  colony.height = crdnts.height;
  let cells = convertCrdntsToCells(colony.crdnts, colony.width, colony.height);
  colony.rle = convertCellsToRle(cells);
}

function convertCrdntsToCells(crdnts, width, height) { // Преобразовать координаты в клетки.
  let cells = []; // Двумерный массив клеток фигуры.
  for (let i = 0; i < height; i++) {
    cells[i] = [];
    for (let j = 0; j < width; j++) {
      cells[i][j] = 0;
    }
  }
  for (let [x, y] of crdnts) {
    cells[y][x] = 1; // Координаты меняются местами.
  }
  for (let item of cells) {
    for (let i = item.length - 1; i >= 0; i--) {
      if (item[i] === 0) {
        item.pop(); // Удаление висячих нулей.
      } else {
        break;
      }
    }
  }
  return cells;
}

function convertCellsToRle(cells) { // Преобразовать массив клеток в RLE-паттерн.
  return cells.map(item => item.join('')).join('$').replace(/0/g, 'b').replace(/1/g, 'o')
    .replace(/b{2,}/g, match => match.length + 'b').replace(/o{2,}/g, match => match.length + 'o')
    .replace(/\${2,}/g, match => match.length + '$') + '!';
}

function enterDataIntoColonyFromWorld() { // Внести данные в объект "colony" из мира.
  const coords = convertNativeCrdntsToCrdnts(getNativeCrdnts()); // Массив координат и размер колонии.
  colony.crdnts = coords.crdnts;
  colony.width = coords.width;
  colony.height = coords.height;
  colony.name = inptCustomName.value;
  colony.author = inptCustomAuthor.value;
  colony.comments = inptCustomComments.value.split('\n');
  colony.rule = [arrCellBirthRule, arrCellSurvivalRule];
  let cells = convertCrdntsToCells(colony.crdnts, colony.width, colony.height);
  colony.rle = convertCellsToRle(cells);
  colony.plaintext = convertCellsToPlaintext(cells);
}

function convertNativeCrdntsToCrdnts(nativeCrdnts) { // Преобразовать нативные координаты в координаты.
  const nativeCrdntsX = []; // Массив для X-координат.
  const nativeCrdntsY = []; // Массив для Y-координат.
  for (const [x, y] of nativeCrdnts) {
    nativeCrdntsX.push(x);
    nativeCrdntsY.push(y);
  }
  let minNativeCrdntsX = nativeCrdntsX.reduce((a, b) => a < b ? a : b); // Минимальная X-координата.
  let minNativeCrdntsY = nativeCrdntsY.reduce((a, b) => a < b ? a : b); // Минимальная Y-координата.
  let maxNativeCrdntsX = nativeCrdntsX.reduce((a, b) => a > b ? a : b); // Максимальная X-координата.
  let maxNativeCrdntsY = nativeCrdntsY.reduce((a, b) => a > b ? a : b); // Максимальная Y-координата.
  let width = maxNativeCrdntsX - minNativeCrdntsX + 1; // Ширина колонии.
  let height = maxNativeCrdntsY - minNativeCrdntsY + 1; // Высота колонии.
  let crdnts = nativeCrdnts.map(([x, y]) => [x - minNativeCrdntsX, y - minNativeCrdntsY]); // Координаты колонии сброшенные к началу.
  return { crdnts, width, height };
}

function convertCellsToPlaintext(cells) { // Преобразовать массив клеток в Plaintext-паттерн.
  return cells.map(item => item.join('')).join('\n').replace(/0/g, '.').replace(/1/g, 'O');
}

// ОЧИСТКА ПОЛЕЙ ВВОДА.
const btnClearInpts = document.querySelector('#btnClearInpts'); // Кнопка очистки полей ввода.
const inptsCustomData = // Поля ввода пользовательских данных.
  document.querySelectorAll('.panel_toggle_custom-colony input, .panel_toggle_custom-colony textarea')

inptsCustomData.forEach(e => e.addEventListener('input', () => {
  btnClearInpts.disabled = (inptCustomName.value || inptCustomAuthor.value || inptCustomComments.value || inptCustomPattern.value) ?
    false : true;
}));

btnClearInpts.addEventListener('click', () => {
  inptCustomName.value = '';
  inptCustomAuthor.value = '';
  inptCustomComments.value = '';
  inptCustomPattern.value = '';
  btnClearInpts.disabled = true;
});

// ПОКАЗ ИНФОРМАЦИОННОГО ОКНА ПРИ НАВЕДЕНИИ НА ИКОНКУ ВОПРОСА ВВОДА КОЛЬЗОВАТЕЛЬСКОГО ПАТТЕРНА.
const btnInfoCustomPattern = document.querySelector('#btnInfoCustomPattern'); // Иконка вопроса о вводе кользовательского паттерна.

btnInfoCustomPattern.addEventListener('click', () => {
  infoWindowType.key = 'information';
  showInfoWindow(`Поле ввода для паттернов колонии: <a href="https://conwaylife.com/wiki/Run_Length_Encoded">RLE</a> или
<a href="https://conwaylife.com/wiki/Plaintext">Plaintext</a>.<br>
Если оставить поле ввода пустым, сохранится RLE-паттерн колонии находящейся на карте.`);
});

// ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЬСКИХ КОЛОНИЙ В СЕЛЕКТ ПРИ ЗАГРУЗКЕ.
const optFirstSlctCustomColony = // Первый "option" селекта пользовательских колоний.
  document.querySelector('#slctCustomColony option[value="0"]');
const wrapperSlctCustomColony = document.querySelector('#wrapperSlctCustomColony'); // Обёртка селекта пользовательских колоний.

window.addEventListener('load', addCustomColonyToSelect);

function addCustomColonyToSelect() { // Добавить пользовательские колоний в селект пользовательских колоний.
  if (localStorage.length) {
    for (let i = 0; i < localStorage.length; i++) {
      slctCustomColony.insertAdjacentHTML('beforeend', `<option value="${localStorage.key(i)}">${localStorage.key(i)}</option>`);
    }
    wrapperSlctCustomColony.classList.remove('disabled');
  } else {
    optFirstSlctCustomColony.textContent = 'Здесь будут ваши колонии';
    slctCustomColony.disabled = true;
    wrapperSlctCustomColony.classList.add('disabled');
  }
}

// ДОБАВЛЕНИЕ ПРОСЛУШИВАТЕЛЕЙ СОБЫТИЯ ДЛЯ СЕЛЕКТА ПОЛЬЗОВАТЕЛЬСКИХ КОЛОНИЙ.
slctCustomColony.addEventListener('click', openOrCloseSelectCustomColonies);
slctCustomColony.addEventListener('change', openOrCloseSelectCustomColonies);
slctCustomColony.addEventListener('blur', openOrCloseSelectCustomColonies);

function openOrCloseSelectCustomColonies() { // Открыть или закрыть селект пользовательских колоний.
  if (wrapperSlctCustomColony.classList.contains('open')) {
    wrapperSlctCustomColony.classList.remove('open');
    wrapperSlctCustomColony.classList.add('close');
  } else {
    wrapperSlctCustomColony.classList.remove('close');
    wrapperSlctCustomColony.classList.add('open');
  }
}

// ВЫВОД ПОЛЬЗОВАТЕЛЬСКИХ КОЛОНИЙ НА КАРТУ.
const otherData = document.querySelector('#otherData'); // Прочие данные в разделе "Предпросмотр колонии".

slctCustomColony.addEventListener('change', e => { // При изменении: отрисовка колонии на предпросмотре и отрисовка тени на карте.
  isShadowMode = true;
  enterDataIntoColonyFromFullRle(localStorage.getItem(e.target.value));
  displayOtherColonyData();
  drawPreviewCanvas();
  slctCustomColony.blur();
  nameColony.textContent = e.target.value;
  optFirstSlctCustomColony.textContent = e.target.value;
  btnResetColony.disabled = false;
  btnDelColony.disabled = false;
});

function displayOtherColonyData() { // Отображение прочих данных в раздел "Предпросмотр колонии".
  let authorStr = (colony.author) ? `<b>Автор:</b> ${colony.author}<br>` : ''; // Строка автора.
  let commentsStr = // Строка комментариев.
    (colony.comments.length) ? `<b>Комментарии:</b><br>${colony.comments.join('<br>')}<br>` : '';
  let widthLastNum = colony.width.toString().slice(-1); // Последняя цифра ширины.
  let widthLastTwoNum = colony.width.toString().slice(-2); // Последние 2 цифры ширины.
  let widthCellsNoun = // Существительное "клетки" ширины.
    (widthLastTwoNum === '11' || widthLastTwoNum === '12' || widthLastTwoNum === '13' || widthLastTwoNum === '14')
      ? 'клеток' : (widthLastNum === '1')
        ? 'клетка' : (widthLastNum === '2' || widthLastNum === '3' || widthLastNum === '4')
          ? 'клетки' : 'клеток';
  let widthStr = `<b>Ширина:</b> ${colony.width} ${widthCellsNoun}<br>`; // Строка ширины.
  let heightLastNum = colony.height.toString().slice(-1); // Последняя цифра высоты.
  let heightLastTwoNum = colony.height.toString().slice(-2); // Последние 2 цифры высоты.
  let heightCellsNoun = // Существительное "клетки" высоты.
    (heightLastTwoNum === '11' || heightLastTwoNum === '12' || heightLastTwoNum === '13' || heightLastTwoNum === '14')
      ? 'клеток' : (heightLastNum === '1')
        ? 'клетка' : (heightLastNum === '2' || heightLastNum === '3' || heightLastNum === '4')
          ? 'клетки' : 'клеток';
  let heightStr = `<b>Высота:</b> ${colony.height} ${heightCellsNoun}<br>`; // Строка высоты.
  let ruleStr = `<b>Правило:</b> B${colony.rule[0].join('')}\/S${colony.rule[1].join('')}`; // Строка правила.
  otherData.innerHTML = authorStr + commentsStr + widthStr + heightStr + ruleStr;
}

// УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЬСКОЙ КОЛОНИИ.
const btnDelColony = document.querySelector('#btnDelColony'); // Кнопка удаления пользовательской колонии.

btnDelColony.addEventListener('click', () => { // При нажатии: запуск выбора для удаления пользовательской колонии.
  infoWindowType.key = 'delCustomColony';
  showInfoWindow(`Удалить колонию под названием «${nameColony.textContent}»?`);
});

// ПОКАЗ ПАТТЕРНА КОЛОНИИ И СОХРАНЕНИЕ СТРОКИ ПАТТЕРНА В БУФЕР ОБМЕНА.
const btnShowRle = document.querySelector('#btnShowRle'); // Кнопка показа RLE-паттерна.
const btnShowPlaintext = document.querySelector('#btnShowPlaintext'); // Кнопка показа Plaintext-паттерна.
const btnSaveClipboard = document.querySelector('#btnSaveClipboard'); // Кнопка копирования паттерна в буфер обмена.
const colonyPattern = document.querySelector('#colonyPattern'); // Текст строки паттерна.
const numberOfColonyCells = document.querySelector('#numberOfColonyCells'); // Текст количества клеток колонии.

btnShowRle.addEventListener('click', () => { // При нажатии: обновление строки шаблона.
  if (isShadowMode) resetColony();
  if (checkWorldForCells()) {
    enterDataIntoColonyFromWorld();
    colony.fullRle = getFullRleWithDataFromInpts();
    colonyPattern.textContent = colony.fullRle;
    numberOfColonyCells.textContent = `Количество клеток: ${colony.crdnts.length}`;
    btnSaveClipboard.disabled = false;
  } else {
    btnSaveClipboard.disabled = true;
    numberOfColonyCells.textContent = `Количество клеток: 0`;
    infoWindowType.key = 'information';
    showInfoWindow(`Карта пуста, создайте свою колонию!`);
  }
});

btnShowPlaintext.addEventListener('click', () => { // При нажатии: обновление строки шаблона.
  if (isShadowMode) resetColony();
  if (checkWorldForCells()) {
    enterDataIntoColonyFromWorld();
    colony.fullPlaintext = getFullPlaintextWithDataFromInpts();
    colonyPattern.textContent = colony.fullPlaintext;
    numberOfColonyCells.textContent = `Количество клеток: ${colony.crdnts.length}`;
    btnSaveClipboard.disabled = false;
  } else {
    btnSaveClipboard.disabled = true;
    numberOfColonyCells.textContent = `Количество клеток: 0`;
    infoWindowType.key = 'information';
    showInfoWindow(`Карта пуста, создайте свою колонию!`);
  }
});

function getFullPlaintextWithDataFromInpts() { // Получить полный Plaintext-паттерн с данными из полей ввода.
  let name = (inptCustomName.value) ? `!Name: ${inptCustomName.value}\n` : ''; // Имя колонии.
  let author = (inptCustomAuthor.value) ? `!Author: ${inptCustomAuthor.value}\n` : ''; // Автор колонии.
  let rule = `!Rule: b${colony.rule[0].join('')}/s${colony.rule[1].join('')}\n`; // Правило.
  let comments = // Комментарии для колонии.
    (inptCustomComments.value) ? inptCustomComments.value.split('\n').map(item => `!${item}\n`).join('') : '';
  let plaintext = colony.plaintext; // Plaintext-паттерн.
  return name + author + rule + comments + plaintext;
}

btnSaveClipboard.addEventListener('click', () => { // При нажатии: копирование паттерна в буфер обмена.
  navigator.clipboard.writeText(colonyPattern.textContent)
    .then(() => {
      infoWindowType.key = 'information';
      showInfoWindow(`Паттерн скопирован в буфер обмена!`);
    })
    .catch(() => {
      infoWindowType.key = 'information';
      showInfoWindow(`<string>Паттерн НЕ скопировался в буфер обмена!</string><br>Выделите паттерн вручную и скопируйте`);
    });
});

//-----------------------------------------------------------------------------------------------------------------------------------------
//БЛОК ИНФОРМАЦИОННОГО ОКНА

const infoWindowType = { // Объект видов информационного окна.
  key: '', // Свойство для собственных ключей.
  bigWorld: 'noOk', // Генерация большого мира: более 1_000_000 клеток (одноразовая информация).
  firstCustomColony: 'noOk', // Сохранение первой колонии (одноразовая информация).
  delCustomColony: 'yesOrNo', // Удаление пользовательской колонии (многоразовый выбор).
  rewriteCustomColony: 'yesOrNo', // Перезапись пользовательской колонии (многоразовый выбор).
  bigColony: 'yesOrNo', // Увеличение мира под размер большой колонии (многоразовый выбор).
  information: 'info', // Различная многоразовая информация.
}

const warningPanel = document.querySelector('#warningPanel'); // Панель информационного окна.
const warningText = document.querySelector('#warningText'); // Текст панели информационного окна.

function showInfoWindow(html) { // Показать информационное окно.
  warningPanel.classList.remove('none');
  warningText.innerHTML = html;
  if (infoWindowType[infoWindowType.key] === 'noOk' ||
    infoWindowType[infoWindowType.key] === 'info') {
    btnYes.classList.add('none');
    btnNo.classList.add('none');
    btnOk.classList.remove('none');
    btnOk.focus();
  } else if (infoWindowType[infoWindowType.key] === 'yesOrNo') {
    btnYes.classList.remove('none');
    btnNo.classList.remove('none');
    btnOk.classList.add('none');
    btnNo.focus();
  }
}

const btnOk = document.querySelector('#ok'); // Кнопка "ОК" информационного окна.
const btnYes = document.querySelector('#yes'); // Кнопка "ДА" информационного окна.
const btnNo = document.querySelector('#no'); // Кнопка "НЕТ" информационного окна.

btnOk.addEventListener('click', () => { // При нажатии: изменение ключа информационного окна с "noOk" на "Ok".
  if (infoWindowType[infoWindowType.key] === 'noOk') infoWindowType[infoWindowType.key] = 'Ok';
  hideInformationWindow();
});

function hideInformationWindow() { // Cкрыть информационное окно.
  warningPanel.classList.add('none');
  infoWindowType.key = '';
}

btnNo.addEventListener('click', () => {
  if (infoWindowType.key === 'bigColony') resetColony();
  hideInformationWindow();
});

btnYes.addEventListener('click', () => {
  if (infoWindowType.key === 'delCustomColony') {
    delCustomColony();
    hideInformationWindow();
  } else if (infoWindowType.key === 'rewriteCustomColony') {
    if (infoWindowType.firstCustomColony === "noOk") {
      showWarningAboutSavingColonies();
    } else {
      hideInformationWindow();
    }
    localStorage.setItem(inptCustomName.value, colony.fullRle);
    inptCustomName.value = '';
    inptCustomAuthor.value = '';
    inptCustomComments.value = '';
    inptCustomPattern.value = '';
    btnClearInpts.disabled = true;
  } else if (infoWindowType.key === 'bigColony') {
    increaseWorldSizeForColonySize();
    changeSizeOfWorld();
    if (numberOfCellsWidthWorld * numberOfCellsHeightWorld > 1_000_000) {
      if (infoWindowType.bigWorld === 'Ok') {
        hideInformationWindow();
      } else {
        showBigWorldWarning();
      }
    } else {
      hideInformationWindow();
    }
  }
});

function delCustomColony() { // Удалить пользовательскую колонию.
  localStorage.removeItem(nameColony.textContent);
  document.querySelector(`#slctCustomColony option[value="${nameColony.textContent}"]`).remove();
  clearPreviewCanvas();
}

btnOk.addEventListener('mouseover', () => btnOk.blur());

btnYes.addEventListener('mouseover', () => {
  btnYes.blur();
  btnNo.blur();
});

btnNo.addEventListener('mouseover', () => {
  btnYes.blur();
  btnNo.blur();
});

function increaseWorldSizeForColonySize() { // Увеличить размера мира под размер колонии.
  if (colony.width > numberOfCellsWidthWorld || colony.height > numberOfCellsHeightWorld) {
    numberOfCellsWidthWorld = numberOfCellsHeightWorld = Math.max(colony.width, colony.height);
    inptNumberOfCellsWidthWorld.value = numberOfCellsWidthWorld;
    inptNumberOfCellsHeightWorld.value = numberOfCellsHeightWorld;
  }
  if (colony.width < maxNumberOfCellsWidthCanvas[cellSize] &&
    colony.height < maxNumberOfCellsHeightCanvas[cellSize]) {
    fitWorldIntoWindow();
  }
  if (colony.width > maxNumberOfCellsWidthCanvas[cellSize] ||
    colony.height > maxNumberOfCellsHeightCanvas[cellSize]) {
    if (cellSize === 0.25) return;
    zoomOutOfWorld();
    increaseWorldSizeForColonySize();
  }
}

//-----------------------------------------------------------------------------------------------------------------------------------------
// ПРОЧИЕ ФУНКЦИИ.

// УПРАВЛЕНИЕ С КЛАВИАТУРЫ.
let isInputOnFocus = false; // Переменная фокуса полей ввода данных (для отключения управления с клавиатуры).
const inpts = document.querySelectorAll('.inpt'); // Поля ввода.

inpts.forEach(item => {
  item.addEventListener('focus', () => isInputOnFocus = true);
  item.addEventListener('blur', () => isInputOnFocus = false);
});

window.addEventListener('keyup', e => {
  if (!isInputOnFocus) {
    switch (e.code) {
      case 'KeyQ': flipHorizontally(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas();
        break;
      case 'KeyW': flipVertically(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas();
        break;
      case 'KeyE': turnLeft(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas();
        break;
      case 'KeyR': turnRight(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas();
        break;
      case 'KeyT': rotate180deg(); drawShadow(); displayOtherColonyData(); drawPreviewCanvas();
        break;
      case 'KeyA': startOrStopGame();
        break;
      case 'KeyD': turnTrackModeOnOrOff();
        break;
      case 'KeyF': removeOrDrawGrid();
        break;
      case 'KeyG': fitWorldIntoWindow();
        break;
      case 'NumpadAdd': zoomInOfWorld();
        break;
      case 'Equal': zoomInOfWorld();
        break;
      case 'NumpadSubtract': zoomOutOfWorld();
        break;
      case 'Minus': zoomOutOfWorld();
        break;
      case 'Delete': clearGame();
        break;
      case 'NumpadDecimal': clearGame();
        break;

    }
  }
});

window.addEventListener('keydown', e => {
  if (!isInputOnFocus) {
    switch (e.code) {
      case 'KeyS': makeOneStepOfGame();
        break;
      case 'ArrowLeft': scrollLeft();
        break;
      case 'ArrowUp': scrollUp();
        break;
      case 'ArrowRight': scrollRight();
        break;
      case 'ArrowDown': scrollDown();
        break;
    }
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------
// БЛОК ДЛЯ ОФОРМЛЕНИЯ СТРАНИЦЫ.

// ОТКРЫТИЕ/ЗАКРЫТИЕ ВЫПАДАЮЩИХ-СМЕНЯЮЩИХСЯ ПАНЕЛЕЙ.
const btnsDropDown = document.querySelectorAll('.btn_tab_drop-down_toggle'); // Кнопки для выпадающих-сменяющихся панелей.
const divsPanelsDropDown = document.querySelectorAll('.panel_drop-down_toggle'); // Выпадающие-сменяющиеся панели.
const dropDownToggleBox = document.querySelector('#dropDownToggleBox'); // Блок выпадающих-сменяющихся панелей.

for (let i = 0; i < btnsDropDown.length; i++) {
  btnsDropDown[i].addEventListener('click', () => {
    if (btnsDropDown[i].classList.contains('open')) {
      btnsDropDown[i].classList.remove('open');
      btnsDropDown[i].classList.add('close');
      divsPanelsDropDown[i].classList.add('none');
      dropDownToggleBox.classList.add('none');
      for (let i = 0; i < btnsDropDown.length; i++) {
        btnsDropDown[i].classList.add('all-close');
      }
    } else {
      for (let i = 0; i < btnsDropDown.length; i++) {
        btnsDropDown[i].classList.remove('open');
        btnsDropDown[i].classList.add('close');
        divsPanelsDropDown[i].classList.add('none');
        btnsDropDown[i].classList.remove('all-close');
      }
      // Открытие соответствующей панели.
      btnsDropDown[i].classList.remove('close');
      btnsDropDown[i].classList.add('open');
      divsPanelsDropDown[i].classList.remove('none');
      dropDownToggleBox.classList.remove('none');
    }
  });
}

// ВЫПАДАЮЩИЕ СУБПАНЕЛИ ВКЛАДКИ КОЛОНИИ.
const btnsTabDropDownColony = document.querySelectorAll('.btn_tab_drop-down_colony'); // Кнопки открытия/скрытия субпанелей вкладки колонии.
const panelsDropDownColony = document.querySelectorAll('.panel_drop-down_colony'); // Выпадающие субпанели вкладки колонии.

for (let i = 0; i < btnsTabDropDownColony.length; i++) {
  btnsTabDropDownColony[i].addEventListener('click', () => { // При нажатии: открытие/закрытие выпадающих панелей.
    if (btnsTabDropDownColony[i].classList.contains('open')) {
      btnsTabDropDownColony[i].classList.remove('open');
      btnsTabDropDownColony[i].classList.add('close');
      panelsDropDownColony[i].classList.add('none');
    } else {
      btnsTabDropDownColony[i].classList.remove('close');
      btnsTabDropDownColony[i].classList.add('open');
      panelsDropDownColony[i].classList.remove('none');
    }
  });
}

// СМЕНЯЮЩИЕСЯ ПАНЕЛИ.
const subTabBtns = document.querySelectorAll('.btn_tab_toggle'); // Кнопки для субпанелей колоний.
const subPanels = document.querySelectorAll('.panel_toggle'); // Субпанели колоний.

for (let i = 0; i < subTabBtns.length; i++) {
  subTabBtns[i].addEventListener('click', () => { // При нажатии: вывод соответствкющей субпанели.
    for (let i = 0; i < subTabBtns.length; i++) {
      subTabBtns[i].classList.remove('open');
      subTabBtns[i].classList.add('close');
      subPanels[i].classList.add('none');
    }
    // Открытие соответствующей субпанели.
    subTabBtns[i].classList.remove('close');
    subTabBtns[i].classList.add('open');
    subPanels[i].classList.remove('none');
  });
}

// СБРОС ЗНАЧЕНИЙ ВСЕХ СЕЛЕКТОВ.
window.addEventListener('click', () => { // При нажатии: сброс селектов.
  const slctsDefaultColonies = document.querySelectorAll('.slct_default-colony'); // Селекты готовых колоний.
  slctsDefaultColonies.forEach(e => e.value = 0);
  slctCustomColony.value = 0;
});

// РЕЖИМ ШИРОКОГО ВИДА ВКЛАДКИ КОЛОНИЙ.
const btnLandscapeMode = document.querySelector('#btnLandscapeMode'); // Кнопка изменения видов вкладки колоний.

let isLandscapeMode = false; // Режим широкого вида окна вкладки.

btnLandscapeMode.addEventListener('click', () => { // При нажатии: смена видов вкладки.
  if (document.body.clientWidth > 620) {
    if (document.body.classList.contains('landscape')) {
      showPortraitTabColony();
      isLandscapeMode = false;
    } else {
      showLandscapeTabColony();
      isLandscapeMode = true;
    }
  } else {
    if (document.body.classList.contains('landscape')) {
      showPortraitTabColony(); // Для возможности скрытия вкладки при повороте экрана.
      isLandscapeMode = false;
    } else {
      infoWindowType.key = 'information';
      const html = (screen.orientation.type === 'portrait-primary')
        ? `Ширина экрана не позволяет показать широкий вид вкладки, попробуйте изменить положение экрана на альбомный`
        : `К сожалению, ширина экрана не позволяет показать широкий вид вкладки`;
      showInfoWindow(html);
    }
  }
});

window.addEventListener('load', () => { if (document.body.clientWidth > 620) isLandscapeMode = true });

const btnDropDownToggleSettings = document.querySelector('#btnDropDownToggleSettings'); // Кнопка выпадающе-сменяющейся панели настроек.

btnDropDownToggleSettings.addEventListener('click', () => { // При нажатии: сброс широкого вида вкладки.
  if (document.body.classList.contains('landscape')) document.body.classList.remove('landscape');
});

const btnDropDownToggleColony = document.querySelector('#btnDropDownToggleColony'); // Кнопка выпадающе-сменяющейся панели колоний.

btnDropDownToggleColony.addEventListener('click', () => { // При нажатии: показ широкого вида вкладки (при ширине экрана более 620px).
  if (isLandscapeMode) showLandscapeTabColony();
  if (document.body.clientWidth < 620) { showPortraitTabColony(); isLandscapeMode = false; }
});

function showPortraitTabColony() { // Показать узкий вид вкладки.
  document.body.classList.remove('landscape');
  btnLandscapeMode.textContent = 'Широкий вид вкладки';
  btnsTabDropDownColony.forEach(e => { e.classList.remove('open'); e.classList.add('close'); });
  panelsDropDownColony.forEach(e => e.classList.add('none'));
}

function showLandscapeTabColony() { // Показать широкий вид вкладки.
  document.body.classList.add('landscape');
  btnLandscapeMode.textContent = 'Узкий вид вкладки';
  btnsTabDropDownColony.forEach(e => { e.classList.remove('close'); e.classList.add('open'); });
  panelsDropDownColony.forEach(e => e.classList.remove('none'));
}