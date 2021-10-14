import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { action, makeObservable, observable } from "mobx";
import { PixiController } from "./pixi";


class $MapController {
  public height: number;
  public width: number;
  public backgroundColor: string;

  protected map: Container;
  protected background: Sprite;

  constructor() {
    this.height = 100;
    this.width = 100;
    this.backgroundColor = "FFFFFF";

    this.map = new Container();
    this.background = new Sprite(Texture.WHITE);

    makeObservable(this, {
      height: observable,
      width: observable,
      setSize: action,
    });
  }

  public init() {
    // this.pixi.addChild(this.map);
  }

  /**
   * Loads in map data to the controller and runs any code to reload the map
   * @param map The map data to load into the controller
   */
  public load(map: any) {
    this.height = map.height;
    this.width = map.width;
  }

  /**
   * Exports the map data out into a saveable format for storage
   */
  public save() {
    return {
      height: this.height,
      width: this.width,
    };
  }

  /**
   * Sets the height of the map
   * @param height The new height of the map
   */
  public setHeight(height: number) {
    this.setSize(height, this.width);
  }

  /**
   * Sets the width of the map
   * @param width The new width of the map
   */
  public setWidth(width: number) {
    this.setSize(this.height, width);
  }

  /**
   * Sets the size values for the map
   * @param height The new height of the map
   * @param width The new width of the map
   */
  public setSize(height: number, width: number) {
    this.height = height;
    this.width = width;
  }
}

export const MapController = new $MapController();
