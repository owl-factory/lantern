import { Viewport } from "pixi-viewport";
import { Container, Sprite, Texture } from "pixi.js";
import { SceneController } from "./SceneController";

/**
 * Initializes the background component of the app. This is a null space that has a basic texture
 * and lives behind everything in the camera for a bit of visual distinction
 */
export function initializeBackground(this: SceneController): void {
  const background = new Sprite(Texture.WHITE);
  background.tint = 0x444444;
  background.height = this.app.stage.height;
  background.width = this.app.stage.width;

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
    .decelerate();

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

  const background = new Sprite(Texture.WHITE);
  background.anchor.set(0.5);
  background.width = 250;
  background.height = 250;

  this.scene.addChild(background);

  background.x = background.parent.width / 2;
  background.y = background.parent.height / 2;

  background.zIndex = -1;

  this.scene.interactive = true;
  // this.scene.buttonMode = true;

  this.viewport.addChild(this.scene);
}
