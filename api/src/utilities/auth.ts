import fetch from "node-fetch";
import { parse } from "cookie";
import { AuthChecker } from "type-graphql";

export interface Token {
  accessToken: string,
  refreshToken: string
}

// TODO set token cookie
export async function authenticate(token: Token) {
  if (!token) {
    return null;
  }
  if (token.accessToken) {
    const user = await getUser(token.accessToken);
    if (user.code = 401) {
      var newToken = await getNewToken(token.refreshToken);
      return await getUser(newToken);
    }
  } else if (token.refreshToken) {
    var newToken = await getNewToken(token.refreshToken);
    return await getUser(newToken);
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

export async function authorize(context, roles?: string[]) {
  if (!context.token) return false;
  if (!context.user) {
    context.user = await authenticate(context.token);
  }
  if (context.user) {
    if (!roles || roles.length == 0) return true;
    for (const role of roles) {
      if (context.user.app_metadata.roles.includes(role)) {
        return true;
      }
    }
  } 
  return false;
}

export const nfAuthChecker: AuthChecker<any> = async ({ root, args, context, info }, roles) => {
  return authorize(context, roles);
};

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
