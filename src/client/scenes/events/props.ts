import { InteractionEvent } from "pixi.js";
import { Prop, SceneController } from "../SceneController";

/**
 * Handles all events that occur when clicking down on a prop
 * @param event The event fired when clicking on this Prop
 * @param prop The prop that is clicked on
 * @param sceneController The scene controller that the event and prop belong to
 */
export function onPointerDown(event: InteractionEvent, prop: Prop, sceneController: SceneController): void {
  // TODO - check clicked button. The below is all left click

  // Prevents dragging the scene while clicking
  sceneController.viewport.plugins.pause('drag');

  // Sets the original position to apply stickiness to the prop
  prop.originalPosition = {
    x: prop.x,
    y: prop.y,
  };

  prop.dragging = true;
  prop.data = event.data;

  sceneController.selected = [prop];
  refreshSelected(sceneController);

  // Prevents an issue where the icon snaps to center when attempting to move it
  setClickedAnchor(prop, event);
}

export function onPointerUp(event: InteractionEvent, prop: Prop, sceneController: SceneController): void {
  // TODO - check clicked button. The below is all left click

  // TODO - snap!

  prop.dragging = false;
  prop.data = null;

  sceneController.selected = [];

  sceneController.viewport.plugins.resume('drag');
  resetClickedAnchor(prop, event);
}

export function onPointerMove(event: InteractionEvent, prop: Prop, sceneController: SceneController): void {
  if (!prop.dragging || !prop.data) { return; }
  const newPosition = prop.data.getLocalPosition(prop.parent);
  prop.x = newPosition.x;
  prop.y = newPosition.y;
  return;
}

/**
 * Resets the clicked acnhor to the center of the sprite again
 * @param prop The prop to reset the anchor for
 * @param event The event which clicked this prop
 */
function resetClickedAnchor(prop: Prop, event: InteractionEvent): void {
  const clickedAt = event.data.getLocalPosition(prop.parent);

  const x = -1 * prop.width * (prop.anchor.x - 0.5) + clickedAt.x;
  const y = -1 * prop.height * (prop.anchor.y - 0.5) + clickedAt.y;

  prop.anchor.set(0.5);
  prop.x = x;
  prop.y = y;
}

/**
 * Sets the new anchor of the prop to prevent it from jerking when being clicked
 * @param prop The prop to set the new anchor for
 * @param event The event that interacted with this prop
 */
function setClickedAnchor(prop: Prop, event: InteractionEvent): void {
  const clickedAt = event.data.getLocalPosition(prop.parent);
  const anchorX = 0.5 + ((clickedAt.x - prop.x) / prop.width);
  const anchorY = 0.5 + ((clickedAt.y - prop.y) / prop.height);

  prop.anchor.set(anchorX, anchorY);
  prop.x = clickedAt.x;
  prop.y = clickedAt.y;
}
