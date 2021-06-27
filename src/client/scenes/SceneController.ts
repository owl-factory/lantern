import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { makeAutoObservable } from "mobx";
import { InteractionData, InteractionEvent, Sprite } from "pixi.js";

import * as grid from "./grid";
import * as size from "./size";

interface InteractiveSprite extends Sprite {
  data: InteractionData | null;
  dragging: boolean;
}

interface InteractiveContainer extends Container {
  data: InteractionData | null;
  dragging: boolean;
}

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

export type Interactable = InteractiveContainer | InteractiveSprite;

const DEFAULT_SCALE = 1.5;

export class SceneController {
  protected app: Application;
  protected scene: Container;
  protected mapSize: MapSize;

  protected grid: Graphics;

  protected data: unknown;
  protected panning = false;
  protected panData: any;

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

    this.scene.interactive = true;
    // this.scene.buttonMode = true;

    this.scene
      .on("mousedown", (event) => this.onPanStart(event, this.scene))
      .on("mouseup", (event) => this.onPanEnd(event, this.scene))
      .on("mouseupoutside", (event) => this.onPanEnd(event, this.scene))
      .on("mousemove", (event) => this.onPanMove(event, this.scene));
  }

  public getApp(): Application {
    return this.app;
  }

  public async createSprite(textureSource: string, x: number, y: number): Promise<void> {
    const texture = await Texture.fromURL(textureSource);

    const sprite = Sprite.from(texture);
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(DEFAULT_SCALE);

    this.app.stage.addChild(sprite);

    sprite
      .on("pointerdown", (event) => this.onDragStart(event, sprite as InteractiveSprite))
      .on("pointerup", () => this.onDragEnd(sprite as InteractiveSprite))
      .on("pointerupoutside", () => this.onDragEnd(sprite as InteractiveSprite))
      .on("pointermove", (event, event2) => this.onDragMove(event, event2, sprite as InteractiveSprite));
  }

  protected onPointerDown(event: InteractionEvent, target: Interactable, sceneController: SceneController) {
    // Check button
    
  }

  protected onPointerUp(event: InteractionEvent, target: Interactable, sceneController: SceneController) {
    // Check button
  }

  protected onPointerMove(event: InteractionEvent, target: Interactable, sceneController: SceneController) {
    // Check button
  }

  protected onDragStart(event: InteractionEvent, sprite: InteractiveSprite): void {
    console.log(event)
    sprite.data = event.data;
    sprite.dragging = true;
    sprite.alpha = 0.5;
  }

  protected onDragEnd(sprite: InteractiveSprite): void {
    sprite.alpha = 1;
    sprite.dragging = false;
    sprite.data = null;
  }

  protected onDragMove(sprite: InteractiveSprite): void {

    if (sprite.dragging && sprite.data !== null) {
        // const newPosition = sprite.data.getLocalPosition(sprite.parent);
        // sprite.x = newPosition.x;
        // sprite.y = newPosition.y;
    }
  }

  public onPanStart(event: InteractionEvent, scene: InteractiveContainer): void {
    console.log(event)
    if (!event.data || event.data.button !== 1) { return; }
    console.log(event)
    scene.dragging = true;
    scene.data = event.data;
  }

  protected onPanEnd(event: InteractionEvent, scene: InteractiveContainer): void {
    if (event.data.button !== 1) { return; }
    scene.data = null;
    scene.dragging = false;
  }

  protected onPanMove(event: InteractionEvent, scene: InteractiveContainer): void {
    if (event.data.button !== 1) { return; }
    if (scene.dragging && scene.data !== null) {
      const newPosition = scene.data.getLocalPosition(scene.parent);
      scene.x = newPosition.x;
      scene.y = newPosition.y;
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