import { Container } from "@pixi/display";
import { GridFormValues } from "components/reroll/scenes/forms/grid";
import { action, makeObservable, observable } from "mobx";
import { BackgroundController } from "./background";
import { GridController } from "./grid";
import { TokenController } from "./token";
import { ViewportController } from "./viewport";

/**
 * The base controller that connects and manages the Map. That is, everything that can be or may be rendered
 * within a Pixi canvas and anything that may affect it internally
 */
class $MapController {
  public height: number; // The height of the map
  public width: number; // The width of the map

  public map: Container; // The container holding everything within the map

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

  /**
   * Initializes all controllers directly dependent on this map controller
   */
  public init() {
    ViewportController.init();
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

  /**
   * Sets the offset of the canvas from the upper left corner of the browser window
   * @param xOffset The offset in pixels from the left side of the browser window
   * @param yOffset The offset in pixels from the top of the browser window
   */
  public setOffset(xOffset: number, yOffset: number) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }

  /**
   * Adds an object to the map via a drag option
   * @param event The event that causes an object to be added to the map via a drag action
   */
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

  /**
   * Adds an image to the map
   * @param id The ID of the image to add
   * @param x The x position of where the image should be placed
   * @param y The y position of where the image should be placed
   */
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
