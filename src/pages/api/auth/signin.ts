import "reflect-metadata";
import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { UserLogic } from "server/logic/UserLogic";
import { UserDocument } from "types/documents";
import { buildFullPermissions, permissionsToBinary } from "@owl-factory/auth";
import { binaryToBase64 } from "@owl-factory/utilities/numbers/base2";


/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function signIn(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.signIn(req.body.username, req.body.password);
  // TODO - optimize user
  const processed = processUserSessionDocument(user);
  this.returnSuccess(processed);
}

/**
 * Processes a user document. Returns a cleaned user without blatant permissions,
 * a base64 string for their permissions, and a JWT (eventually)
 * @param user The user to process
 */
function processUserSessionDocument(user: Partial<UserDocument>) {
  const role = user?.role || "default";
  const permissions = user?.permissions || [];

  delete user?.role;
  delete user?.permissions;

  const fullPermissions: string[] = buildFullPermissions(role, permissions);
  const permissionBinary = permissionsToBinary(fullPermissions);
  const permissionBase64 = binaryToBase64(permissionBinary);

  return { user: user, permissions: permissionBase64, jwt: null };
}

export default createEndpoint({POST: signIn});
