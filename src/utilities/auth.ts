import { parseCookies } from "nookies";
import { Session } from "../models/user";

export async function anonLogin(): Promise<Session> {
  const response = await fetch("/api/user/anonymous-login", { method: "POST" });
  return await response.json();
}

export async function googleLogin(): Promise<Session> {
  const response = await fetch("/api/user/google-login", { method: "POST" });
  return await response.json();
}

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

export async function refreshSession(): Promise<Session> {
  const response = await fetch("/api/user/refresh-login", { method: "POST" });
  return await response.json();
}

export async function getSession(): Promise<Session> {
  let cookie = parseCookies().session;
  if (cookie) {
    return JSON.parse(parseCookies().session);
  } else {
    return await anonLogin();
  }
}

export async function logout() {
  await fetch("/api/user/logout", { method: "POST" });
}
