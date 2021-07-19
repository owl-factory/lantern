import { Container, DisplayObject, Sprite, Texture } from "pixi.js";
import { SceneController } from "./SceneController2";

export class Scene {
  protected height: number;
  protected width: number;

  protected controller: SceneController
  protected scene: Container;
  protected background: Sprite;

  constructor(controller: SceneController) {
    this.controller = controller;

    this.height = 128;
    this.width = 128;

    this.scene = new Container();

    this.scene.height = this.height;
    this.scene.width = this.width;
    this.scene.pivot.set(0.5);

    this.background = new Sprite(Texture.WHITE);
    this.background.anchor.set(0);

    this.background.width = 256;
    this.background.height = 256;

    this.scene.addChild(this.background);

    this.background.x = 0;
    this.background.y = 0;

    this.background.zIndex = -1;
  }

  public register(): void {
    const viewport = this.controller.getViewport();
    if (!viewport) {
      throw "SceneController: Viewport does not exist.";
    }
    viewport.addChild(this.scene);
  }

  public addChild(...children: DisplayObject[]): DisplayObject {
    return this.scene.addChild(...children);
  }

  public getHeight(): number { return this.scene.height; }
  public getWidth(): number { return this.scene.width; }

  public setHeight(height: number | string): void {
    height = parseInt(height as string);
    this.scene.height = height;
    this.background.height = height;
  }

  public setWidth(width: number | string): void {
    width = parseInt(width as string);
    this.scene.width = width;
    this.background.width = width;
  }

  public setX(x: number | string): void {
    x = parseInt(x as string);
    this.scene.x = x;
    this.background.x = x;
  }

  public setY(y: number | string): void {
    y = parseInt(y as string);
    this.scene.y = y;
    this.background.y = y;
  }
}