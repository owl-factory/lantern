import { safeRixit } from "./base64";

/**
 * Converts a decimal number to a base 64 character string
 * @param decimal The decimal number to convert
 */
export function decimalToBase64(decimal: bigint | number): string {
  if (typeof decimal === "number") { decimal = BigInt(decimal); }

  let rixit;
  let result = '';
  while (true) {
    rixit = decimal % 64n;
    result = safeRixit(rixit) + result;
    decimal = decimal / 64n;
    if (decimal === 0n)
      break;
  }
  return result;
}

/**
 * Converts a decimal number to a binary character string
 * @param decimal The decimal number to convert
 */
export function decimalToBinary(decimal: bigint | number): string {
  if (typeof decimal === "number") { decimal = BigInt(decimal); }

  let binary = "";
  while(true) {
    binary = (decimal % 2n).toString() + binary;
    decimal = decimal / 2n;

    if (decimal === 0n)
      break;
  }

  return binary;
}
