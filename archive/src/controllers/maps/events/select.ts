import { InteractionEvent, Point } from "pixi.js";
import { GridType, Interactable, SceneController } from "../SceneController";

/**
 * Handles the beginning of onSelect
 * @param event The event triggering the onSelect action
 * @param target The target sprite or container to interact with
 * @param sceneController The scene, as `this` is unavailable
 */
export function onSelectStart(event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
  if (target === sceneController.scene) { return; }
  sceneController.viewport.plugins.pause('drag');

  target.originalPosition = {
    x: target.x,
    y: target.y,
  };

  target.dragging = true;
  target.data = event.data;
  target.dragPoint = event.data.getLocalPosition(target.parent);
  target.dragPoint.x -= target.x;
  target.dragPoint.y -= target.y;
}

/**
 * Handles the end of onSelect
 * @param event The event triggering the onSelect action's end
 * @param target The target sprite or container to interact with
 * @param sceneController The scene, as `this` is unavailable
 */
export function onSelectEnd(_event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
  if (!target.dragging || !target.data) { return; }
  sceneController.viewport.plugins.resume('drag');
  const newPosition = sceneController.snap(target.data.getLocalPosition(target.parent));
  target.x = newPosition.x;
  target.y = newPosition.y;
  target.dragging = false;
  target.data = null;
  return;
}

/**
 * Handles the movement of onSelect
 * @param event The event triggering the onSelect movement
 * @param target The target sprite or container to interact with
 * @param sceneController The scene, as `this` is unavailable
 */
export function onSelectMove(_event: InteractionEvent, target: Interactable, sceneController: SceneController): void {
  if (!target.dragging || !target.data) { return; }
  const newPosition = target.data.getLocalPosition(target.parent);
  target.x = newPosition.x;
  target.y = newPosition.y;
  return;
}

