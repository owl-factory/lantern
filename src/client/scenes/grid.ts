import { GridType, SceneController } from "./SceneController";
import { COS_30 } from "./consts";

export function setGridType(this: SceneController, gridType: GridType): void {
  this.gridType = gridType;
  this.buildGrid();
}

export function getGridTypeReadable(this: SceneController): string {
  switch (this.gridType) {
    case GridType.None:
      return "None";
    case GridType.Squares:
      return "Squares";
    case GridType.HorizontalHex:
      return "Horizontal Hexes";
    case GridType.VerticalHex:
      return "Vertical Hexes";
  }
}

/**
 * Builds the grid for the current scene controller
 */
export function buildGrid(this: SceneController): void {
  this.grid.clear();
  this.grid.lineStyle(1, 0x555555, 1);

  switch (this.gridType) {
    case GridType.Squares:
      this.buildSquareGrid();
      break;
    case GridType.HorizontalHex:
      this.buildHorizontalHexGrid();
      break;
    case GridType.VerticalHex:
      this.buildVerticalHexGrid();
      break;
    case GridType.None:
    default:
      return;
  }

}

/**
 * Runs a loop to set up a horizontal hex grid
 */
export function buildHorizontalHexGrid(this: SceneController): void {
  // TODO - move line style to a different function
  const xUnits = Math.ceil(this.scene.width / this.gridSize);
  const yUnits = Math.ceil(this.scene.height / this.gridSize); // TODO - handle cos


  for(let x = 0; x < xUnits; x++) {
    for(let y = 0; y < yUnits; y++) {
      this.buildHorizontalHex(x, y);
    }
  }
}

/**
 * Builds a single horizontal hex
 * @param x The nth horizontal hex
 * @param y The nth vertical hex
 */
export function buildHorizontalHex(this: SceneController, x: number, y: number): void {
  let yOffset = 0;
  if (x % 2 === 1) { yOffset = 0.5 * this.gridSize * COS_30; }
  const xOffset = -0.25 * this.gridSize * x;

  this.grid.moveTo((x + 0.25) * this.gridSize + xOffset, (y * this.gridSize * COS_30) + yOffset);
  this.grid.lineTo((x + 0.75) * this.gridSize + xOffset, (y * this.gridSize * COS_30) + yOffset);
  this.grid.lineTo((x + 1) * this.gridSize + xOffset, ((y + 0.5) * this.gridSize * COS_30) + yOffset);
  this.grid.lineTo((x + 0.75) * this.gridSize + xOffset, ((y + 1) * this.gridSize * COS_30) + yOffset);
  this.grid.lineTo((x + 0.25) * this.gridSize + xOffset, ((y + 1) * this.gridSize * COS_30) + yOffset);
  this.grid.lineTo(x * this.gridSize + xOffset, ((y + 0.5) * this.gridSize * COS_30) + yOffset);
  this.grid.lineTo((x + 0.25) * this.gridSize + xOffset, (y * this.gridSize * COS_30) + yOffset);
}

/**
 * Builds a vertical hex grid (hexes longest point is vertical)
 */
export function buildVerticalHexGrid(this: SceneController): void {
  const xUnits = Math.ceil(this.scene.width / this.gridSize); // TODO - handle cos
  const yUnits = Math.ceil(this.scene.height / this.gridSize);

  for(let x = 0; x < xUnits; x++) {
    for(let y = 0; y < yUnits; y++) {
      this.buildVerticalHex(x, y);
    }
  }
}

/**
 * Builds a single vertical hexagon
 * @param x The nth horizontal hex
 * @param y The nth vertical hex
 */
export function buildVerticalHex(this: SceneController, x: number, y: number): void {
  let xOffset = 0;
  if (y % 2 === 1) { xOffset = 0.5 * this.gridSize * COS_30; }
  const yOffset = (-0.25 * this.gridSize * y) + 0.25 * this.gridSize;

  this.grid.moveTo((x * this.gridSize * COS_30) + xOffset, y * this.gridSize + yOffset);
  this.grid.lineTo((x * this.gridSize * COS_30) + xOffset, ((y + 0.5) * this.gridSize) + yOffset);
  this.grid.lineTo(((x + 0.5) * this.gridSize * COS_30) + xOffset, ((y + 0.75) * this.gridSize) + yOffset);
  this.grid.lineTo(((x + 1) * this.gridSize * COS_30) + xOffset, ((y + 0.5) * this.gridSize) + yOffset);
  this.grid.lineTo(((x + 1) * this.gridSize * COS_30) + xOffset, (y * this.gridSize) + yOffset);
  this.grid.lineTo(((x + 0.5) * this.gridSize * COS_30) + xOffset, ((y - 0.25) * this.gridSize) + yOffset);
  this.grid.lineTo((x * this.gridSize * COS_30) + xOffset, y * this.gridSize + yOffset);
}

/**
 * Builds a square grid
 */
export function buildSquareGrid(this: SceneController): void {
  const xUnits = Math.ceil(this.scene.width / this.gridSize);
  const yUnits = Math.ceil(this.scene.height / this.gridSize);

  // Need to use these instead of referencing scene height/width. This is some weird hacky bullshit
  // Lines will not render on subsequent selections
  const height = this.scene.height;
  const width = this.scene.width;

  for (let x = 0; x <= xUnits; x++) {
    if (x === 0) {
      this.grid.moveTo(0, 0);
      this.grid.lineTo(0, height);
      continue;
    }
    this.grid.moveTo(x * this.gridSize, 0);
    this.grid.lineTo(x * this.gridSize, height);
  }

  for (let y = 0; y <= yUnits; y++) {
    if (y === 0) {
      this.grid.moveTo(0, 0.5);
      this.grid.lineTo(width, 0.5);
      continue;
    }
    this.grid.moveTo(0, y * this.gridSize - 0.5);
    this.grid.lineTo(width, y * this.gridSize - 0.5);
  }
}
