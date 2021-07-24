import { InteractionEvent, Sprite } from "pixi.js";
import { Prop } from "types/reroll/scene";
import { PropMovement } from "./PropMovement";
import { SceneController } from "../SceneController";

enum PixiEventType {
  Click,
  MouseDown,
  MouseMove,
  MouseOver,
  MouseUp,
  MouseUpOutside,
  PointerCancel,
  PointerDown,
  PointerMove,
  PointerOut,
  PointerOver,
  PointerTap,
  PointerUp,
  PointerUpOutside,
  RightClick,
  RightDown,
  RightUp,
  RightUpOutside,
  Tap,
  TouchCancel,
  TouchEnd,
  TouchEndOutside,
  TouchMove,
  TouchStart,
}

const pixiEventTypeReadable = [
  "Click",
  "MouseDown",
  "MouseMove",
  "MouseOver",
  "MouseUp",
  "MouseUpOutside",
  "PointerCancel",
  "PointerDown",
  "PointerMove",
  "PointerOut",
  "PointerOver",
  "PointerTap",
  "PointerUp",
  "PointerUpOutside",
  "RightClick",
  "RightDown",
  "RightUp",
  "RightUpOutside",
  "Tap",
  "TouchCancel",
  "TouchEnd",
  "TouchEndOutside",
  "TouchMove",
  "TouchStart",
];

export class PropEvents {
  protected controller: SceneController;
  protected propMovement: PropMovement;

  constructor(controller: SceneController) {
    this.controller = controller;
    this.propMovement = new PropMovement(this.controller);
  }

  public subscribe(prop: Prop): void {
    prop
      .on("pointerdown", (e: InteractionEvent) => this.onPointerDown(e, prop, this.controller))
      .on("pointerup", (event: InteractionEvent) => this.onPointerUp(event, prop, this.controller))
      .on("pointerupoutside", (event: InteractionEvent) => this.onPointerUpOutside(event, prop, this.controller))
      .on("pointermove", (event: InteractionEvent) => this.onPointerMove(event, prop, this.controller));
  }

  protected onPointerDown(event: InteractionEvent, prop: Prop, controller: SceneController): void {
    controller.getPropManager().getMovement().startMove(event, prop);
  }

  protected onPointerUp(event: InteractionEvent, prop: Prop, controller: SceneController): void {
    controller.getPropManager().getMovement().endMove(event, prop);
  }

  protected onPointerUpOutside(event: InteractionEvent, prop: Prop, controller: SceneController): void {
    controller.getPropManager().getMovement().endMove(event, prop);
  }

  protected onPointerMove(event: InteractionEvent, prop: Prop, controller: SceneController): void {
    controller.getPropManager().getMovement().move(event, prop);
  }

}