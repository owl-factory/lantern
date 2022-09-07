
import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
const expiresIn = 30 * 24 * 60 * 60;

function signUserJwt(user: User) {
    if (jwtSecret) {
        return sign(user, jwtSecret, { expiresIn });
    } else {
        throw("MISSING JWT SECRET.");
    }
}

function verifyUserJwt(token: string) {
    if (jwtSecret) {
        return verify(token, jwtSecret, { maxAge:expiresIn });
    } else {
      throw("MISSING JWT SECRET.");
    }
}
