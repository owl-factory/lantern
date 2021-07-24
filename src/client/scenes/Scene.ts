import { Container, DisplayObject, Sprite, Texture } from "pixi.js";
import { SceneController } from "./SceneController2";

/**
 * Manages the scene
 */
export class Scene {
  // The primary controller for unifying all scene information
  protected controller: SceneController

  // Contains everything that will be displayed in the scene. It stretches and shrinks to fit the size of the
  // largest thing inside of it, so we use background to force things to remain a certain size
  protected scene: Container;

  // The plain background that is used to control the true width of the scene
  protected background: Sprite;

  constructor(controller: SceneController) {
    this.controller = controller;

    this.scene = new Container();
    this.scene.pivot.set(0.5);

    this.background = new Sprite(Texture.WHITE);
    this.background.anchor.set(0);

    this.background.width = 256;
    this.background.height = 256;

    this.scene.addChild(this.background);

    this.background.x = 0;
    this.background.y = 0;

    this.background.zIndex = -1;

    // TODO - add a mask that is an effective duplicate of the background that
    // limits what we can see in the scene to only that (or causes everything else
    // to be transparent)
    // Should this mask be in grid? Or should we have two masks? Grid would trim the non-hex bits
  }

  /**
   * Registers this scene and applies it to the other managers
   */
  public register(): void {
    const viewport = this.controller.getViewport();
    // TODO - move throw check to the actual get function
    if (!viewport) {
      throw "SceneController: Viewport does not exist.";
    }
    viewport.addChild(this.scene);
  }

  /**
   * Adds one or more children to the scene. Returns the first display object added
   * @param children The display object(s) to add to the scene
   */
  public addChild(...children: DisplayObject[]): DisplayObject {
    return this.scene.addChild(...children);
  }

  /**
   * Fetches the height of the scene.
   */
  public getHeight(): number { return this.background.height; }
  /**
   * Fetches the width of the scene
   */
  public getWidth(): number { return this.background.width; }

  public getX(): number { return this.background.x; }
  public getY(): number { return this.background.y; }

  /**
   * Sets the height of the scene
   * @param height The new height in pixels to set
   */
  public setHeight(height: number | string): void {
    height = parseInt(height as string);
    this.background.height = height;
  }

  /**
   * Sets the width of the scene
   * @param width The new width in pixels to set
   */
  public setWidth(width: number | string): void {
    width = parseInt(width as string);
    this.background.width = width;
  }

  /**
   * Sets the x coordinate of the scene
   * @param x The new x position
   */
  public setX(x: number | string): void {
    x = parseInt(x as string);
    this.background.x = x;
  }

  /**
   * Sets the y coordinate of the scene
   * @param y The new y position
   */
  public setY(y: number | string): void {
    y = parseInt(y as string);
    this.background.y = y;
  }
}
