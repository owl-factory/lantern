import { ImageData } from "controllers/data/ImageData";
import { InteractionEvent, Sprite, Texture } from "pixi.js";
import { MapController } from "./map";
import { ViewportController } from "./viewport";

interface Token extends Sprite {
  layer?: any;
}

/**
 * Handles the creation and management of all Tokens on the map, that is any image that exists as a sprite
 */
class $TokenController {
  public tokens: Record<string, Token> = {};

  /**
   * Adds a new token onto the map
   */
  public async add(id: string, x: number, y: number) {
    const image = ImageData.get(id);
    if (!image) { return; }

    const sprite: Token = new Sprite(await Texture.fromURL(image.src as string));
    sprite.x = x;
    sprite.y = y;
    sprite.anchor.set(0.5, 0.5);

    // TODO - move this behind security
    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite.on("pointerdown", (event: InteractionEvent) => onPointerDown(event, sprite))
      .on("pointerup", (event: InteractionEvent) => onPointerUp(event, sprite))
      .on("pointerupoutside", (event: InteractionEvent) => onPointerUp(event, sprite))
      .on("pointermove", (event: InteractionEvent) => onPointerMove(event, sprite));

    MapController.map.addChild(sprite);
  }
}

// TODO - move this to SelectionController

/**
 * Handles all events that occur when clicking down on a prop
 * @param event The event fired when clicking on this Prop
 * @param prop The prop that is clicked on
 * @param sceneController The scene controller that the event and prop belong to
 */
 export function onPointerDown(event: InteractionEvent, token: any): void {
  // TODO - check clicked button. The below is all left click

  // Prevents dragging the scene while clicking
  ViewportController.viewport.plugins.pause('drag');

  // Sets the original position to apply stickiness to the prop
  token.originalPosition = {
    x: token.x,
    y: token.y,
  };

  token.dragging = true;
  token.data = event.data;

  // Prevents an issue where the icon snaps to center when attempting to move it
  setClickedAnchor(event, token);
}

export function onPointerUp(event: InteractionEvent, token: any): void {
  // TODO - check clicked button. The below is all left click

  // TODO - snap!

  token.dragging = false;
  token.data = null;

  ViewportController.viewport.plugins.resume('drag');
  resetClickedAnchor(event, token);
}

/**
 * Handles the repositoning of the token while dragging
 */
export function onPointerMove(_event: InteractionEvent, token: any): void {
  if (!token.dragging || !token.data) { return; }
  const newPosition = token.data.getLocalPosition(token.parent);
  token.x = newPosition.x;
  token.y = newPosition.y;
  return;
}

/**
 * Resets the clicked acnhor to the center of the sprite again
 * @param prop The prop to reset the anchor for
 * @param event The event which clicked this prop
 */
function resetClickedAnchor(event: InteractionEvent, token: any): void {
  const clickedAt = event.data.getLocalPosition(token.parent);

  const x = -1 * token.width * (token.anchor.x - 0.5) + clickedAt.x;
  const y = -1 * token.height * (token.anchor.y - 0.5) + clickedAt.y;

  token.anchor.set(0.5);
  token.x = x;
  token.y = y;
}

/**
 * Sets the new anchor of the prop to prevent it from jerking when being clicked
 * @param prop The prop to set the new anchor for
 * @param event The event that interacted with this prop
 */
function setClickedAnchor(event: InteractionEvent, token: any): void {
  const clickedAt = event.data.getLocalPosition(token.parent);

  const anchorX = 0.5 + ((clickedAt.x - token.x) / token.width);
  const anchorY = 0.5 + ((clickedAt.y - token.y) / token.height);

  token.anchor.set(anchorX, anchorY);
  token.x = clickedAt.x;
  token.y = clickedAt.y;
}

export const TokenController = new $TokenController();
