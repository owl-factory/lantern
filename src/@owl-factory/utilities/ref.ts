// This is a string of all characters used for the base64 encoding.
// The index of each character is equivalent to its value.
export const rixits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

// This is a regular expression used to test if a given string is
// a valid base64 encoding of a database reference.
export const encodingTest = /^(?=.{11,12}$)[A-Za-z0-9\-_]{2,12}[=]{0,9}$/;

export type CollectionMap = { id: string; string: string; }[];

/**
 * Encodes a database document reference (18 digit base10 id paired with a collection name)
 * into an 11-12 charcter base64 string
 * @param id base10 id
 * @param collection collection name
 * @param collections object for mapping between collection names
 *  and an associated 1-2 character base64 id
 * @returns base64 ref
 */
export function encode(id: string, collection: string, collections: CollectionMap): string | null {
  const collection64 = collections.find((item) => item.string === collection)?.id;
  const id64 = fromInt(BigInt(id)).padEnd(10, "=");
  if (!collection) {
    console.warn("Invalid collection identifier.");
    return null;
  }
  return collection64 + id64;
}

/**
 * Decodes an 11-12 chaarcter base64 string into a
 * database document reference (18 digit base10 id paired with a collection name)
 * @param ref64 base64 ref
 * @param collections object for mapping between collection names
 *  and an associated 1-2 character base64 id
 * @returns database ref
 */
export function decode(ref64: string, collections: CollectionMap): { id: string, collection: string} | null {
  if (!isEncoding(ref64)) {
    console.warn("Invalid ref encoding format.");
    return null;
  }

  const col64 = (ref64.length === 11) ? ref64[0] : ref64.slice(0, 2);
  const id64 = (ref64.length === 11) ? ref64.slice(1) : ref64.slice(2);

  const collection = decodeCollection(col64, collections);

  if (!collection) {
    console.warn("Invalid collection identifier.");
    return null;
  }

  const id = decodeId(id64);
  return { id, collection };
}

/**
 * Function used to test if a given string is a valid base64 encoding of a database reference.
 * @param ref64 base64 ref
 */
export function isEncoding(ref64: string): boolean {
  return encodingTest.test(ref64);
}

/**
 * Decodes id component of the base64 ref into it's 18 digit base10 id.
 * @param id64 id component
 * @returns base10 id
 */
export function decodeId(id64: string): string {
  return toInt(id64.replaceAll("=", "")).toString().padStart(18, "0");
}

/**
 * Decodes collection component of the base64 ref into it's collection name string.
 * @param col64 collection component
 * @param collections object for mapping between collection names
 *  and an associated 1-2 character base64 id
 * @returns collection name
 */
export function decodeCollection(col64: string, collections: CollectionMap): string{
  const collection = collections.find((item) => item.id === col64)?.string || "";
  return collection;
}

/**
 * Converts a base10 big int into a base64 string of equivalent numerical value.
 * @param number base10 input
 * @returns base64 output
 */
function fromInt (number: bigint): string {
  let rixit;
  let result = '';
  while (true) {
    rixit = number % 64n;
    result = rixits.charAt(Number(rixit)) + result;
    number = number / 64n;
    if (number === 0n)
        break;
  }
  return result;
}

/**
 * Converts a base64 string into a base10 big int of equivalent numerical value.
 * @param encoded base64 input
 * @returns  base10 output
 */
function toInt(encoded: string): bigint {
  let result = 0n;
  const split = encoded.split('');
  for (let i = 0; i < split.length; i++) {
      result = (result * 64n) + BigInt(rixits.indexOf(split[i]));
  }
  return result;
}
