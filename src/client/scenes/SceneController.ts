import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { makeAutoObservable } from "mobx";
import { Viewport } from "pixi-viewport";
import { InteractionData, InteractionEvent, Point, Sprite } from "pixi.js";
import { ImageDocument } from "types/documents";

import * as events from "./events";
import * as grid from "./grid";
import * as initialize from "./initialize";
import * as snap from "./snap";
import { subscribeProp } from "./subscribe";

/**
 * Adds several fields to a sprite's definition that are added by Pixi for interacting with them
 */
interface InteractiveSprite extends Sprite {
  data: InteractionData | null;
  dragging: boolean;
  dragPoint: Point;
  originalPosition: {
    x: number;
    y: number;
  }
}

/**
 * Adds several fields to a container's definition that are added by pixi for interacting with them
 */
interface InteractiveContainer extends Container {
  data: InteractionData | null;
  dragging: boolean;
  dragPoint: Point;
  originalPosition: {
    x: number;
    y: number;
  }
}

/**
 * Describes the different kinds of grids that may be drawn
 */
export enum GridType {
  None,
  Squares,
  VerticalHex,
  HorizontalHex
}

/**
 * Describes the different kinds of button modes that may be used
 */
export enum SceneMode {
  Select,
  Pan,
}

/**
 * The readable text for the different scene modes
 */
export const SceneModeReadable: string[] = [
  "Select",
  "Pan",
];

/**
 * The buttons to be used for selecting the scene modes (not implemented)
 */
export const SceneModeButtons: string[] = [
  "v",
  " ",
];

/**
 * Any interactable pixi item
 */
export type Interactable = InteractiveContainer | InteractiveSprite;

export interface Prop extends InteractiveSprite {
  key: string;
  image: ImageDocument;
}

/**
 * The controller for the PixiJS application for rendering a scene
 */
export class SceneController {
  public app: Application;
  public background: Sprite;
  public viewport: Viewport;
  public scene: Container;

  protected props: Record<string, Prop> = {};

  protected grid: Graphics;

  public mode: SceneMode;

  protected gridType: GridType = GridType.None;
  public gridSize = 0;

  /**
   * Creates a new, empty map controller.
   * @param app The PixiJS Application used for rendering out this map
   */
  constructor(app: Application) {
    this.app = app;
    this.background = new Sprite();
    this.viewport = new Viewport();
    this.scene = new Container();
    this.grid = new Graphics();

    this.initializeBackground();
    this.initializeViewport();
    this.initializeScene();
    this.initializeGrid();

    this.centerViewport();

    this.mode = SceneMode.Select;

    makeAutoObservable(this);
  }

  /**
   * Centers the viewport
   */
  public centerViewport(): void {
    this.viewport.x = (this.app.view.width - this.scene.width) / 2;
    this.viewport.y = (this.app.view.height - this.scene.height) / 2;
  }

  /**
   * Fetches the scene's app
   */
  public getApp(): Application {
    return this.app;
  }

  public getGridType(): GridType {
    return this.gridType;
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

  public addProp(sceneController: SceneController, image: ImageDocument, x?: number, y?: number): void {
    const prop = Sprite.from(image.src as string);
    (prop as Prop).image = image;
    // TODO - make unique!
    (prop as Prop).key = (new Date()).toString();

    prop.interactive = true;
    prop.buttonMode = true;

    prop.anchor.set(0.5);
    prop.x = x || sceneController.scene.x + sceneController.scene.width / 2;
    prop.y = y || sceneController.scene.y + sceneController.scene.height / 2;
    subscribeProp(prop as Prop, sceneController);
    sceneController.scene.addChild(prop);
    sceneController.props[(prop as Prop).key] = prop as Prop;
  }

  /**
   * Creates a new sprite from a source.
   * TODO - replace with createProp & createActor functions
   * @param textureSource The URL source of the texture
   * @param x The x coordinate of the new sprite
   * @param y The y coordinate of the new sprite
   */
  public async createSprite(textureSource: string, x: number, y: number): Promise<void> {
    this.addProp(this, { id: "", src: textureSource }, x, y);
  }

  /**
   * Subscribes the given target to standard events
   * @param target The target to subscribe events to
   */
  public subscribe(target: Interactable): void {
    target
      .on("pointerdown", (event) => this.onPointerDown(event, target, this))
      .on("pointerup", (event) => this.onPointerUp(event, target, this))
      .on("pointerupoutside", (event) => this.onPointerUp(event, target, this))
      .on("pointermove", (event) => this.onPointerMove(event, target, this));
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

  // EVENTS
  protected onPanStart = events.pan.onPanStart;
  protected onPanEnd = events.pan.onPanEnd;
  protected onPanMove = events.pan.onPanMove;

  protected onSelectStart = events.select.onSelectStart;
  protected onSelectEnd = events.select.onSelectEnd;
  protected onSelectMove = events.select.onSelectMove;


  // GRID BUILDING
  protected buildGrid = grid.buildGrid;
  protected buildHorizontalHexGrid = grid.buildHorizontalHexGrid;
  protected buildVerticalHexGrid = grid.buildVerticalHexGrid;
  protected buildHorizontalHex = grid.buildHorizontalHex;
  protected buildVerticalHex = grid.buildVerticalHex;
  protected buildSquareGrid = grid.buildSquareGrid;
  public static calculateGridCount = grid.calculateGridCount;
  public static calculateGridToPixels = grid.calculateGridToPixels;
  public getGridTypeReadable = grid.getGridTypeReadable;
  public setGridType = grid.setGridType;

  // INITIALIZE
  protected initializeBackground = initialize.initializeBackground;
  protected initializeViewport = initialize.initializeViewport;
  protected initializeScene = initialize.initializeScene;
  protected initializeGrid = initialize.initializeGrid;

  public setSceneSize(values: any, sceneController: SceneController): void {
    // TODO - balance the values

    sceneController.background.height = parseInt(values.height);
    sceneController.background.width = parseInt(values.width);
    sceneController.background.x = 0;
    sceneController.background.y = 0;
    sceneController.gridSize = parseInt(values.gridSize);
    sceneController.gridType = parseInt(values.gridType);
    sceneController.centerViewport();
    sceneController.buildGrid();

  }

  // SNAP
  public snap = snap.snap;

}
