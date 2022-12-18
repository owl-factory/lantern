import { getCtx } from "@owl-factory/next";
import { passwordSignIn, passwordSignUp } from "nodes/auth";
import { PasswordSignUpInput } from "nodes/auth/types/password";

interface PasswordSignInArguments {
  username: string,
  password: string,
}


interface PasswordSignUpArguments {
  userSecret: PasswordSignUpInput;
}

async function signInWithPassword(_: unknown, { username, password }: PasswordSignInArguments) {
  const jwt = await passwordSignIn(username, password);
  console.log(getCtx()?.req.cookies)
  return jwt;
}

async function signUpWithPassword(_: unknown, { userSecret }: PasswordSignUpArguments) {
  return await passwordSignUp(userSecret);
}


export const authResolvers = {
  Mutation: {
    passwordSignIn: signInWithPassword,
    passwordSignUp: signUpWithPassword,
  },
};
