import { ActiveData } from "nodes/active-data";
import { Mediator, MediatorMessage } from "nodes/mediator";
import { rollDice } from "nodes/rolls";
import { ViewRenderer } from "nodes/view-renderer/controllers/ViewRenderer";
import { StateType } from "nodes/view-renderer/enums/stateType";

/**
 * An action run by a click from an Actor Sheet button element.
 * It creates a new piece of content for the given render and content type
 * @param renderID The render ID that this content is being created for
 * @param contentGroup The type of content that is being created
 */
 export function createContent(renderID: string, contentGroup: string) {
  const sources = ViewRenderer.renders[renderID].sources;
  if (!sources.actorID) { return; } // Do nothing if this doesn't exist

  // Grab any existing contents to add a new element to
  const contents = ActiveData.getContents(sources.actorID, contentGroup) || [];
  contents.push({});
  ActiveData.setContents(sources.actorID, contentGroup, contents);
}

/**
 * Removes a piece of content from a list
 * @param renderID The ID of the render to remove a piece of content from
 * @param contentGroup The type of content being removed
 * @param index The index of the content to remove
 */
export function deleteContent(renderID: string, contentGroup: string, index: number) {
  const sources = ViewRenderer.renders[renderID].sources;
  if (!sources.actorID) { return; } // Do nothing if this doesn't exist

  // Grab any existing contents to add a new element to
  const contents = ActiveData.getContents(sources.actorID, contentGroup) || [];
  contents.splice(index, 1);
  ActiveData.setContents(sources.actorID, contentGroup, contents);
}

/**
 * Toggles a collapse state to be open or closed
 * @param renderID The ID of the render using this state
 * @param key The ID of the collapse element to toggle the open or closed state
 */
export function toggleCollapse(renderID: string, key: string) {
  const currentState = ViewRenderer.getState(renderID, StateType.Collapse, key) || false;
  ViewRenderer.setState(renderID, StateType.Collapse, key, !currentState);
}

/**
 * Runs a roll based on the string passed by the roll action
 * @param renderID The ID of the render this roll is for
 * @param rollStr The string to roll
 */
export function rollAction(_renderID: string, rollStr: string) {
  const rollResult = rollDice(rollStr);
  Mediator.post(MediatorMessage.Roll, { roll: rollResult});
}
