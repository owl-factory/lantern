import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { MapController } from "./map";

/**
 * Handles the background of the map, including the size, color, and image(s) that serve as the map or setting
 */
class $BackgroundController {
  public color: number;
  public images: any[]; // The image(s) that make up the background, such as the map. TODO - implement this

  // TODO - can we observe these values changing?
  protected height: number; // The height of the background. Copied from MapController
  protected width: number; // The width of the background. Copied from MapController

  protected background: Container;
  protected backgroundColor: Sprite;

  constructor() {
    this.color = 0xCCCCCC;
    this.images = [];

    this.height = 0;
    this.width = 0;

    this.background = new Container();
    this.backgroundColor = new Sprite(Texture.WHITE);

    this.backgroundColor.tint = this.color;

    this.background.addChild(this.backgroundColor);

    this.background.zIndex = Number.MIN_SAFE_INTEGER;
  }

  public init() {
    this.height = MapController.height;
    this.width = MapController.width;

    this.backgroundColor.height = this.height;
    this.backgroundColor.width = this.width;

    MapController.map.addChild(this.background);
  }
}

export const BackgroundController = new $BackgroundController();
