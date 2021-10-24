import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { GridFormValues } from "components/reroll/scenes/forms/grid";
import { ImageManager } from "controllers/data/image";
import { action, makeObservable, observable } from "mobx";
import { BackgroundController } from "./background";
import { GridController } from "./grid";
import { TokenController } from "./token";
import { PixiController } from "./pixi";
import { ViewportController } from "./viewport";
import { CharacterController } from "./character";


class $MapController {
  public height: number;
  public width: number;

  public map: Container;

  public xOffset: number; // The distance between the map and the left side of the page
  public yOffset: number; // The distance between the map and the left size of the page

  constructor() {
    this.height = 640;
    this.width = 640;

    this.map = new Container();

    this.xOffset = 0;
    this.yOffset = 0;

    makeObservable(this, {
      height: observable,
      width: observable,
      setSize: action,
      setMap: action,
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

  /**
   * Sets the map size and grid values for Map, Background, and Grid controllers
   * @param values The values from the grid form to update the current map
   */
  public setMap(values: GridFormValues) {
    this.setSize(values.height, values.width);
    BackgroundController.setSize(values.height, values.width);
    GridController.setAll(values.gridSize, values.gridType);
    return;
  }

  public setOffset(xOffset: number, yOffset: number) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }

  public addUsingDrag(event: any) {
    const id = event.dataTransfer.getData("id");
    const type = event.dataTransfer.getData("type");

    // The raw drop position of the event
    const x = event.clientX - this.xOffset;
    const y = event.clientY - this.yOffset;

    switch(parseInt(type)) {
      case MapDraggable.Image:
        this.addImage(id, x, y);
        break;
      default:
        console.error("Not supported");
    }
  }

  private addImage(id: string, x: number, y: number) {
    // TODO - hook up with a temporary character
    const token = TokenController.add(id, x, y);
  }
}

// TODO - move to somewhere more important
export enum MapDraggable {
  Image, // A plain image
  Character,
  CharacterTemplate, // A variable template of an NPC. Adding it populates the data and creates an ephemeral character
  Sound, // A reference to a sound to be dragged onto the map, either music or ambient sounds
}

export const MapController = new $MapController();
