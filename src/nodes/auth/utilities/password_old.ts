import { PrismaClient } from "@prisma/client";
import { BinaryLike, pbkdf2, timingSafeEqual } from "crypto";
import { signinAs } from "nodes/auth/jwt";



const prisma = new PrismaClient();

/**
 * Signs in a user using a username and password methodology
 * @todo Build tests!
 * @param username The username or email of the user attempting to sign in
 * @param password The password of the user attempting to sign in
 */
export async function signIn(username: string, password: string) {
  const error = { title: "Incorrect username or password" };
  const userSecret = await prisma.userSecret.findFirst({
    where: {
      OR: [ { username }, { email: username } ],
    },
  });

  if (!userSecret) { return { error }; }

  let jwt;
  try {
    pbkdf2(password, userSecret.salt, ITERATIONS, KEY_LEN, DIGEST, async (hashError, hashedPassword) => {
      if (hashError) { throw { title: "Hashing Error", description: hashError.message }; }

      if (!timingSafeEqual(userSecret.hashedPassword, hashedPassword)) { throw error; }

      const user = await prisma.user.findUnique({
        where: {
          id: userSecret.userID,
        },
      });

      if(!user) {
        throw { title: "Unexpected error", description: "An unexpected error occurred. User data could not be found" };
      }

      jwt = signinAs(user);
    });
  } catch (e) {
    return { error: e };
  }

  console.log(jwt);
}

export async function signUp(userInput: any) {
  // Validate form
  // Validate against DB
  // 
}

function validateSignUp()

/**
 * Normalizes an email to remove capitals, dots, and contents trailing plusses for ensuring that an email is unique
 * @param email The email to 'normalize'
 */
function normalizeEmail(email: string): string {
  let normalizedEmail = email;
  return normalizedEmail;
}


