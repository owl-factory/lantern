import { InteractionEvent } from "@pixi/interaction";
import { Prop } from "types/reroll/scene";
import { SceneController } from "../SceneController";

export class PropMovement {
  protected controller: SceneController;

  constructor(controller: SceneController) {
    this.controller = controller;
  }

  public startMove(event: InteractionEvent, prop: Prop): void {
    // TODO - check clicked button. The below is all left click

    // Prevents dragging the scene while clicking
    this.controller.getViewport().pause('drag');

    // Sets the original position to apply stickiness to the prop
    prop.originalPosition = {
      x: prop.x,
      y: prop.y,
    };

    prop.dragging = true;
    prop.data = event.data;

    // Prevents an issue where the icon snaps to center when attempting to move it
    this.setClickedAnchor(event, prop);
  }

  public move(event: InteractionEvent, prop: Prop): void {
    if (!prop.dragging || !prop.data) { return; }
    const newPosition = prop.data.getLocalPosition(prop.parent);
    prop.x = newPosition.x;
    prop.y = newPosition.y;
  }

  public endMove(event: InteractionEvent, prop: Prop): void {
    prop.dragging = false;
    prop.data = null;

    this.controller.getViewport().resume('drag');
    this.resetClickedAnchor(event, prop);
  }

  
  /**
   * Resets the clicked acnhor to the center of the sprite again
   * @param event The event which clicked this prop
   * @param prop The prop to reset the anchor for
   */
  private resetClickedAnchor(event: InteractionEvent, prop: Prop): void {
    const clickedAt = event.data.getLocalPosition(prop.parent);

    const x = -1 * prop.width * (prop.anchor.x - 0.5) + clickedAt.x;
    const y = -1 * prop.height * (prop.anchor.y - 0.5) + clickedAt.y;

    prop.anchor.set(0.5);
    prop.x = x;
    prop.y = y;
  }

  /**
   * Sets the new anchor of the prop to prevent it from jerking when being clicked
   * @param event The event that interacted with this prop
   * @param prop The prop to set the new anchor for
   */
  private setClickedAnchor(event: InteractionEvent, prop: Prop) {
    console.log(event)
    const clickedAt = event.data.getLocalPosition(prop.parent);
    const anchorX = 0.5 + ((clickedAt.x - prop.x) / prop.width);
    const anchorY = 0.5 + ((clickedAt.y - prop.y) / prop.height);

    prop.anchor.set(anchorX, anchorY);
    prop.x = clickedAt.x;
    prop.y = clickedAt.y;
  }

}
