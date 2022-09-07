import { getCtx } from "@owl-factory/next";
import { isClient } from "@owl-factory/utilities/client";
import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import { parseCookies, setCookie } from "nookies";

const jwtSecret = process.env.JWT_SECRET;
const expiresIn = 14 * 24 * 60 * 60;
const jwtCookieKey = "jwt_reroll_app";

let userCache: User | undefined;

function signUserJwt(user: User) {
    if (jwtSecret) {
        return sign(user, jwtSecret, { expiresIn });
    } else {
        throw("MISSING JWT SECRET.");
    }
}

function verifyUserJwt(token: string) {
    if (jwtSecret) {
        try {
            return verify(token, jwtSecret, { maxAge:expiresIn });
        } catch {
            return null;
        }
    } else {
      throw("MISSING JWT SECRET.");
    }
}

function setJwtCookie(token: string) {
    if (isClient) {
        console.warn("Setting a JWT cookie can only be done on the server!");
    }
    const ctx = getCtx();
    setCookie(ctx, jwtCookieKey, token, { maxAge: expiresIn, path: "/", httpOnly: true, secure: true });
}

function getJwtCookie() {
    const ctx = getCtx();
    const cookies = parseCookies(ctx);
    const jwt = cookies[jwtCookieKey];
    return jwt;
}

export function signinAs(user: User) {
    const token = signUserJwt(user);
    setJwtCookie(token);
    return token;
}

export function authenticate() {
    if (isClient) {
        console.warn("Authentication with JWT cookie can only be done on the server!");
    }

    const jwt = getJwtCookie();
    const verifiedUser = verifyUserJwt(jwt);
    if (verifiedUser) {
        return verifiedUser as User;
    } else {
        return null;
    }
}
