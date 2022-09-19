import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { NextApiRequest } from "next";
import { getPrismaClient } from "utilities/prisma";
import { requireLogin } from "utilities/validation/account";


/**
 * Fetches a list of actor sheets
 */
export async function getActorSheets() {
  const prisma = getPrismaClient();

  const actorSheets = await prisma.actorSheet.findMany({
    include: { ruleset: true },
    where: { deletedAt: null },
  });
  return actorSheets;
}

/**
 * Fetches the given actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorSheetsRequest(this: HTTPHandler, req: NextApiRequest) {
  const actorSheets = await getActorSheets();
  this.returnSuccess({ actorSheets });
}

/**
 * Creates an actor sheet
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createActorSheet(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();

  const prisma = getPrismaClient();

  // TODO - validate
  const createdActorSheet = await prisma.actorSheet.create({
    data: {
      name: "Untitled Actor Sheet",
      layout: "<Sheet><Layout></Layout></Sheet>",
      styling: "",
      ruleset: { connect: { id: req.body.actorSheet.rulesetID } },
    },
  });
  this.returnSuccess({ actorSheet: createdActorSheet });
}

export default createEndpoint({
  GET: getActorSheetsRequest,
  POST: getActorSheetsRequest,
  PUT: createActorSheet,
});
