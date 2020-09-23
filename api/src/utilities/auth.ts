import fetch from "node-fetch";
import { parse } from "cookie";

export interface Token {
  accessToken: string,
  refreshToken: string
}

// TODO set token cookie
export async function authenticate(token: Token) {
  if (token.accessToken) {
    const user = await getUser(token.accessToken);
    return user;
  } else if (token.refreshToken) {
    var newToken = await getNewToken(token.refreshToken);
    const user = await getUser(newToken);
    return user;
  } else {
    return null;
  }
}

export function parseToken(headers: any) {
  let token: Token | undefined;
  if (headers.cookie) {
    const cookies = parse(headers.cookie);
    if (cookies.nf_jwt || cookies.nf_rft) {
      token = { accessToken: cookies.nf_jwt, refreshToken: cookies.nf_rft };
    }
  }
  return token;
}

export async function getUser(accessToken: string) {
  const res = await fetch("https://reroll.app/.netlify/identity/user", {
    method: "GET",
    headers: {"Authorization": `Bearer ${accessToken}`},
  });
  const user = await res.json();
  return user;
}

export async function getNewToken(refreshToken: string) {
  const res = await fetch(`https://reroll.app/.netlify/identity/token?grant_type=refresh_token&refresh_token=${refreshToken}`, {
    method: "POST",
  });
  return (await res.json()).access_token;
}
