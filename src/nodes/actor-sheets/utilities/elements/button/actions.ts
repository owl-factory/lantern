import { ActorController } from "nodes/actor-sheets";

/**
 * An action run by a click from an Actor Sheet button element.
 * It creates a new piece of content for the given render and content type
 * @param renderID The render ID that this content is being created for
 * @param contentGroup The type of content that is being created
 */
export function createContent(renderID: string, contentGroup: string) {
  ActorController.pushNewContent(renderID, contentGroup);
}
