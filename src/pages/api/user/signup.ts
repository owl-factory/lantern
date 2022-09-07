import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { PrismaClient } from "@prisma/client";
import { pbkdf2, randomBytes } from "crypto";

const prisma = new PrismaClient();

/**
 * Sign up for a new user account.
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function signUp(this: HTTPHandler, req: NextApiRequest) {
  if (process.env.NODE_ENV === "production") {
    this.returnError(401, "Account creation is disabled at this time.");
    return;
  }

  const username = req.body.username.toLowerCase();
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  const salt = randomBytes(16);

  pbkdf2(password, salt, 310000, 32, 'sha256', async (hashError, hashedPassword) => {
    if (hashError) {
      this.returnError(401, hashError.message);
      return;
    }

    const user = await prisma.user.create({
        data: {
          username,
          userSecret: {
            create: {
                username,
                email,
                hashedPassword,
                salt,
            },
          },
        },
      }).catch((dbError) => {
        this.returnError(401, dbError.message);
        return;
      });

      console.log(user);
      this.returnSuccess({ user });
  });
}

export default createEndpoint({POST: signUp});
