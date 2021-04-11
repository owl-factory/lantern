import fetch from "cross-fetch";
import { getClient, q } from "./db";

export function signUp(email: string, username: string, password: string, callback?: (res: any) => void): void {
  fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email, username, password}),
  }).then(async (res) => {
    const json = await res.json();
    if (callback) callback(json);
  });
}

export function signIn(username: string, password: string, callback?: (res: any) => void): void {
  fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, password}),
  }).then(async (res) => {
    const json = await res.json();
    if (callback) callback(json);
  });
}

export function signOut(callback: (success: boolean) => void): void {
  getClient().query(q.Logout(true)).then((res: unknown) => {
      callback(res as boolean);
  });
}
