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

/**
 * Removes a piece of content from a list
 * @param renderID The ID of the render to remove a piece of content from
 * @param contentGroup The type of content being removed
 * @param index The index of the content to remove
 */
export function deleteContent(renderID: string, contentGroup: string, index: number) {
  ActorController.deleteContentItem(renderID, contentGroup, index);
}
