import { Application } from "@pixi/app";
import { Container } from "@pixi/display";
import { makeAutoObservable } from "mobx";

enum MapSizeUnit {
  Pixels,
  Squares,
  VerticalHex,
  HorizontalHex
}

interface MapSize {
  height: number;
  width: number;
  unitHeight: number;
  unitWidth: number;
  unit: MapSizeUnit;
}

interface Layer {
  name: string,
  container: Container;
}

const DEFAULT_LAYERS = [ "map", "grid", "player", "gm"];

const PIXELS_PER_SQUARE = 64;
const PIXELS_PER_HEX = 64;

export class MapController {
  protected app: Application;
  protected layers: Layer[];
  protected mapSize: MapSize;

  /**
   * Creates a new, empty map controller.
   * @param app The PixiJS Application used for rendering out this map
   */
  constructor(app: Application) {
    makeAutoObservable(this);
    this.app = app;
    this.layers = [];
    this.mapSize = {
      height: 0,
      unitHeight: 0,
      width: 0,
      unitWidth: 0,
      unit: MapSizeUnit.Pixels,
    };

    this.setDefaultMap();
  }

  protected createDefaultContainers() {
    this.layers.push(
      {
        name: "Grid",
        key: "grid",
        container: new Container()
      }
    );

    
  }

  public buildGrid(): 

  public getMapHeight(): number { return this.mapSize.height; }
  public getMapWidth(): number { return this.mapSize.width; }
  public getMapUnitHeight(): number { return this.mapSize.height; }
  public getMapUnitWidth(): number { return this.mapSize.width; }
  public getMapUnit(): MapSizeUnit { return this.mapSize.unit; }


  public setMapHeight(height: number): void {
    this.mapSize.height = this.pixelsToNearestUnit(height);
    this.mapSize.unitHeight = this.pixelsToUnit(this.mapSize.height);
  }

  public setMapWidth(width: number): void {
    this.mapSize.width = this.pixelsToNearestUnit(width);
    this.mapSize.unitWidth = this.pixelsToUnit(this.mapSize.width);
  }

  public setMapUnitHeight(unitHeight: number): void {
    this.mapSize.unitHeight = unitHeight;
    this.mapSize.height = this.unitToPixels(unitHeight);
  }

  public setMapUnitWidth(unitWidth: number): void {
    this.mapSize.unitWidth = unitWidth;
    this.mapSize.width = this.unitToPixels(unitWidth);
  }

  public setMapUnit(unit: MapSizeUnit): void {
    this.mapSize.unit = unit;
    this.mapSize.height = this.pixelsToNearestUnit(this.mapSize.height);
    this.mapSize.width = this.pixelsToNearestUnit(this.mapSize.width);

    this.mapSize.unitHeight = this.pixelsToUnit(this.mapSize.height);
    this.mapSize.unitWidth = this.pixelsToUnit(this.mapSize.width);
  }

  protected setDefaultMap() {
    this.setMapUnit(MapSizeUnit.Squares);
    this.setMapUnitHeight(20);
    this.setMapUnitWidth(20);
  }

  protected pixelsToUnit(pixels: number): number {
    switch(this.mapSize.unit) {
      case MapSizeUnit.Squares:
        return Math.round(pixels / PIXELS_PER_SQUARE);
      case MapSizeUnit.VerticalHex:
      case MapSizeUnit.HorizontalHex:
        return Math.round(pixels / PIXELS_PER_HEX);
      case MapSizeUnit.Pixels:
      default:
        return pixels;
    }
  }

  protected unitToPixels(units: number): number {
    switch(this.mapSize.unit) {
      case MapSizeUnit.Squares:
        return units * PIXELS_PER_SQUARE;
      case MapSizeUnit.VerticalHex:
      case MapSizeUnit.HorizontalHex:
        return units * PIXELS_PER_HEX;
      case MapSizeUnit.Pixels:
      default:
        return units;
    }
  }

  protected pixelsToNearestUnit(pixels: number): number {
    return this.unitToPixels(this.pixelsToUnit(pixels));
  }
}
