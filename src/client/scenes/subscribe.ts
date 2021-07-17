import { InteractionEvent } from "pixi.js";
import { SceneController } from "./SceneController";
import * as propEvents from "./events/props";
import { Prop } from "types/reroll/scene";

export function subscribeProp(prop: Prop, sceneController: SceneController): void {
  prop
    .on("pointerdown", (event: InteractionEvent) => propEvents.onPointerDown(event, prop, sceneController))
    .on("pointerup", (event: InteractionEvent) => propEvents.onPointerUp(event, prop, sceneController))
    .on("pointerupoutside", (event: InteractionEvent) => propEvents.onPointerUp(event, prop, sceneController))
    .on("pointermove", (event: InteractionEvent) => propEvents.onPointerMove(event, prop, sceneController));
}
