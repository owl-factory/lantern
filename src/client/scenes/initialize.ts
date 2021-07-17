import { Viewport } from "pixi-viewport";
import { Container, Sprite, Texture } from "pixi.js";
import { GridType } from "types/enums/scene";
import { DEFAULT_GRID_SIZE } from "./consts";
import { Interactable, SceneController } from "./SceneController";

/**
 * Initializes the background component of the app. This is a null space that has a basic texture
 * and lives behind everything in the camera for a bit of visual distinction
 * TODO - is there a better way of doing this?
 */
export function initializeBackground(this: SceneController): void {
  const background = new Sprite(Texture.WHITE);
  background.tint = 0x444444;
  background.x = 0;
  background.y = 0;
  background.height = 1000;
  background.width = 1000;

  this.app.stage.addChild(background);
}

/**
 * Initializes the viewport and camera
 */
export function initializeViewport(this: SceneController): void {
  this.viewport = new Viewport({
    screenWidth: 1000,
    screenHeight: 1000,
    worldWidth: 1000,
    worldHeight: 1000,

    interaction: this.app.renderer.plugins.interaction,
  });

  this.viewport
    .drag({ mouseButtons: "middle" })
    .pinch()
    .wheel()
    .decelerate({ friction: 0.95, minSpeed: 0.5 });

  this.app.stage.addChild(this.viewport);
}

/**
 * Initializes the scene that contains all of the props and actors.
 */
export function initializeScene(this: SceneController): void {
  this.scene = new Container();
  this.scene.width = 250;
  this.scene.height = 250;
  this.scene.pivot.set(0.5);

  this.background = new Sprite(Texture.WHITE);
  this.background.anchor.set(0);
  this.background.width = 256;
  this.background.height = 256;

  this.scene.addChild(this.background);

  this.background.x = 0;
  this.background.y = 0;

  this.background.zIndex = -1;

  // this.scene.interactive = true;
  // this.scene.buttonMode = true;

  this.subscribe(this.scene as Interactable);

  this.viewport.addChild(this.scene);
}

/**
 * Initializes a grid
 */
export function initializeGrid(this: SceneController): void {
  this.gridType = GridType.Squares;
  this.gridSize = DEFAULT_GRID_SIZE;

  this.buildGrid();
  this.scene.addChild(this.grid);
}
