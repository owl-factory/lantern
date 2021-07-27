import { Sprite } from "pixi.js";
import { ImageDocument } from "types/documents";
import { Actor, Prop } from "types/reroll/scene";
import { PropEvents } from "./PropEvents";
import { SceneController } from "../SceneController";

import * as PIXI from "pixi.js"
import { PropMovement } from "./PropMovement";

type PropData = Record<string, Prop>;

export class PropManager {
  protected controller: SceneController;
  protected props: Record<string, Prop | Actor>;
  protected propEvents: PropEvents;
  protected propMovement: PropMovement;


  constructor(controller: SceneController) {
    this.controller = controller;
    this.props = {};
    this.propEvents = new PropEvents(this.controller);
    this.propMovement = new PropMovement(this.controller);
  }

  public export(): PropData {
    return {};
  }

  public import(data: PropData) {
    return;
  }

  public geEvents(): PropEvents { return this.propEvents; }
  public getMovement(): PropMovement { return this.propMovement; }

  /**
   * Adds a single prop to the scene
   * @param image The image to add to the scene
   * @param x The x coordinate to add it. Defaults to the center of the scene
   * @param y The y coordinate to add it. Defaults to the center of the scene
   */
  public addProp(image: ImageDocument, x?: number, y?: number): void {
    const key = (new Date()).toString();
    const prop = Sprite.from(image.src as string);
    console.log(prop);

    (prop as Prop).image = image;
    (prop as Prop).key = key;

    prop.interactive = true;
    prop.buttonMode = true;

    prop.anchor.set(0.5);
    prop.x = x || this.controller.getScene().getX() + this.controller.getScene().getWidth() / 2;
    prop.y = y || this.controller.getScene().getY() + this.controller.getScene().getHeight() / 2;

    // TODO - subscribe
    // subscribeProp(prop as Prop, sceneController);
    this.propEvents.subscribe(prop as Prop);

    this.controller.getScene().addChild(prop);
    this.props[(prop as Prop).key] = prop as Prop;
  }
}
