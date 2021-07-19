import { makeAutoObservable } from "mobx";
import { DisplayObject, Graphics } from "pixi.js";
import { GridType } from "types/enums/scene";
import { SceneController } from "./SceneController2";

export const PIXELS_PER_SQUARE = 64; // The default number of pixels per square
export const PIXELS_PER_HEX = 64; // The default number of pixels per hexagon
export const DEFAULT_GRID_SIZE = 64; // The default number of pixels per grid

// The static value of cos(30) in degrees, or the apothem multiplier of a hexagon
export const COS_30 = 0.866;

export class Grid {
  protected size: number;
  protected type: GridType;

  protected render: Graphics;

  protected controller: SceneController;

  constructor(controller: SceneController) {
    this.controller = controller;
    this.size = 0;
    this.type = GridType.None;

    this.render = new Graphics();

    makeAutoObservable(this);
  }

  public register(): void {
    this.buildGrid();
    this.controller.getScene().addChild(this.render);
  }

  public load() {
    return;
  }

  public getSize(): number { return this.size; }
  public getType(): number { return this.type; }

  /**
   * Calculates the number of grids in a given direction for the given dimensions.
   * Returns the number of grids, rounded up to the nearest whole number
   * @param pixelSize The size in pixels of the scene
   * @param gridSize The size of the grid tile
   * @param gridType The type of grid
   * @param direction The direction, either "horizontal" or "vertical"
   */
  public static calculateGridCount(
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
  public static calculateGridToPixels(
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
  public setGridType(type: GridType): void {
    this.type = type;
    this.buildGrid();
  }

  public setGrid(values: any): void {
    this.controller.getScene().setHeight(parseInt(values.height));
    this.controller.getScene().setWidth(parseInt(values.width));
    this.controller.getScene().setX(0);
    this.controller.getScene().setY(0);
    this.size = parseInt(values.gridSize);
    this.type = parseInt(values.gridType);
    // centerViewport();
    this.buildGrid();
  }

  /**
   * Converts the current grid type to a readable string
   */
  public getGridTypeReadable(): string {
    switch (this.type) {
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
  protected buildGrid(): void {
    this.render.clear();
    this.render.lineStyle(1, 0x555555, 1);

    switch (this.type) {
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
  protected buildHorizontalHexGrid(): void {
    // TODO - move line style to a different function
    const xUnits = Grid.calculateGridCount(this.controller.getWidth(), this.size, GridType.HorizontalHex, "horizontal");
    const yUnits = Grid.calculateGridCount(this.controller.getHeight(), this.size, GridType.HorizontalHex, "vertical");

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
  protected buildHorizontalHex(x: number, y: number): void {
    let yOffset = 0;
    if (x % 2 === 1) { yOffset = 0.5 * this.size; }
    const horizontalSize = this.size / COS_30;

    const xOffset = -0.25 * horizontalSize * x;

    this.render.moveTo((x + 0.25) * horizontalSize + xOffset, (y * this.size) + yOffset);
    this.render.lineTo((x + 0.75) * horizontalSize + xOffset, (y * this.size) + yOffset);
    this.render.lineTo((x + 1) * horizontalSize + xOffset, ((y + 0.5) * this.size) + yOffset);
    this.render.lineTo((x + 0.75) * horizontalSize + xOffset, ((y + 1) * this.size) + yOffset);
    this.render.lineTo((x + 0.25) * horizontalSize + xOffset, ((y + 1) * this.size) + yOffset);
    this.render.lineTo(x * horizontalSize + xOffset, ((y + 0.5) * this.size) + yOffset);
    this.render.lineTo((x + 0.25) * horizontalSize + xOffset, (y * this.size) + yOffset);
  }

  /**
   * Builds a vertical hex grid (hexes longest point is vertical)
   */
  protected buildVerticalHexGrid(): void {
    const xUnits = Grid.calculateGridCount(this.controller.getWidth(), this.size, GridType.VerticalHex, "horizontal");
    const yUnits = Grid.calculateGridCount(this.controller.getHeight(), this.size, GridType.VerticalHex, "vertical");

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
  protected buildVerticalHex(x: number, y: number): void {
    let xOffset = 0;
    if (y % 2 === 1) { xOffset = 0.5 * this.size; }
    const verticalSize = this.size / COS_30;

    const yOffset = (-0.25 * verticalSize * y) + 0.25 * verticalSize;

    this.render.moveTo((x * this.size) + xOffset, y * verticalSize + yOffset);
    this.render.lineTo((x * this.size) + xOffset, ((y + 0.5) * verticalSize) + yOffset);
    this.render.lineTo(((x + 0.5) * this.size) + xOffset, ((y + 0.75) * verticalSize) + yOffset);
    this.render.lineTo(((x + 1) * this.size) + xOffset, ((y + 0.5) * verticalSize) + yOffset);
    this.render.lineTo(((x + 1) * this.size) + xOffset, (y * verticalSize) + yOffset);
    this.render.lineTo(((x + 0.5) * this.size) + xOffset, ((y - 0.25) * verticalSize) + yOffset);
    this.render.lineTo((x * this.size) + xOffset, y * verticalSize + yOffset);
  }

  /**
   * Builds a square grid
   */
  protected buildSquareGrid(): void {
    // Need to use these instead of referencing scene height/width. This is some weird hacky bullshit
    // Lines will not render on subsequent selections
    const height = this.controller.getHeight();
    const width = this.controller.getWidth();

    const xUnits = Math.ceil(width / this.size);
    const yUnits = Math.ceil(height / this.size);

    for (let x = 0; x <= xUnits; x++) {
      if (x === 0) {
        this.render.moveTo(0, 0);
        this.render.lineTo(0, height);
        continue;
      }
      this.render.moveTo(x * this.size, 0);
      this.render.lineTo(x * this.size, height);
    }

    for (let y = 0; y <= yUnits; y++) {
      if (y === 0) {
        this.render.moveTo(0, 0.5);
        this.render.lineTo(width, 0.5);
        continue;
      }
      this.render.moveTo(0, y * this.size - 0.5);
      this.render.lineTo(width, y * this.size - 0.5);
    }
  }

}