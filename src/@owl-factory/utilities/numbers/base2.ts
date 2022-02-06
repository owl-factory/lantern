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

/**
 * Boolean operation to and two binary strings together
 * @param bin1 The first binary string
 * @param bin2 The second binary string
 */
export function and(bin1: string, bin2: string): string {
  let resultBin = "";
  let largeBin;
  let smallBin;

  if (bin1.length > bin2.length) {
    largeBin = bin1;
    smallBin = bin2;
  } else {
    largeBin = bin2;
    smallBin = bin1;
  }

  for(let i = 0; i < smallBin.length; i++) {
    if (smallBin[smallBin.length - (i + 1)] === "1" && largeBin[largeBin.length - (i + 1)] === "1") {
      resultBin = "1" + resultBin;
    } else {
      resultBin = "0" + resultBin;
    }
  }

  resultBin = trimLeadingZeroes(resultBin);
  return resultBin;
}


/**
 * Boolean operation to or two binary strings together
 * @param bin1 The first binary string
 * @param bin2 The second binary string
 */
export function or(bin1: string, bin2: string): string {
  let resultBin = "";
  let largeBin;
  let smallBin;

  if (bin1.length > bin2.length) {
    largeBin = bin1;
    smallBin = bin2;
  } else {
    largeBin = bin2;
    smallBin = bin1;
  }

  for(let i = 0; i < largeBin.length; i++) {
    if (i >= smallBin.length) {
      resultBin = largeBin[largeBin.length - (i + 1)] + resultBin;
    } else if (smallBin[smallBin.length - (i + 1)] === "1" || largeBin[largeBin.length - (i + 1)] === "1") {
      resultBin = "1" + resultBin;
    } else {
      resultBin = "0" + resultBin;
    }
  }

  resultBin = trimLeadingZeroes(resultBin);
  return resultBin;
}

/**
 * Boolean operation to exclusive or two binary strings together
 * @param bin1 The first binary string
 * @param bin2 The second binary string
 */
export function xor(bin1: string, bin2: string): string {
  let resultBin = "";
  let largeBin;
  let smallBin;

  if (bin1.length > bin2.length) {
    largeBin = bin1;
    smallBin = bin2;
  } else {
    largeBin = bin2;
    smallBin = bin1;
  }

  for(let i = 0; i < largeBin.length; i++) {
    if (i >= smallBin.length) {
      resultBin = largeBin[largeBin.length - (i + 1)] + resultBin;
    } else if (smallBin[smallBin.length - (i + 1)] === "1" && largeBin[largeBin.length - (i + 1)] === "0") {
      resultBin = "1" + resultBin;
    } else if (smallBin[smallBin.length - (i + 1)] === "0" && largeBin[largeBin.length - (i + 1)] === "1") {
      resultBin = "1" + resultBin;
    } else {
      resultBin = "0" + resultBin;
    }
  }

  resultBin = trimLeadingZeroes(resultBin);
  return resultBin;
}

/**
 * Trims any leading zeroes from the beginning of a binary string
 * @param bin The binary string to trim leading zeroes from
 */
export function trimLeadingZeroes(bin: string): string {
  return bin.replace(/^0+/, '');
}
