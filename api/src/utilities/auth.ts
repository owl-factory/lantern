import fetch from "node-fetch";
import { parse } from "cookie";
import { AuthChecker } from "type-graphql";

export interface Token {
  accessToken: string,
  refreshToken: string
}

export const nfAuthChecker: AuthChecker<any> = async ({ root, args, context, info }, roles) => {
  if (context.token && !context.user) {
    context.user = await authenticate(context.token);
  }
  if (context.user) {
    for (const role of roles) {
      if (context.user.app_metadata.roles.includes(role)) {
        return true;
      }
      return false;
    }
  } else {
    return false;
  }
};

// TODO set token cookie
export async function authenticate(token: Token) {
  if (!token) {
    return null;
  }
  if (token.accessToken) {
    const user = await getUser(token.accessToken);
    return user;
  } else if (token.refreshToken) {
    var newToken = await getNewToken(token.refreshToken);
    const user = await getUser(newToken);
    return user;
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
