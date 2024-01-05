/**
 * Simple function to check if password meets Lantern security requirements.
 * @param password - password string to check.
 * @returns true if password should be rejected, false if it should be accepted.
 */
export function isBadPassword(password: string): boolean {
  return password.length < 8 || password.length > 40 || password === "password" || password === "1234";
}
