import { Sprite, Texture } from "pixi.js";
import { SceneController } from "./SceneController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BackgroundData {}

/**
 * Manages the application background that sits behind the viewport and scene
 * TODO - name this better to avoid confusion with scene background.
 * TODO - give a more textured backdrop. Potentially changeable? IE a rocky background for when
 * the players are in caves, trees for forests, grass for plains, etc
 */
export class Background {
  protected controller: SceneController;
  protected background: Sprite;

  constructor(controller: SceneController) {
    this.controller = controller;
    this.background = new Sprite(Texture.WHITE);

    this.background.tint = 0x444444;
    this.background.x = 0;
    this.background.y = 0;
    this.background.height = 1000;
    this.background.width = 1000;
  }

  /**
   * Registers the background. Sets it as a child of the application's stage
   */
  public register(): void {
    this.controller.getApp().stage.addChild(this.background);
  }

  public export(): BackgroundData { return {}; }
  public import(data: BackgroundData): void { return; }
}
