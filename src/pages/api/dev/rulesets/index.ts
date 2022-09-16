import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { NextApiRequest } from "next";
import { getPrismaClient } from "utilities/prisma";
import { requireLogin } from "utilities/validation/account";


/**
 * Fetches a list of rulesets from their refs
 */
export async function getRulesets() {
  const prisma = getPrismaClient();

  const rulesets = await prisma.ruleset.findMany({
    where: { deletedAt: null },
  });
  return rulesets;
}

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetsRequest(this: HTTPHandler, req: NextApiRequest) {
  const rulesets = await getRulesets();
  this.returnSuccess({ rulesets });
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createRuleset(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();

  const prisma = getPrismaClient();

  // TODO - validate
  const createdRuleset = await prisma.ruleset.create({
    data: req.body.ruleset,
  });
  this.returnSuccess({ ruleset: createdRuleset });
}

export default createEndpoint({
  GET: getRulesetsRequest,
  POST: getRulesetsRequest,
  PUT: createRuleset,
});
