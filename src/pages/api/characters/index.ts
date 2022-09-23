import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { requireLogin } from "utilities/validation/account";
import { getPrismaClient } from "utilities/prisma";

export async function getActors(userID: string) {
  const prisma = getPrismaClient();
  const actors = await prisma.actor.findMany({
    where: { ownedBy: userID },
  });
}

/**
 * Fetches the actor sheets for the given refs
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorsRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

/**
 * Creates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createActors(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({
  POST: getActorsRequest,
  PUT: createActors,
});
