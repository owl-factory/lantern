import fetch from "node-fetch";

// TODO set token cookie
export async function authenticate(accessToken: string, refreshToken: string) {
  if (accessToken) {
    return await getUser(accessToken);
  } else if (refreshToken) {
    var newToken = await getNewToken(refreshToken);
    return await getUser(newToken);
  } else {
    return null;
  }
}

export async function getUser(accessToken: string) {
  const res = await fetch("https://reroll.app/.netlify/identity/user", {
    method: "GET",
    headers: {"Authorization": `Bearer ${accessToken}`},
  });
  return await res.json();
}

export async function getNewToken(refreshToken: string) {
  const res = await fetch(`https://reroll.app/.netlify/identity/token?grant_type=refresh_token&refresh_token=${refreshToken}`, {
    method: "POST",
  });
  return (await res.json()).access_token;
}
