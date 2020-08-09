import { parseCookies } from "nookies";
import { Session } from "../models/user";

/**
 * Utility to call the anonymous login api endpoint
 */
export async function anonLogin(): Promise<Session> {
  const response = await fetch("/api/user/anonymous-login", { method: "POST" });
  return await response.json();
}

/**
 * Utility to call the google login api endpoint
 */
export async function googleLogin(): Promise<Session> {
  const response = await fetch("/api/user/google-login", { method: "POST" });
  return await response.json();
}

/**
 * Utility to call the email login api endpoint
 * @param email email address sent to the api as part of the request body
 * @param password email address sent to the api as part of the request body
 */
export async function emailLogin(email: string, password: string): Promise<Session> {
  const response = await fetch("/api/user/email-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
    })
  });
  return await response.json();
}

/**
 * Utility to call the refresh login api endpoint
 */
export async function refreshSession(): Promise<Session> {
  const response = await fetch("/api/user/refresh-login", { method: "POST" });
  return await response.json();
}

/**
 * Utility to return current session from a cookie or, if cookie
 * is unavailable attempt to login anonymously and return a session
 */
export async function getSession(): Promise<Session> {
  let cookie = parseCookies().session;
  if (cookie) {
    return JSON.parse(parseCookies().session);
  } else {
    return await anonLogin();
  }
}

/**
 * Utility to call the logout api endpoint
 */
export async function logout() {
  await fetch("/api/user/logout", { method: "POST" });
}
