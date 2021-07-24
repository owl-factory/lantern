import { Viewport as PixiViewport } from "pixi-viewport";
import { DisplayObject } from "pixi.js";
import { SceneController } from "./SceneController";

/**
 * Manages the viewport for the scene controller
 */
export class Viewport {
  // The base controller that connects all the parts that make up a scene
  protected controller: SceneController;
  // The viewport that controls the camera
  protected viewport: PixiViewport;

  constructor(controller: SceneController) {
    this.controller = controller;

    this.viewport = new PixiViewport({
      screenWidth: 1000,
      screenHeight: 1000,
      worldWidth: 1000,
      worldHeight: 1000,

      interaction: this.controller.getApp().renderer.plugins.interaction,
    });
  }

  /**
   * Registers the viewport. Sets all configuration and adds to the app stage
   */
  public register(): void {
    this.viewport
      .drag({ mouseButtons: "middle" })
      .pinch()
      .wheel()
      .decelerate({ friction: 0.95, minSpeed: 0.5 });

    this.controller.getApp().stage.addChild(this.viewport);
  }

  /**
   * Adds one or more display objects to the viewport. Returns the first added object
   * @param children The display object(s) to add
   */
  public addChild(...children: DisplayObject[]): DisplayObject {
    return this.viewport.addChild(...children);
  }

  public pause(plugin: string): void {
    this.viewport.plugins.pause(plugin);
  }

  public resume(plugin: string): void {
    this.viewport.plugins.resume(plugin);
  }
}
