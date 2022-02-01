import { rest } from "@owl-factory/https/rest";
import { Auth } from "controllers/auth";
import { UserDocument } from "types/documents";
import Router from "next/router";

/**
 * Sends a request to sign a user up to the API
 * @param username The username of the user attempting to sign up
 * @param email The email of the user attempting to sign up
 * @param password The password of the user attempting to sign up
 */
 export async function signUp(username: string, email: string, password: string): Promise<string> {
  const result = await rest.post<{ user: UserDocument}>("/api/auth/signup", { username, email, password });
  if (!result.success) {
    return result.message;
  }
  Auth.setUser(result.data.user);
  Router.reload();
  return "";
}

/**
 * Attempts to log in a user
 * @param username The username of the user to log in
 * @param password The password of the user to log in
 */
export async function signIn(username: string, password: string): Promise<string> {
  const result = await rest.post<{ user: UserDocument }>("/api/auth/signin", { username, password });
  if (!result.success) {
    return result.message;
  }
  Auth.setUser(result.data.user);
  Router.reload();
  return "";
}

/**
 * Logs a user out
 */
export function signOut(): void {
  Auth.resetUser();
  Router.reload();
}
