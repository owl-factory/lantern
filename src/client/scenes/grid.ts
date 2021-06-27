import { MapUnit, SceneController } from "./SceneController";
import { COS_30, PIXELS_PER_HEX, PIXELS_PER_SQUARE } from "./consts";

export function buildGrid(this: SceneController): void {
  this.grid.clear();
  this.grid.lineStyle(1, 0x555555, 1);

  switch (this.mapSize.unit) {
    case MapUnit.Squares:
      this.buildSquareGrid();
      break;
    case MapUnit.HorizontalHex:
      this.buildHorizontalHexGrid();
      break;
    case MapUnit.VerticalHex:
      this.buildVerticalHexGrid();
      break;
    case MapUnit.Pixels:
    default:
      return;
  }

}

export function buildHorizontalHexGrid(this: SceneController): void {
  // TODO - move line style to a different function

  for(let x = 0; x < this.mapSize.unitWidth; x++) {
    for(let y = 0; y < this.mapSize.unitHeight; y++) {
      this.buildHorizontalHex(x, y);
    }
  }
}

export function buildHorizontalHex(this: SceneController, x: number, y: number): void {
  let yOffset = 0;
  if (x % 2 === 1) { yOffset = 0.5 * PIXELS_PER_HEX * COS_30; }
  const xOffset = -0.25 * PIXELS_PER_HEX * x;

  this.grid.moveTo((x + 0.25) * PIXELS_PER_HEX + xOffset, (y * PIXELS_PER_HEX * COS_30) + yOffset);
  this.grid.lineTo((x + 0.75) * PIXELS_PER_HEX + xOffset, (y * PIXELS_PER_HEX * COS_30) + yOffset);
  this.grid.lineTo((x + 1) * PIXELS_PER_HEX + xOffset, ((y + 0.5) * PIXELS_PER_HEX * COS_30) + yOffset);
  this.grid.lineTo((x + 0.75) * PIXELS_PER_HEX + xOffset, ((y + 1) * PIXELS_PER_HEX * COS_30) + yOffset);
  this.grid.lineTo((x + 0.25) * PIXELS_PER_HEX + xOffset, ((y + 1) * PIXELS_PER_HEX * COS_30) + yOffset);
  this.grid.lineTo(x * PIXELS_PER_HEX + xOffset, ((y + 0.5) * PIXELS_PER_HEX * COS_30) + yOffset);
  this.grid.lineTo((x + 0.25) * PIXELS_PER_HEX + xOffset, (y * PIXELS_PER_HEX * COS_30) + yOffset);
}

export function buildVerticalHexGrid(this: SceneController): void {
  for(let x = 0; x < this.mapSize.unitWidth; x++) {
    for(let y = 0; y < this.mapSize.unitHeight; y++) {
      this.buildVerticalHex(x, y);
    }
  }
}

export function buildVerticalHex(this: SceneController, x: number, y: number): void {
  let xOffset = 0;
  if (y % 2 === 1) { xOffset = 0.5 * PIXELS_PER_HEX * COS_30; }
  const yOffset = (-0.25 * PIXELS_PER_HEX * y) + 0.25 * PIXELS_PER_HEX;

  this.grid.moveTo((x * PIXELS_PER_HEX * COS_30) + xOffset, y * PIXELS_PER_HEX + yOffset);
  this.grid.lineTo((x * PIXELS_PER_HEX * COS_30) + xOffset, ((y + 0.5) * PIXELS_PER_HEX) + yOffset);
  this.grid.lineTo(((x + 0.5) * PIXELS_PER_HEX * COS_30) + xOffset, ((y + 0.75) * PIXELS_PER_HEX) + yOffset);
  this.grid.lineTo(((x + 1) * PIXELS_PER_HEX * COS_30) + xOffset, ((y + 0.5) * PIXELS_PER_HEX) + yOffset);
  this.grid.lineTo(((x + 1) * PIXELS_PER_HEX * COS_30) + xOffset, (y * PIXELS_PER_HEX) + yOffset);
  this.grid.lineTo(((x + 0.5) * PIXELS_PER_HEX * COS_30) + xOffset, ((y - 0.25) * PIXELS_PER_HEX) + yOffset);
  this.grid.lineTo((x * PIXELS_PER_HEX * COS_30) + xOffset, y * PIXELS_PER_HEX + yOffset);
}

export function buildSquareGrid(this: SceneController): void {
  this.grid.clear();

  for (let x = 0; x <= this.mapSize.unitWidth; x++) {
    this.grid.lineStyle(0.5, 0x555555, 1);
    if (x === 0) {
      this.grid.moveTo(0.5, 0);
      this.grid.lineTo(0.5, this.mapSize.height);
      continue;
    }
    this.grid.moveTo(x * PIXELS_PER_SQUARE- 0.5, 0);
    this.grid.lineTo(x * PIXELS_PER_SQUARE- 0.5, this.mapSize.height);
  }

  for (let y = 0; y <= this.mapSize.unitHeight; y++) {
    this.grid.lineStyle(0.5, 0x555555, 1);
    if (y === 0) {
      this.grid.moveTo(0, 0.5);
      this.grid.lineTo(this.mapSize.width, 0.5);
      continue;
    }
    this.grid.moveTo(0, y * PIXELS_PER_SQUARE- 0.5);
    this.grid.lineTo(this.mapSize.width, y * PIXELS_PER_SQUARE- 0.5);
  }
}
