import { InteractionEvent } from "pixi.js";
import { Interactable, SceneController } from "../SceneController";

/**
 * Handles the beginning of onPan
 * @param event The event triggering the onPan action
 * @param target The target sprite or container to interact with
 * @param sceneController The scene, as `this` is unavailable
 */
export function onPanStart(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
  sceneController.viewport.drag({ mouseButtons: undefined });
}

/**
 * Handles the end of onPan
 * @param event The event triggering the onPan action's end
 * @param target The target sprite or container to interact with
 * @param sceneController The scene, as `this` is unavailable
 */
export function onPanEnd(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
  sceneController.viewport.drag({ mouseButtons: "middle" });

}

/**
 * Handles the movement of onPan
 * @param event The event triggering the onPan action
 * @param target The target sprite or container to interact with
 * @param sceneController The scene, as `this` is unavailable
 */
export function onPanMove(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
  // Empty
}
