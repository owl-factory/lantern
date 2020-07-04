import { parseCookies } from "nookies";
import { Session } from "../models/user";

export async function anonLogin(): Promise<Session> {
  let response = await fetch("/api/user/anonymous-login", { method: "POST" });
  return await response.json();
}

export function googleLogin() {
  
}

export async function getSession(): Promise<Session> {
  let cookie = parseCookies().session;
  if (cookie) {
    return JSON.parse(parseCookies().session);
  } else {
    return await anonLogin();
  }
}

export function logout() {

}
