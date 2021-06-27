import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { makeAutoObservable } from "mobx";
import { Sprite } from "pixi.js";

import * as grid from "./grid";
import * as size from "./size";

export enum MapUnit {
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
  unit: MapUnit;
}

const DEFAULT_SCALE = 1;

export class SceneController {
  protected app: Application;
  protected scene: Container;
  protected mapSize: MapSize;

  protected grid: Graphics;

  protected data: unknown;
  protected dragging = false;
  protected panning = false;

  /**
   * Creates a new, empty map controller.
   * @param app The PixiJS Application used for rendering out this map
   */
  constructor(app: Application) {
    this.app = app;
    this.scene = new Container();
    this.app.stage.addChild(this.scene);
    this.initScene();
    this.grid = new Graphics();

    this.mapSize = {
      height: 0,
      width: 0,
      unitHeight: 0,
      unitWidth: 0,
      unit: MapUnit.Pixels,
    };

    makeAutoObservable(this);
  }

  protected initScene(): void {
    this.scene.width = 250;
    this.scene.height = 250;
    this.scene.pivot.set(0.5);

    const background = new Sprite(Texture.WHITE);
    background.anchor.set(0.5);
    background.width = 250;
    background.height = 250;

    this.scene.addChild(background);

    background.x = background.parent.width / 2;
    background.y = background.parent.height / 2;

    background.zIndex = -1;

    this.scene.x = this.scene.parent.width / 2;
    this.scene.y = this.scene.parent.height / 2;
  }

  public getApp(): Application {
    return this.app;
  }

  public async createSprite(textureSource: string, x: number, y: number) {
    const texture = await Texture.fromURL(textureSource);

    const sprite = Sprite.from(texture);
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(DEFAULT_SCALE);

    this.scene.addChild(sprite);

    sprite
      .on("pointerdown", (event) => this.onDragStart(event, sprite))
      .on("pointerup", () => this.onDragEnd(sprite))
      .on("pointerupoutside", () => this.onDragEnd(sprite))
      .on("pointermove", () => this.onDragMove(sprite));
  }

  protected onDragStart(event: any, sprite: Sprite) {
    sprite.data = event.data;
    sprite.dragging = true;
    sprite.alpha = 0.5;
  }

  protected onDragEnd(sprite: Sprite) {
    sprite.alpha = 1;
    sprite.dragging = false;
    sprite.data = null;
  }

  protected onDragMove(sprite: Sprite) {
    if (sprite.dragging) {
        const newPosition = sprite.data.getLocalPosition(sprite.parent);
        sprite.x = newPosition.x;
        sprite.y = newPosition.y;
    }
  }

  protected onPanStart(event: any, map: Sprite) {
    // Only if middle mouse button
    if (map.data.button !== 1) { return; }

    map.data = event.data;
    map.dragging = true;
  }

  protected onPanEnd(event: any, map: Sprite) {
    // Only if middle mouse btn
    if (event.data.button !== 1) { return; }

    this.data = null;
    this.panning = false;
  }

  protected onPanMove(event: any) {
    if (this.panning) {
      console.log(event.data);
      // const newPosition = ;
      // console.log(newPosition)
    }
  }

  // GRID BUILDING
  protected buildGrid = grid.buildGrid;
  protected buildHorizontalHexGrid = grid.buildHorizontalHexGrid;
  protected buildVerticalHexGrid = grid.buildVerticalHexGrid;
  protected buildHorizontalHex = grid.buildHorizontalHex;
  protected buildVerticalHex = grid.buildVerticalHex;
  protected buildSquareGrid = grid.buildSquareGrid;

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