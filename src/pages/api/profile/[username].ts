import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";

/**
 * Gets all of the information needed to render a user's profile page
 */
export async function getProfile(params: Record<string, unknown>) {

  return { user: {} };
}

/**
 * Gets a single profile for the profile page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getProfileRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getProfile(req.query));
}

/**
 * Updates a single profile for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfile(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ user: {} });
}

export default createEndpoint({GET: getProfileRequest, PATCH: updateProfile});
