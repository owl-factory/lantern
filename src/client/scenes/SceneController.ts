import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { makeAutoObservable } from "mobx";
import { Viewport } from "pixi-viewport";
import { InteractionData, InteractionEvent, Point, Sprite } from "pixi.js";

import * as grid from "./grid";
import * as initialize from "./initialize";
import * as size from "./size";

interface InteractiveSprite extends Sprite {
  data: InteractionData | null;
  dragging: boolean;
  dragPoint: Point;
}

interface InteractiveContainer extends Container {
  data: InteractionData | null;
  dragging: boolean;
  dragPoint: Point;
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
  public viewport: Viewport;
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
    this.viewport = new Viewport();
    this.scene = new Container();
    this.initializeBackground();
    this.initializeViewport();
    this.initializeScene();

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

  /**
   * Fetches the scene's app
   */
  public getApp(): Application {
    return this.app;
  }

  /**
   * Runs the action to unset any settings for the current mode
   */
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

  /**
   * Sets any settings required for the new mode
   * @param mode The new mode
   */
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

  /**
   * Creates a new sprite from a source.
   * TODO - replace with createProp & createActor functions
   * @param textureSource The URL source of the texture
   * @param x The x coordinate of the new sprite
   * @param y The y coordinate of the new sprite
   */
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

  /**
   * Handles the onPointerDown event
   * @param event The onPointerDown event
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onPointerDown(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    switch(this.mode) {
      case SceneMode.Select:
        return this.onSelectStart(event, target, sceneController);
      case SceneMode.Pan:
        return this.onPanStart(event, target, sceneController);
    }
  }

  /**
   * Handles the onPointerUp event
   * @param event The onPointerUp event
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onPointerUp(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    // Check button
    switch(this.mode) {
      case SceneMode.Select:
        return this.onSelectEnd(event, target, sceneController);
      case SceneMode.Pan:
        return this.onPanEnd(event, target, sceneController);
    }
  }

  /**
   * Handles the onPointerMove event
   * @param event The onPointerMove event
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onPointerMove(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    // Check button
    switch(this.mode) {
      case SceneMode.Select:
        return this.onSelectMove(event, target, sceneController);
      case SceneMode.Pan:
        return this.onPanMove(event, target, sceneController);
    }
  }

  /**
   * Handles the beginning of onSelect
   * @param event The event triggering the onSelect action
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onSelectStart(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    if (target === sceneController.scene) { return; }
    this.viewport.plugins.pause('drag');

    target.dragging = true;
    target.data = event.data;
    target.dragPoint = event.data.getLocalPosition(target.parent);
    target.dragPoint.x -= target.x;
    target.dragPoint.y -= target.y;
  }

  /**
   * Handles the end of onSelect
   * @param event The event triggering the onSelect action's end
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onSelectEnd(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    if (!target.dragging || !target.data) { return; }
    this.viewport.plugins.resume('drag');

    target.dragging = false;
    target.data = null;
    return;
  }

  /**
   * Handles the movement of onSelect
   * @param event The event triggering the onSelect movement
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onSelectMove(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    if (!target.dragging || !target.data) { return; }
    const newPosition = target.data.getLocalPosition(target.parent);
    target.x = newPosition.x;
    target.y = newPosition.y;
    return;
  }

  /**
   * Handles the beginning of onPan
   * @param event The event triggering the onPan action
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onPanStart(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    const scene = sceneController.scene as InteractiveContainer;
    scene.dragging = true;
    scene.data = event.data;
    return;
  }

  /**
   * Handles the end of onPan
   * @param event The event triggering the onPan action's end
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onPanEnd(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    const scene = sceneController.scene as InteractiveContainer;
    scene.dragging = false;
    scene.data = null;
    return;
  }

  /**
   * Handles the movement of onPan
   * @param event The event triggering the onPan action
   * @param target The target sprite or container to interact with
   * @param sceneController The scene, as `this` is unavailable
   */
  protected onPanMove(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
    const scene = sceneController.scene as InteractiveContainer;
    if (!scene.dragging || !scene.data) { return; }
    const newPosition = scene.data.getLocalPosition(scene.parent);
    scene.x = newPosition.x;
    scene.y = newPosition.y;
    return;
  }

  // GRID BUILDING
  protected buildGrid = grid.buildGrid;
  protected buildHorizontalHexGrid = grid.buildHorizontalHexGrid;
  protected buildVerticalHexGrid = grid.buildVerticalHexGrid;
  protected buildHorizontalHex = grid.buildHorizontalHex;
  protected buildVerticalHex = grid.buildVerticalHex;
  protected buildSquareGrid = grid.buildSquareGrid;

  // INITIALIZE
  protected initializeBackground = initialize.initializeBackground;
  protected initializeViewport = initialize.initializeViewport;
  protected initializeScene = initialize.initializeScene;

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
