import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "utilities/prisma";
import { getActorSheets } from ".";

/**
 * Fetches a single actor sheet
 */
export async function getActorSheet(id: string) {
  const prisma = new PrismaClient();

  const actorSheet = await prisma.actorSheet.findFirst({
    include: { ruleset: true },
    where: { id, deletedAt: null },
  });

  if (!actorSheet) { return { actorSheet, ruleset: undefined }; }

  const ruleset = actorSheet.ruleset;
  return {actorSheet, ruleset};
}

/**
 * Fetches an actor sheet
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorSheetRequest(this: HTTPHandler, req: NextApiRequest) {
  const actorSheet = await getActorSheet(req.query.id as string);
  this.returnSuccess({ actorSheet });
}

/**
 * Creates an actor sheet
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateActorSheet(this: HTTPHandler, req: NextApiRequest) {
  const prisma = getPrismaClient();

  const actorSheet = await prisma.actorSheet.update({
    data: req.body.actorSheet,
    where: { id: req.query.id as string },
  });
  this.returnSuccess({ actorSheet });
}

/**
 * Deletes an actor sheet
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function deleteActorSheet(this: HTTPHandler, req: NextApiRequest) {
  const prisma = getPrismaClient();
  const actorSheet = await prisma.actorSheet.update({
    data: { deletedAt: new Date() },
    where: { id: req.query.id as string },
  });
  const actorSheets = await getActorSheets();
  this.returnSuccess({ deletedActorSheet: actorSheet, actorSheets });
}

export default createEndpoint({
  GET: getActorSheetRequest,
  PATCH: updateActorSheet,
  DELETE: deleteActorSheet,
});
