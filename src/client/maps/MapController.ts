import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { makeAutoObservable } from "mobx";
import { Sprite } from "pixi.js";
import { COS_30, PIXELS_PER_HEX, PIXELS_PER_SQUARE } from "./consts";

import * as size from "./size";

export enum MapSizeUnit {
  Pixels,
  Squares,
  VerticalHex,
  HorizontalHex
}

export interface MapSize {
  height: number;
  width: number;
  unitHeight: number;
  unitWidth: number;
  unit: MapSizeUnit;
}

interface Layer {
  name: string,
  key: string,
  container: Container;
}



export class MapController {
  protected app: Application;
  protected container: Container;

  // CORE LAYERS
  protected map: Sprite;
  protected grid: Graphics;



  protected layers: Layer[];
  protected layerRef: Record<string, Layer>;
  protected mapSize: MapSize;

  protected data: unknown;
  protected panning = false;

  /**
   * Creates a new, empty map controller.
   * @param app The PixiJS Application used for rendering out this map
   */
  constructor(app: Application) {
    makeAutoObservable(this);
    this.app = app;
    this.container = new Container();
    this.map = new Sprite();
    this.layers = [];
    this.layerRef = {};
    this.mapSize = {
      height: 0,
      unitHeight: 0,
      width: 0,
      unitWidth: 0,
      unit: MapSizeUnit.Pixels,
    };
    this.setDefaultMap();

    this.initializeMap();

    this.app.stage.addChild(this.container);

    this.grid = new Graphics();
    this.container.addChild(this.grid);

    this.buildGrid();
    // this.buildGrid();

    console.log(this.container)

  }

  protected initializeMap(): void {
    this.container.width = 5;
    console.log(this.map.width);
    
    this.container.interactiveChildren = true;
    this.map.texture = Texture.WHITE;
    this.map.tint = 0xAAAAFF;
    this.map.interactive = true;
    this.map.buttonMode = true;

    this.map.on("pointerdown",this.onPanStart);
    this.map.on("mouseup", this.onPanEnd);
    this.map.on("mouseupoutside", this.onPanEnd);
    this.map.on("mousemove", this.onPanMove);

    this.container.addChild(this.map);

  }

  protected onPanStart(event: any) {
    // Only if middle mouse button
    if (event.data.button !== 1) { return; }
    console.log(event.data)
    console.log("panning")

    this.data = event.data;
    this.panning = true;
  }

  protected onPanEnd(event: any) {
    // Only if middle mouse btn
    if (event.data.button !== 1) { return; }

    this.data = null;
    this.panning = false;
    console.log("Done panning")
  }

  protected onPanMove(event: any) {
    if (this.panning) {
      console.log(event.data);
      // const newPosition = ;
      // console.log(newPosition)
    }
  }

  public buildGrid(): void {
    this.grid.clear();
    this.grid.lineStyle(1, 0x555555, 1);

    switch (this.mapSize.unit) {
      case MapSizeUnit.Squares:
        this.buildSquareGrid();
        break;
      case MapSizeUnit.HorizontalHex:
        this.buildHorizontalHexGrid();
        break;
      case MapSizeUnit.VerticalHex:
        this.buildVerticalHexGrid();
        break;
      case MapSizeUnit.Pixels:
      default:
        return;
    }

  }

  protected buildHorizontalHexGrid(): void {
    // TODO - move line style to a different function

    for(let x = 0; x < this.mapSize.unitWidth; x++) {
      for(let y = 0; y < this.mapSize.unitHeight; y++) {
        this.buildHorizontalHex(x, y);
      }
    }
  }

  protected buildHorizontalHex(x: number, y: number): void {
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

  protected buildVerticalHexGrid(): void {
    for(let x = 0; x < this.mapSize.unitWidth; x++) {
      for(let y = 0; y < this.mapSize.unitHeight; y++) {
        this.buildVerticalHex(x, y);
      }
    }
  }

  protected buildVerticalHex(x: number, y: number): void {
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

  protected buildSquareGrid(): void {
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

  // SIZING
  public getMapHeight = size.getMapHeight;
  public getMapWidth = size.getMapWidth;
  public getMapUnitHeight = size.getMapUnitHeight;
  public getMapUnitWidth = size.getMapUnitWidth;
  public getMapUnit = size.getMapUnit;

  public setMapHeight = size.setMapHeight;
  public setMapWidth = size.setMapWidth;
  public setMapUnitHeight = size.setMapUnitHeight;
  public setMapUnitWidth = size.setMapUnitWidth;
  public setMapUnit = size.setMapUnit;

  protected pixelsToUnit = size.pixelsToUnit;
  protected pixelsToNearestUnit = size.pixelsToNearestUnit;
  protected unitToPixels = size.unitToPixels;

  // TODO - delete/rename this
  protected setDefaultMap = size.setDefaultMap;
}
