import { BinaryLike, pbkdf2Sync } from "crypto";

// Values required for hashing passwords.
// DO NOT CHANGE. EVER. YOU WILL BREAK EVERY PASSWORD
const ITERATIONS = 310000;
const KEY_LEN = 32;
const DIGEST = "sha256";

/**
 * Hashes the password synchronously in a method that always uses the correct values for certain arguments
 * @param password The password to hash
 * @param salt The salt to use for hashing a password
 * @throws An error if the hashing fails for whatever reason
 * @returns The hashed password
 */
export function hashPassword(
  password: string,
  salt: BinaryLike,
): Buffer {
  return pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST);
}
