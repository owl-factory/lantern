import { Container, Graphics, InteractionEvent } from "pixi.js";
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

  // Prevents an issue where the icon snaps to center when attempting to move it
  setClickedAnchor(prop, event);
}

export function onPointerUp(event: InteractionEvent, prop: Prop, sceneController: SceneController): void {
  // TODO - check clicked button. The below is all left click

  // TODO - snap!

  prop.dragging = false;
  prop.data = null;

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

function refreshSelected(sceneController: SceneController) {
  console.log("refresh")
  console.log(sceneController.selected)
  if (sceneController.selected.length === 0) {
    sceneController.selectBox.visible = false;
    return;
  }

  let minX: number = Number.MAX_VALUE;
  let minY: number = Number.MAX_VALUE;
  let maxX: number = Number.MIN_VALUE;
  let maxY: number = Number.MIN_VALUE;
  sceneController.selected.forEach((prop: Prop) => {
    const propMinX = prop.x - (prop.width * prop.anchor.x);
    const propMaxX = prop.x + (prop.width * prop.anchor.x);
    const propMinY = prop.y - (prop.height * prop.anchor.y);
    const propMaxY = prop.y + (prop.height * prop.anchor.y);
    if (propMinX < minX) { minX = propMinX; }
    if (propMinY < minY) { minY = propMinY; }
    if (propMaxX > maxX) { maxX = propMaxX; }
    if (propMaxY > maxY) { maxY = propMaxY; }
  });

  drawSelectionBox(sceneController, minX, minY, maxX, maxY);

}

function drawSelectionBox(sceneController: SceneController, minX: number, minY: number, maxX: number, maxY: number): void {
  const selectColor = 0xAAAAFF;
  const skewBoxSize = 5;

  const width = maxX - minX;
  const height = maxY - minY;

  const box = sceneController.selectBox;
  console.log("box")

  // Draw box
  box.lineStyle(1, selectColor, 1);
  box.moveTo(0, 0);
  box.lineTo(0, height);
  box.lineTo(width, height);
  box.lineTo(width, 0);
  box.lineTo(0, 0);

  box.beginFill(selectColor);
  // TOP LEFT
  box.drawRect(-skewBoxSize, -skewBoxSize, skewBoxSize, skewBoxSize);
  box.endFill()
  // MIDDLE LEFT
  // box.drawRect(-skewBoxSize, (-skewBoxSize / 2) + (height / 2), 0, (skewBoxSize / 2) + (height / 2));
  // box.endFill();
  // BOTTOM LEFT
  // BOTTOM MIDDLE
  // BOTTOM RIGHT
  // MIDDLE RIGHT
  // TOP RIGHT
  // TOP MIDDLE
  

  // box.position = sceneController.selected[0].position;
  box.x = 10;
  box.y = 10;
  

  box.visible = true;

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
