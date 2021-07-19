import { Sprite, Texture } from "pixi.js";
import { SceneController } from "./SceneController2";

export class Background {
  protected controller: SceneController;
  protected render: Sprite;

  constructor(controller: SceneController) {
    this.controller = controller;
    this.render = new Sprite(Texture.WHITE);

    this.render.tint = 0x444444;
    this.render.x = 0;
    this.render.y = 0;
    this.render.height = 1000;
    this.render.width = 1000;
  }

  public register(): void {
    this.controller.getApp().stage.addChild(this.render);
  }
}
