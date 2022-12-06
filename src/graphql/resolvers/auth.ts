import { passwordSignIn, passwordSignUp } from "nodes/auth";
import { PasswordSignUpInput } from "nodes/auth/types/password";

interface PasswordSignInInput {
  name: string;
  password: string;
}

interface PasswordSignInArguments {
  username: string,
  password: string,
}


interface PasswordSignUpArguments {
  userSecret: PasswordSignUpInput;
}

async function signInWithPassword(_: unknown, { username, password }: PasswordSignInArguments) {
  return await passwordSignIn(username, password);
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
