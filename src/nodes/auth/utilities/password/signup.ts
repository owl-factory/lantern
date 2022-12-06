import { assertServer, isClient } from "@owl-factory/utilities/client";
import { randomBytes } from "crypto";
import { signinAs } from "nodes/auth/jwt";
import { PasswordSignUpInput } from "nodes/auth/types/password";
import { getPrismaClient } from "utilities/prisma";
import { hashPassword } from "./utilities";

const prisma = getPrismaClient();

/**
 * Signs up a user. Validates their information and saves it to the database
 * @param userForm The form submitted by the user to verify that they are using to sign up
 */
export async function passwordSignUp(userForm: PasswordSignUpInput) {
  assertServer();

  if (process.env.NODE_ENV === "production") {
    throw { title: "Account Creation Disabled", description: "Account creation is currently disabled" };
  }

  const normalizedUsername = userForm.username.toLowerCase(); // TODO - better normalization
  const normalizedEmail = userForm.email.toLowerCase();

  const salt = randomBytes(16);
  // Validate form
  // Validate against database

  let hashedPassword;
  try {
    hashedPassword = hashPassword(userForm.password, salt);
  } catch (_e) {
    throw {
      title: "Sign Up Failed",
      description: "An unknown error occured during the sign up process. (Error 0001)",
    };
  }

  const user = await prisma.user.create({
    data: {
      username: normalizedUsername,
      displayName: normalizedUsername,
      userSecret: {
        create: {
          username: normalizedUsername,
          email: normalizedEmail,
          hashedPassword: hashedPassword,
          salt,
        },
      },
    },
  }).catch((dbError) => {
    console.error(dbError);
    throw {
      title: "Sign Up Failed",
      description: "An unknown error occured during the sign up process. (Error 0002)",
    };
  });

  if(!user) {
    throw {
      title: "Sign Up Failed",
      description: "An unknown error occured during the sign up process. (Error 0003)",
    };
  }

  const jwt = signinAs(user);

  // Create account
  // Return JWT
  console.log("JWT:", jwt);
  return jwt;
}

export function validatePasswordSignUpForm(userForm: PasswordSignUpInput) {
  // TODO
}
