import { rixits, safeRixit } from "./base64";

/**
 * Converts a binary string into a base64 character string
 * @param binary The binary to convert into a base64 character string
 */
export function binaryToBase64(binary: string): string {
  let base64 = "";

  const base64Length = Math.ceil(binary.length / 6);
  const binaryLength = binary.length;

  for (let i = 0; i < base64Length; i++) {
    // Due to quirks of the slice function being inclusive start, exclusive end
    // the start and end values aren't exactly what would be exected
    let start = binaryLength - ((i + 1) * 6);
    const end = binaryLength - (i * 6);

    if (start < 0) { start = 0; }
    const chunk = binary.slice(start, end);
    const decimal = binaryToDecimal(chunk);
    base64 = safeRixit(decimal) + base64;
  }

  return base64;
}

/**
 * Converts binary to a decimal number
 * @param binary The binary string to convert into a decimal number
 */
 export function binaryToDecimal(binary: string): bigint {
  let decimal = 0n;
  for(const bit of binary) {
    decimal = decimal * 2n;
    if (bit === "1") { decimal += 1n; }
  }
  return decimal;
}
