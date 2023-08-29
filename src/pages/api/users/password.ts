import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "nodes/https/backend";
import { validateRef } from "utilities/validation/ref";
import { passwordFormValidationSchema } from "utilities/validation/users/passwords";
import { validate } from "utilities/validation";
import { Auth } from "controllers/auth";

/**
 * Updates a single user's password
 * @param this The Handler class calling this function
 * @param req The request to the servert
 */
async function updateUserPassword(this: HTTPHandler, req: NextApiRequest) {
  // const ref = Auth.ref;
  // if (!ref) {
  //   this.returnError(403, "You must be logged in to perform this action");
  //   return;
  // }

  // try {
  //   validateRef(ref);
  //   validate(req.body, passwordFormValidationSchema);
  // } catch (e) {
  //   this.returnError(400, e);
  //   return;
  // }

  // const isValidPassword = await UserLogic.identify(ref, req.body.oldPassword);
  // if (!isValidPassword) {
  //   this.returnError(401, "The old password is not valid.");
  //   return;
  // }

  // const user = UserLogic.updatePassword(ref, req.body.newPassword);
  this.returnSuccess({ user: {} });
}

export default createEndpoint({
  PATCH: updateUserPassword,
});

