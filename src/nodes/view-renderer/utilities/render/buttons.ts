
/**
 * An action run by a click from an Actor Sheet button element.
 * It creates a new piece of content for the given render and content type
 * @param renderID The render ID that this content is being created for
 * @param contentGroup The type of content that is being created
 */
 export function createContent(renderID: string, contentGroup: string) {
  // ActorController.pushContent(renderID, contentGroup, {});
}

/**
 * Removes a piece of content from a list
 * @param renderID The ID of the render to remove a piece of content from
 * @param contentGroup The type of content being removed
 * @param index The index of the content to remove
 */
export function deleteContent(renderID: string, contentGroup: string, index: number) {
  // ActorController.deleteContent(renderID, contentGroup, index);
}

/**
 * Toggles a collapse state to be open or closed
 * @param renderID The ID of the render using this state
 * @param key The ID of the collapse element to toggle the open or closed state
 */
export function toggleCollapse(renderID: string, key: string) {
  // const currentState = ActorController.getState(renderID, StateType.Collapse, key);
  // ActorController.setState(renderID, StateType.Collapse, key, !currentState);
}

/**
 * Runs a roll based on the string passed by the roll action
 * @param renderID The ID of the render this roll is for
 * @param rollStr The string to roll
 */
export function rollAction(_renderID: string, rollStr: string) {
  // const rollResult = rollDice(rollStr);
  // Mediator.post(MediatorMessage.Roll, { roll: rollResult});
}
