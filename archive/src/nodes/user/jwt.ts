import { isClient } from "utilities/client";
import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import { parseCookies, setCookie } from "nookies";
import { getCtx } from "utilities/globals/next";

const jwtSecret = process.env.JWT_SECRET;
const expiresIn = 14 * 24 * 60 * 60;
const jwtCookieKey = "jwt_reroll_app";

let userCache: User | undefined;

/**
 * Sign a JWT using the jsonwebtoken library and a sitewide secret
 * obtained from an environment variable. MAKE SURE THE USER THAT WE ARE GENERATING
 * A TOKEN FOR HAS ALREADY BEEN AUTHENTICATED. DOING THIS INCORRECTLY COULD SIGN AN
 * IRREVOCABLE TOKEN TO A NON AUTHENTICATED USER.
 * @param user The user object that a JWT is being signed for. Make sure the user
 * has already been authenticated before signing one of these.
 * @returns a signed JWT as a string value,
 */
function signUserJwt(user: User) {
    if (jwtSecret) {
        return sign(user, jwtSecret, { expiresIn });
    } else {
        throw("MISSING JWT SECRET.");
    }
}

/**
 * Verify the signing of a json web token against sitewide secret. This is used to
 * authenticate a user based on a JWT stored in a cookie or authorization header.
 * @param token JWT string to verify against sitewide secret.
 * @returns if verification (authentication) fails, returns null. If successful,
 * returns a user object.
 */
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

/**
 * Save a JWT to a cookie for the purpose of stateless authorized user sessions.
 * @param token JWT string to be saved to an HTTP only cookie.
 */
function setJwtCookie(token: string) {
    if (isClient) {
        console.warn("Setting a JWT cookie can only be done on the server!");
    }
    const ctx = getCtx();
    setCookie(ctx, jwtCookieKey, token, { maxAge: expiresIn, path: "/", httpOnly: true, secure: true });
}

/**
 * Retrieve a JWT to a cookie for the purpose of stateless authorized user sessions.
 * @param token JWT retrieved from cookie.
 */
function getJwtCookie() {
    const ctx = getCtx();
    const cookies = parseCookies(ctx);
    const jwt = cookies[jwtCookieKey];
    return jwt;
}

/**
 * Utility function for signing in by creating a cookie with a signed JWT.
 * MAKE SURE THE USER THAT WE SIGNING IN ALREADY BEEN AUTHENTICATED. DOING THIS
 * INCORRECTLY COULD CREATE AN IRREVOCABLE TOKEN FOR A NON AUTHENTICATED USER.
 * @param user User object to sign in as.
 * @returns Newly created JWT string that has already been saved to a cookie.
 */
export function signinAs(user: User) {
    const token = signUserJwt(user);
    setJwtCookie(token);
    return token;
}

/**
 * Utility function for authorizing a user by verifying the JWT stored in a cookie.
 * @returns if verification (authentication) fails, returns null. If successful,
 * returns a user object.
 */
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
