import { timingSafeEqual } from "crypto";
import { signinAs } from "nodes/auth/jwt";
import { getPrismaClient } from "utilities/prisma";
import { hashPassword } from "./utilities";

const prisma = getPrismaClient();
const FAILED_SIGNIN = {
  title: "Incorrect Username/Email/Password",
  description: "An incorrect username, email, or password was given",
}

export async function passwordSignIn(username: string, password: string) {
  const normalizedUsername = username.toLowerCase();

  // TODO - only check email if email is valid
  const userSecret = await prisma.userSecret.findFirst({
    where: {
      OR: [ { username: normalizedUsername }, { email: normalizedUsername } ],
    },
  });

  if(!userSecret) {
    throw FAILED_SIGNIN;
  }

  let hashedPassword;
  try {
    hashedPassword = hashPassword(password, userSecret.salt);
  } catch (_e) {
    throw {
      title: "Sign In Failed",
      description: "An unknown error occured during the sign in process. (Error 0011)",
    };
  }

  if (!timingSafeEqual(userSecret.hashedPassword, hashedPassword)) { throw FAILED_SIGNIN; }

  const user = await prisma.user.findUnique({
    where: {
      id: userSecret.userID,
    },
  });
  if(!user) {
    throw {
      title: "Sign In Failed",
      description: "Something went horribly wrong, cannot find user data. (Error 0012)",
    };
  }
  const jwt = signinAs(user);
  return jwt;
}
