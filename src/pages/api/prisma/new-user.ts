import "reflect-metadata";
import { NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";
import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";

const prisma = new PrismaClient();

/**
 * Fetches the information needed for the current user's dashboard page.
 */
export async function newUser(this: HTTPHandler, _req: NextApiRequest) {
  const username = "test_user1";
  const email = "test1@testing.com";
  const password = "test_pass";
  const user = await prisma.user.create({
    data: {
      username,
      displayName: username,
      userSecret: {
        create: {
            username,
            email,
            passwordHash: password,
        },
      },
    },
  });
  console.log(user);
  this.returnSuccess({ user });
}

export default createEndpoint({GET: newUser});
