import { MediatorContents, MediatorHandler, MediatorMessage } from "nodes/mediator";

/**
 * Handles mediator interactions within actor sheet editing and viewing
 */

/**
 * Posts the results of a roll
 * @param contents The contents contains the results of the roll, plus any other additional data
 */
function roll(contents: MediatorContents) {
  console.log(contents);
}

export const ActorSheetMediatorHandler: MediatorHandler = {
  [MediatorMessage.Roll]: roll,
};
