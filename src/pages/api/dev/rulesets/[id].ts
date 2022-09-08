import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { PrismaClient } from "@prisma/client";

/**
 * Fetches a single ruleset
 */
export async function getRuleset(id: string) {
  const prisma = new PrismaClient();

  const ruleset = await prisma.ruleset.findFirst({
    where: { id, deletedAt: null },
  });
  return ruleset;
}

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetRequest(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await getRuleset(req.query.id as string);
  this.returnSuccess({ ruleset });
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await this.prisma.ruleset.update({
    data: req.body.ruleset,
    where: { id: req.query.id as string },
  });
  this.returnSuccess({ ruleset });
}

/**
 * Deletes a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function deleteRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await this.prisma.ruleset.update({
    data: { deletedAt: new Date() },
    where: { id: req.query.id as string },
  });
  this.returnSuccess({ ruleset });
}

export default createEndpoint({
  GET: getRulesetRequest,
  PATCH: updateRuleset,
  DELETE: deleteRuleset,
});
