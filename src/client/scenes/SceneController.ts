import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { makeAutoObservable } from "mobx";
import { InteractionData, InteractionEvent, Point, Sprite } from "pixi.js";

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

export enum SceneMode {
  Select,
  Pan,
}

export const SceneModeReadable: string[] = [
  "Select",
  "Pan",
];

export const SceneModeButtons: string[] = [
  "v",
  " ",
];

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
  public app: Application;
  public scene: Container;
  protected mapSize: MapSize;

  protected grid: Graphics;

  public mode: SceneMode;

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
    this.mode = SceneMode.Select;


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
      .on("mousedown", (event) => this.onPointerDown(event, this.scene as InteractiveContainer, this))
      .on("mouseup", (event) => this.onPointerUp(event, this.scene as InteractiveContainer, this))
      .on("mouseupoutside", (event) => this.onPointerUp(event, this.scene as InteractiveContainer, this))
      .on("mousemove", (event) => this.onPointerMove(event, this.scene as InteractiveContainer, this));
  }

  public getApp(): Application {
    return this.app;
  }

  public unsetMode(): void {
    // TODO - throw events ending current action if mode changed
    switch (this.mode) {
      case SceneMode.Select:
        break;
      case SceneMode.Pan:
        this.scene.buttonMode = false;
        break;
    }
  }

  public setMode(mode: SceneMode): void {
    this.unsetMode();
    this.mode = mode;
    switch (this.mode) {
      case SceneMode.Select:
        break;
      case SceneMode.Pan:
        this.scene.buttonMode = true;
        break;
    }
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

    this.scene.addChild(sprite);

    sprite
      .on("pointerdown", (event) => this.onPointerDown(event, sprite as InteractiveSprite, this))
      .on("pointerup", (event) => this.onPointerUp(event, sprite as InteractiveSprite, this))
      .on("pointerupoutside", (event) => this.onPointerUp(event, sprite as InteractiveSprite, this))
      .on("pointermove", (event) => this.onPointerMove(event, sprite as InteractiveSprite, this));
  }

  protected onPointerDown(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    // Check mode
    // Check button

    switch(this.mode) {
      case SceneMode.Select:
        return this.onSelectStart(event, target, sceneController);
      case SceneMode.Pan:
        return this.onPanStart(event, target, sceneController);
    }
  }

  protected onPointerUp(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    // Check button
    switch(this.mode) {
      case SceneMode.Select:
        return this.onSelectEnd(event, target, sceneController);
      case SceneMode.Pan:
        return this.onPanEnd(event, target, sceneController);
    }
  }

  protected onPointerMove(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    // Check button
    switch(this.mode) {
      case SceneMode.Select:
        return this.onSelectMove(event, target, sceneController);
      case SceneMode.Pan:
        return this.onPanMove(event, target, sceneController);
    }
  }

  protected getGrabPointOffset(grabPoint: Point, targetPoint: Point): Point {
    return new Point(grabPoint.x - targetPoint.x, grabPoint.y - targetPoint.y);
  }

  protected getAnchorOffset(grabPoint: Point, targetPoint: Point, target: Sprite): void {
    const xOffset = ((grabPoint.x - targetPoint.x) / target.width) + target.anchor.x;
    const yOffset = ((grabPoint.y - targetPoint.y) / target.height) + target.anchor.y;
    target.anchor.set(xOffset, yOffset);
  }

  protected onSelectStart(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    if (target === sceneController.scene) { return; }
    this.getAnchorOffset(event.data.global, target.getGlobalPosition(), target as Sprite);
    console.log((target as Sprite).anchor)

    target.dragging = true;
    target.data = event.data;
    const newPosition = target.data.getLocalPosition(target.parent);
    target.x = newPosition.x;
    target.y = newPosition.y;
  }

  protected onSelectEnd(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    if (!target.dragging || !target.data) { return; }
    target.dragging = false;
    target.data = null;
    return;
  }

  protected onSelectMove(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    if (!target.dragging || !target.data) { return; }
    const newPosition = target.data.getLocalPosition(target.parent);
    target.x = newPosition.x;
    target.y = newPosition.y;
    return;
  }

  protected onPanStart(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    const scene = sceneController.scene as InteractiveContainer;
    scene.dragging = true;
    scene.data = event.data;
    return;
  }

  protected onPanEnd(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    const scene = sceneController.scene as InteractiveContainer;
    scene.dragging = false;
    scene.data = null;
    return;
  }

  protected onPanMove(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    const scene = sceneController.scene as InteractiveContainer;
    if (!scene.dragging || !scene.data) { return; }
    const newPosition = scene.data.getLocalPosition(scene.parent);
    scene.x = newPosition.x;
    scene.y = newPosition.y;
    return;
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

  // public onPanStart(event: InteractionEvent, scene: InteractiveContainer): void {
  //   console.log(event)
  //   if (!event.data || event.data.button !== 1) { return; }
  //   console.log(event)
  //   scene.dragging = true;
  //   scene.data = event.data;
  // }

  // protected onPanEnd(event: InteractionEvent, scene: InteractiveContainer): void {
  //   if (event.data.button !== 1) { return; }
  //   scene.data = null;
  //   scene.dragging = false;
  // }

  // protected onPanMove(event: InteractionEvent, scene: InteractiveContainer): void {
  //   if (event.data.button !== 1) { return; }
  //   if (scene.dragging && scene.data !== null) {
  //     const newPosition = scene.data.getLocalPosition(scene.parent);
  //     scene.x = newPosition.x;
  //     scene.y = newPosition.y;
  //   }
  // }

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