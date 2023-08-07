import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, HttpHandlerReturnType, createEndpoint } from "nodes/https/backend";
import { ActorSheet } from "@prisma/client";

/**
 * Exports the xml for a given actor sheet
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function exportActorSheet(this: HTTPHandler, req: NextApiRequest) {
  this.returnFormat = HttpHandlerReturnType.XML; // Sets the return format for this function

  const ref = req.query.ref as string;
  const actorSheet = {} as ActorSheet; // await ActorSheetLogic.fetch(ref);

  // Handles case where the actor sheet is not found
  if (!actorSheet) {
    this.returnError(404, `The actor sheet for ref '${ref}' could not be found.`);
    return;
  }
  this.returnSuccess("");
}

export default createEndpoint({GET: exportActorSheet});
