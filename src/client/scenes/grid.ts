import { SceneController } from "./SceneController";
import { COS_30 } from "./consts";
import { GridType } from "types/enums/scene";

/**
 * Calculates the number of grids in a given direction for the given dimensions.
 * Returns the number of grids, rounded up to the nearest whole number
 * @param pixelSize The size in pixels of the scene
 * @param gridSize The size of the grid tile
 * @param gridType The type of grid
 * @param direction The direction, either "horizontal" or "vertical"
 */
export function calculateGridCount(
  pixelSize: number,
  gridSize: number,
  gridType: GridType,
  direction: "horizontal" | "vertical"
): number {
  gridType = parseInt(gridType as unknown as string);
  if ((gridType) === GridType.None) {
    return pixelSize;
  }

  if ((gridType) === GridType.Squares) {
    return Math.ceil(pixelSize / gridSize);
  }

  if (
    (gridType === GridType.VerticalHex && direction === "vertical") ||
    (gridType === GridType.HorizontalHex && direction === "horizontal")
  ) {
    const apothem = gridSize / 0.866; // The length of a hex tile between two opposite points
    const res = (pixelSize - (apothem * 0.25)) / (apothem * 0.75) - 0.25;
    return Math.ceil(res);
  } else {
    return Math.ceil((pixelSize / gridSize) - 0.5);
  }
}

/**
 * Takes a number og grids, their size, type, and direction, and converts that into pixels
 * @param gridSize The size of the grid in pixels
 * @param gridCount The number of grid tiles in a direction
 * @param gridType The type of grid
 * @param direction The direction of the grid, either "vertical" or "horizontal"
 */
export function calculateGridToPixels(
  gridSize: number,
  gridCount: number,
  gridType: GridType,
  direction: "horizontal" | "vertical"
): number {
  gridType = parseInt(gridType as unknown as string);

  // TODO - examine this case to see what is passed in
  if (gridType === GridType.None) {
    return gridCount * gridSize;
  }

  if (gridType === GridType.Squares) {
    return gridCount * gridSize;
  }

  if (
    (gridType === GridType.VerticalHex && direction === "vertical") ||
    (gridType === GridType.HorizontalHex && direction === "horizontal")
  ) {
    const apothem = gridSize / 0.866; // The length of a hex tile between two opposite points
    const res = apothem * ((0.75 * gridCount) + 0.25);
    return Math.ceil(res);
  } else {
    return ((gridCount + 0.5) * gridSize);
  }
}

/**
 * Sets the grid type and rebuilds the grid
 * @param gridType The new grid type
 */
export function setGridType(this: SceneController, gridType: GridType): void {
  this.gridType = gridType;
  this.buildGrid();
}

/**
 * Converts the current grid type to a readable string
 */
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
  const xUnits = calculateGridCount(this.scene.width, this.gridSize, GridType.HorizontalHex, "horizontal");
  const yUnits = calculateGridCount(this.scene.height, this.gridSize, GridType.HorizontalHex, "vertical");

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
  if (x % 2 === 1) { yOffset = 0.5 * this.gridSize; }
  const horizontalSize = this.gridSize / COS_30;

  const xOffset = -0.25 * horizontalSize * x;

  this.grid.moveTo((x + 0.25) * horizontalSize + xOffset, (y * this.gridSize) + yOffset);
  this.grid.lineTo((x + 0.75) * horizontalSize + xOffset, (y * this.gridSize) + yOffset);
  this.grid.lineTo((x + 1) * horizontalSize + xOffset, ((y + 0.5) * this.gridSize) + yOffset);
  this.grid.lineTo((x + 0.75) * horizontalSize + xOffset, ((y + 1) * this.gridSize) + yOffset);
  this.grid.lineTo((x + 0.25) * horizontalSize + xOffset, ((y + 1) * this.gridSize) + yOffset);
  this.grid.lineTo(x * horizontalSize + xOffset, ((y + 0.5) * this.gridSize) + yOffset);
  this.grid.lineTo((x + 0.25) * horizontalSize + xOffset, (y * this.gridSize) + yOffset);
}

/**
 * Builds a vertical hex grid (hexes longest point is vertical)
 */
export function buildVerticalHexGrid(this: SceneController): void {
  const xUnits = calculateGridCount(this.scene.width, this.gridSize, GridType.VerticalHex, "horizontal");
  const yUnits = calculateGridCount(this.scene.height, this.gridSize, GridType.VerticalHex, "vertical");

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
  if (y % 2 === 1) { xOffset = 0.5 * this.gridSize; }
  const verticalSize = this.gridSize / COS_30;

  const yOffset = (-0.25 * verticalSize * y) + 0.25 * verticalSize;

  this.grid.moveTo((x * this.gridSize) + xOffset, y * verticalSize + yOffset);
  this.grid.lineTo((x * this.gridSize) + xOffset, ((y + 0.5) * verticalSize) + yOffset);
  this.grid.lineTo(((x + 0.5) * this.gridSize) + xOffset, ((y + 0.75) * verticalSize) + yOffset);
  this.grid.lineTo(((x + 1) * this.gridSize) + xOffset, ((y + 0.5) * verticalSize) + yOffset);
  this.grid.lineTo(((x + 1) * this.gridSize) + xOffset, (y * verticalSize) + yOffset);
  this.grid.lineTo(((x + 0.5) * this.gridSize) + xOffset, ((y - 0.25) * verticalSize) + yOffset);
  this.grid.lineTo((x * this.gridSize) + xOffset, y * verticalSize + yOffset);
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
