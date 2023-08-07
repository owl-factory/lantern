import { decimalToBinary } from "./base10";

export const rixits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/**
 * Converts a base64 character string into a binary string
 * @param base64 The base64 character string to convert
 */
 export function base64ToBinary(base64: string): string {
  if (!base64) { return ""; }
  let binary = "";
  for (const char of base64) {
    const decimal = rixits.indexOf(char);
    const binaryChunk = decimalToBinary(decimal).padStart(6, "0");
    binary += binaryChunk;
  }
  binary = binary.replace(/^0+/, '');
  return binary;
}

/**
 * Converts base64 character string into a decimal number
 * @param base64 The base64 character string to convert
 */
export function base64toDecimal(base64: string): bigint {
  let result = 0n;
  const split = base64.split('');
  for (let i = 0; i < split.length; i++) {
    result = (result * 64n) + BigInt(rixits.indexOf(split[i]));
  }
  return result;
}

/**
 * Safely grabs a rixit value without stepping outside the bounds of the rixit list.
 * Throws a warning if the index is outside the bounds of the string
 * @param index The index of the rixit to grab
 */
export function safeRixit(index: number | bigint) {
  if (typeof index !== "number") { index = Number(index); }
  if (index >= 64) { console.warn("Rixit exceeds safe value"); }
  index = index % 64;
  return rixits.charAt(index);
}
