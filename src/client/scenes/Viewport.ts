import { Viewport as PixiViewport } from "pixi-viewport";
import { DisplayObject } from "pixi.js";
import { SceneController } from "./SceneController2";

export class Viewport {
  protected controller: SceneController;
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

  public register(): void {
    this.viewport
    .drag({ mouseButtons: "middle" })
    .pinch()
    .wheel()
    .decelerate({ friction: 0.95, minSpeed: 0.5 });

    this.controller.getApp().stage.addChild(this.viewport);
  }

  public addChild(...children: DisplayObject[]): DisplayObject {
    return this.viewport.addChild(...children);
  }
}
