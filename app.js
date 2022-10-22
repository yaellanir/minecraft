const board = document.querySelector(".board");
const restartButton = document.querySelector(".restart-button");
const startButton = document.querySelector(".start");
const landingPage = document.querySelector(".background");
const tools = document.querySelectorAll(".tool");
const inventory = document.querySelectorAll(".nature-element");
const matrix = [];
// const gridElements = [];
let numOfRows;
let numOfColumns;
let skyEnd;

// event listeners
startButton.addEventListener("click", (e) => {
  landingPage.style.display = "none";
});
restartButton.addEventListener("click", restart);
board.addEventListener("click", handleBoardClick);
tools.forEach((tool) => {
  tool.addEventListener("click", pickTool);
});
inventory.forEach((inv) => {
  inv.addEventListener("click", pickInventory);
});

// consts
let gameState;

const toolRules = {
  axe: ["trunk", "leaves"],
  pickaxe: ["rock"],
  shovel: ["dirt", "grass"],
};

// World Building
function setGrid() {
  const gridHeight = parseInt(window.getComputedStyle(board).height);
  const gridWidth = parseInt(window.getComputedStyle(board).width);
  const min = gridHeight < gridWidth ? gridHeight : gridWidth;
  board.style.gridTemplateRows = `repeat(auto-fill, ${min * 0.04}px)`;
  board.style.gridTemplateColumns = `repeat(auto-fill,${min * 0.04}px)`;
}

setGrid();

function getComputedRowsColumns() {
  const gridComputedStyle = window.getComputedStyle(board);
  // get number of grid rows
  numOfRows = gridComputedStyle
    .getPropertyValue("grid-template-rows")
    .split(" ").length;
  // get number of grid columns
  numOfColumns = gridComputedStyle
    .getPropertyValue("grid-template-columns")
    .split(" ").length;
  console.log(numOfRows, numOfColumns);
}

function buildMatrix() {
  for (let i = 0; i < numOfRows; i++) {
    let row = Array.from({ length: numOfColumns }, (_, i) => null);
    matrix.push(row);
  }
}
const initializeGameState = () => {
  gameState = {
    activeTool: null,
    activeNatureElement: null,
    activeToolHTMLEl: null,
    activeNatureElementHTMLEl: null,
    inventory: {
      rock: 0,
      leaves: 0,
      trunk: 0,
      dirt: 0,
      grass: 0,
    },
    addToInventory: function (natureElement) {
      this.inventory[natureElement] += 1;
      document.querySelector(`.${natureElement} + h4`).textContent =
        this.inventory[natureElement];
    },
    removeFromInventory: function (natureElement) {
      this.inventory[natureElement] -= 1;
      document.querySelector(`.${natureElement} + h4`).textContent =
        this.inventory[natureElement];
    },
  };
};
initializeGameState();

function drawWorld() {
  skyEnd = Math.floor(matrix.length * 0.8);
  matrix.forEach((row, rowNum) => {
    row.forEach((column, colNum) => {
      // Create sky
      if (rowNum < skyEnd) {
        createBlock("sky", `${rowNum}-${colNum}`);
      }
      //Create Grass
      if (rowNum == skyEnd) {
        createBlock("grass", `${rowNum}-${colNum}`);
      }
      // Create Dirt
      if (rowNum > skyEnd) {
        createBlock("dirt", `${rowNum}-${colNum}`);
      }
    });
  });
  generateClouds();
  generateTrees();
  generateRocks();
  console.dir(board);
}

function generateClouds() {
  let cloud1StartX = Math.floor(skyEnd * 0.3);
  let cloud1StartY = Math.floor(numOfColumns * 0.1);
  let cloud2StartX = Math.floor(skyEnd * 0.4);
  let cloud2StartY = Math.floor(numOfColumns * 0.6);
  const cloudHeight = 3;
  const cloudWidth = 5;
  createDynamicElement(
    "cloud",
    cloudHeight,
    cloudWidth,
    cloud1StartX,
    cloud1StartY
  );
  createDynamicElement("cloud", 2, 3, cloud2StartX, cloud2StartY + 2);
}

function generateTrees() {
  const trunkHeight = 5;
  const trunkWidth = 2;
  const leavesHeight = 4;
  const leavesWidth = 4;
  let trunk1StartX = Math.floor(skyEnd - trunkHeight);
  let trunk1StartY = Math.floor(numOfColumns * 0.2);
  let leaves1StartX = Math.floor(trunk1StartX - leavesHeight);
  let leaves1StartY = Math.floor(trunk1StartY - 1);
  let trunk2StartX = Math.floor(skyEnd - trunkHeight);
  let trunk2StartY = Math.floor(numOfColumns * 0.7);
  let leaves2StartX = Math.floor(trunk2StartX - leavesHeight + 3);
  let leaves2StartY = Math.floor(trunk2StartY - 1);

  createDynamicElement(
    "trunk",
    trunkHeight,
    trunkWidth,
    trunk1StartX,
    trunk1StartY
  );
  createDynamicElement(
    "leaves",
    leavesHeight,
    leavesWidth,
    leaves1StartX,
    leaves1StartY
  );
  createDynamicElement(
    "trunk",
    trunkHeight,
    trunkWidth,
    trunk2StartX,
    trunk2StartY
  );
  createDynamicElement(
    "leaves",
    leavesHeight,
    leavesWidth,
    leaves2StartX,
    leaves2StartY
  );
}

function generateRocks() {
  const rockHeight = 1;
  const rockWidth = 1;
  const rock1StartX = skyEnd - rockHeight;
  const rock1StartY = Math.floor(numOfColumns * 0.6);
  const rock2StartX = skyEnd - 2;
  const rock2StartY = Math.floor(numOfColumns * 0.35);
  createDynamicElement("rock", rockHeight, rockWidth, rock1StartX, rock1StartY);
  createDynamicElement("rock", 2, 2, rock2StartX, rock2StartY);
  createDynamicElement("rock", 2, 3, skyEnd-2, Math.floor(numOfColumns * 0.9));
}
function createBlock(classname, position) {
  const block = document.createElement("div");
  block.classList.add(`${classname}`);
  block.dataset.position = position;
  board.append(block);
  // gridElements.push(block);
}
function createDynamicElement(natureElement, height, width, startX, startY) {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const element = document.querySelector(
        `[data-position="${startX + i}-${startY + j}"]`
      );
      element.className = natureElement;
    }
  }
}

getComputedRowsColumns();
buildMatrix();
drawWorld();
console.log(matrix);

// event functions
function handleBoardClick(e) {
  const currentElement = e.target;
  const currentTool = gameState.activeTool;
  const currentNatureElement = gameState.activeNatureElement;
  if (e.target.classList.contains("board")) {
    return;
  }
  if (!currentTool && !gameState.activeNatureElement) {
    return;
  }
  if (currentTool) {
    if (toolRules[currentTool].includes(currentElement.className)) {
      gameState.addToInventory(currentElement.className);
      removeBlockFromBoard(currentElement);
      return;
    } else {
      addErrorAnimation([gameState.activeToolHTMLEl, currentElement]);
    }
  }
  if (currentNatureElement && gameState.inventory[currentNatureElement] > 0) {
    if (currentElement.className === "sky") {
      addBlockFromInventory(currentElement, currentNatureElement);
      gameState.removeFromInventory(currentElement.className);
    } else {
      addErrorAnimation([gameState.activeNatureElementHTMLEl, currentElement]);
    }
  }

  console.dir(currentElement);
}

function pickTool(e) {
  const currentTool = e.target.classList[1];
  e.target.classList.add("active");
  // Remove old active classes
  gameState.activeNatureElement = null;
  gameState.activeNatureElementHTMLEl?.classList.remove("active");
  gameState.activeNatureElementHTMLEl = null;
  gameState.activeToolHTMLEl?.classList.remove("active");
  // Add new actives
  gameState.activeTool = currentTool;
  gameState.activeToolHTMLEl = e.target;
  gameState.activeToolHTMLEl?.classList.add("active");

  console.log(gameState);
}
function pickInventory(e) {
  const currentInventory = e.target.classList[1];
  e.target.classList.add("active");
  // Remove old active classes
  gameState.activeTool = null;
  gameState.activeNatureElementHTMLEl?.classList.remove("active");
  gameState.activeToolHTMLEl?.classList.remove("active");
  gameState.activeToolHTMLEl = null;
  // Add new actives
  gameState.activeNatureElement = currentInventory;
  gameState.activeNatureElementHTMLEl = e.target;
  console.log(gameState);
}
function addBlockFromInventory(element, className) {
  element.className = className;
}
function removeBlockFromBoard(element) {
  element.className = "sky";
}


function restart() {
  initializeGameState();
  board.textContent = "";
  drawWorld();
  document.querySelectorAll(".nature-element + h4").forEach((e) => {
    e.textContent = 0;
  });
}
function addErrorAnimation(elements) {
  elements.forEach((element) => {
    element.classList.add("error");
    setTimeout(() => {
      element.classList.remove("error");
    }, 1000);
  });
}

// todo - randomize world


// function setNumOfRowsAndColumns() {
//   const height = window.innerHeight;
//   const width = window.innerWidth;
//   const min = height < width ? "height" : "width";
//   min === "height" ? (numOfRows = 10) : (numOfColumns = 10);
//   if (height < width) {
//     numOfColumns = Math.floor(width / (height * 0.09));
//   } else if (height > width) {
//     numOfRows = Math.floor(height / (width * 0.09));
//   } else {
//     numOfColumns = 10;
//     numOfRows = 10;
//   }
//   console.log({ numOfRows, numOfColumns });
// }
// setNumOfRowsAndColumns();
