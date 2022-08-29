import { InteractionEvent } from "pixi.js";
import { Prop, SceneController } from "./SceneController";
import * as propEvents from "./events/props";

/**
 * Subscribes a given prop to pointer events
 * @param prop The prop object to subscribe to things
 * @param sceneController The parent scene controller
 */
export function subscribeProp(prop: Prop, sceneController: SceneController) {
  prop
    .on("pointerdown", (event: InteractionEvent) => propEvents.onPointerDown(event, prop, sceneController))
    .on("pointerup", (event: InteractionEvent) => propEvents.onPointerUp(event, prop, sceneController))
    .on("pointerupoutside", (event: InteractionEvent) => propEvents.onPointerUp(event, prop, sceneController))
    .on("pointermove", (event: InteractionEvent) => propEvents.onPointerMove(event, prop, sceneController));
}
