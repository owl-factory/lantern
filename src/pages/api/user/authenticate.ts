import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { NextApiRequest } from "next";
import { authenticate } from "nodes/user/jwt";

/**
 * Test user authentication status.
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function authenticateUser(this: HTTPHandler, req: NextApiRequest) {
    const user = authenticate();
    this.returnSuccess({ autheticated: Boolean(user), user });
}

export default createEndpoint({GET: authenticateUser});
