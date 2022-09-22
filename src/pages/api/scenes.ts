import "reflect-metadata";
import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";


/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createScene(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ scene: {} });
}

export default createEndpoint({
  PUT: createScene,
});
