import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { PrismaClient } from "@prisma/client";
import { pbkdf2, timingSafeEqual } from "crypto";
import { signinAs } from "nodes/user/jwt";

const prisma = new PrismaClient();

/**
 * Sign in to your user account.
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function signIn(this: HTTPHandler, req: NextApiRequest) {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  const userSecret = await prisma.userSecret.findFirst({
    where: {
        OR: [ { username }, { email: username } ],
    },
  });

  if(!userSecret) {
    this.returnError(401, "Incorrect username or password.");
    return;
  }

  pbkdf2(password, userSecret.salt, 310000, 32, 'sha256', async (hashError, hashedPassword) => {
    if (hashError) {
      this.returnError(0, hashError.message);
      return;
    }

    if (!timingSafeEqual(userSecret.hashedPassword, hashedPassword)) {
        this.returnError(401, "Incorrect username or password.");
        return;
    }

    const user = await prisma.user.findUnique({
         where: {
            id: userSecret.userID,
         },
    });

    if(!user) {
      this.returnError(401, "Something went horribly wrong, cannot find user data.");
      return;
    }

    const jwt = signinAs(user);
    this.returnSuccess({ jwt });
  });
}

export default createEndpoint({POST: signIn});
