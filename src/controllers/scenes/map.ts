import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { action, makeObservable, observable } from "mobx";
import { BackgroundController } from "./background";
import { GridController } from "./GridController";
import { PixiController } from "./pixi";
import { ViewportController } from "./viewport";


class $MapController {
  public height: number;
  public width: number;

  public map: Container;

  constructor() {
    this.height = 640;
    this.width = 640;

    this.map = new Container();

    makeObservable(this, {
      height: observable,
      width: observable,
      setSize: action,
    });
  }

  public init() {
    ViewportController.init();
    ViewportController.viewport.addChild(this.map);
    BackgroundController.init();
    GridController.init();
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
