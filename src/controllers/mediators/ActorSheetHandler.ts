import { RenderGroup } from "nodes/actor-sheets/types";
import { MediatorContents, MediatorHandler, MediatorMessage } from "nodes/mediator";
import { MediatorRequest } from "nodes/mediator/types/mediator";
import { SandboxController } from "nodes/sandbox/controllers/SandboxController";
import { DataSource } from "nodes/sandbox/enums/dataSource";
import { ParsedExpressionString, SheetProperties } from "nodes/sandbox/types";

/**
 * Handles mediator interactions within actor sheet editing and viewing
 */

/**
 * Renders an expression and returns it to the user
 * @param contents Describes the arguments to render data
 */
async function expr(contents: MediatorContents) {
  return SandboxController.expr(
    contents.expression as ParsedExpressionString,
    contents.properties as SheetProperties,
  );
}

/**
 * Posts the results of a roll
 * @param contents The contents contains the results of the roll, plus any other additional data
 */
function roll(contents: MediatorContents) {
  console.log(contents);
}

export const ActorSheetMediatorHandler: MediatorHandler = {
  [MediatorRequest.SandboxExpr]: expr,
  [MediatorMessage.Roll]: roll,
};
