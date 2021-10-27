import { action, makeObservable, observable } from "mobx";
import { Graphics } from "pixi.js";
import { COS_30 } from "./consts";
import { MapController } from "./map";
import { GridType } from "./SceneController";


class $GridController {

  public type: GridType = GridType.Squares;
  public size = 64;

  public grid: Graphics;

  constructor() {
    this.grid = new Graphics();

    makeObservable(this, {
      type: observable,
      size: observable,
      load: action,
      setAll: action,
    });
  }

  public init() {
    this.buildGrid();

    MapController.map.addChild(this.grid);
  }

  /**
   * Loads in a data object from the database to the grid controller
   * @param grid The grid object to load in
   */
  public load(grid: any) {
    this.type = grid.type;
    this.size = grid.size;

    this.buildGrid();
  }

  /**
   * Exports the grid into a saveable object
   */
  public save() {
    return {
      type: this.type,
      size: this.size,
    };
  }

  /**
   * Standard function to set all information in a full grid
   */
   public setAll(size: number, type: GridType) {
    this.type = type;
    this.size = size;

    this.buildGrid();
  }

  /**
   * Calculates the number of grids in a given direction for the given dimensions.
   * Returns the number of grids, rounded up to the nearest whole number
   * @param pixelSize The size in pixels of the scene
   * @param gridSize The size of the grid tile
   * @param gridType The type of grid
   * @param direction The direction, either "horizontal" or "vertical"
   */
  public calculateGridCount(
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
  public calculateGridToPixels(
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
   * @param type The new grid type
   */
  public setGridType(type: GridType): void {
    this.type = type;
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
      default:
        return "";
    }
  }

  /**
   * Builds the grid for the current scene controller
   */
  public buildGrid(): void {
    this.grid.clear();
    this.grid.lineStyle(1, 0x555555, 1);

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
  public buildHorizontalHexGrid(): void {
    // TODO - move line style to a different function
    const xUnits = this.calculateGridCount(MapController.width, this.size, GridType.HorizontalHex, "horizontal");
    const yUnits = this.calculateGridCount(MapController.height, this.size, GridType.HorizontalHex, "vertical");

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
  public buildHorizontalHex(x: number, y: number): void {
    let yOffset = 0;
    if (x % 2 === 1) { yOffset = 0.5 * this.size; }
    const horizontalSize = this.size / COS_30;

    const xOffset = -0.25 * horizontalSize * x;

    this.grid.moveTo((x + 0.25) * horizontalSize + xOffset, (y * this.size) + yOffset);
    this.grid.lineTo((x + 0.75) * horizontalSize + xOffset, (y * this.size) + yOffset);
    this.grid.lineTo((x + 1) * horizontalSize + xOffset, ((y + 0.5) * this.size) + yOffset);
    this.grid.lineTo((x + 0.75) * horizontalSize + xOffset, ((y + 1) * this.size) + yOffset);
    this.grid.lineTo((x + 0.25) * horizontalSize + xOffset, ((y + 1) * this.size) + yOffset);
    this.grid.lineTo(x * horizontalSize + xOffset, ((y + 0.5) * this.size) + yOffset);
    this.grid.lineTo((x + 0.25) * horizontalSize + xOffset, (y * this.size) + yOffset);
  }

  /**
   * Builds a vertical hex grid (hexes longest point is vertical)
   */
  public buildVerticalHexGrid(): void {
    const xUnits = this.calculateGridCount(MapController.width, this.size, GridType.VerticalHex, "horizontal");
    const yUnits = this.calculateGridCount(MapController.height, this.size, GridType.VerticalHex, "vertical");

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

    this.grid.moveTo((x * this.size) + xOffset, y * verticalSize + yOffset);
    this.grid.lineTo((x * this.size) + xOffset, ((y + 0.5) * verticalSize) + yOffset);
    this.grid.lineTo(((x + 0.5) * this.size) + xOffset, ((y + 0.75) * verticalSize) + yOffset);
    this.grid.lineTo(((x + 1) * this.size) + xOffset, ((y + 0.5) * verticalSize) + yOffset);
    this.grid.lineTo(((x + 1) * this.size) + xOffset, (y * verticalSize) + yOffset);
    this.grid.lineTo(((x + 0.5) * this.size) + xOffset, ((y - 0.25) * verticalSize) + yOffset);
    this.grid.lineTo((x * this.size) + xOffset, y * verticalSize + yOffset);
  }

  /**
   * Builds a square grid
   */
  protected buildSquareGrid(): void {
    const xUnits = Math.ceil(MapController.width / this.size);
    const yUnits = Math.ceil(MapController.height / this.size);

    // Need to use these instead of referencing scene height/width. This is some weird hacky bullshit
    // Lines will not render on subsequent selections
    const height = MapController.height;
    const width = MapController.width;

    for (let x = 0; x <= xUnits; x++) {
      if (x === 0) {
        this.grid.moveTo(0, 0);
        this.grid.lineTo(0, height);
        continue;
      }
      this.grid.moveTo(x * this.size, 0);
      this.grid.lineTo(x * this.size, height);
    }

    for (let y = 0; y <= yUnits; y++) {
      if (y === 0) {
        this.grid.moveTo(0, 0.5);
        this.grid.lineTo(width, 0.5);
        continue;
      }
      this.grid.moveTo(0, y * this.size - 0.5);
      this.grid.lineTo(width, y * this.size - 0.5);
    }
  }

}

export const GridController = new $GridController();
