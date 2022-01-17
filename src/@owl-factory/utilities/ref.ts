// TODO - move back into non-Owl Factory areas. Requires refactor
export const collections = [
  { id: "A", string: "users" },
  { id: "B", string: "characters" },
  { id: "C", string: "campaigns" },
  { id: "D", string: "images" },
  { id: "E", string: "rulesets" },
  { id: "F", string: "campaign_invites" },
  { id: "G", string: "contents" },
];

export const rixits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export const encodingTest = /[A-Za-z0-9\-_=]{11}=$/;

export function encode(id: string | number, collection: string): string {
  const collection64 = collections.find((item) => item.string === collection)?.id;
  const id64 = fromNumber(BigInt(id)).padEnd(11, "=");
  if (!collection) throw Error("Invalid collection identifier.");
  return collection64 + id64;
}

export function decode(ref64: string): { id: string, collection: string} {
  const id = decodeId(ref64);
  const collection = decodeCollection(ref64);
  return { id, collection };
}

export function isEncoding(ref64: string): boolean {
  return (ref64.length === 12 && encodingTest.test(ref64));
}

export function decodeId(ref64: string): string {
  const trim = ref64.slice(1).replace(/=+/, "");
  return toNumber(trim).toString().padStart(18, "0");
}

export function decodeCollection(ref64: string): string {
  const collection = collections.find((item) => item.id === ref64[0])?.string || "";
  if (!collection) throw Error(`Invalid encoded document reference "${ref64}".`);
  return collection;
}

function fromNumber (number: bigint): string {
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

function toNumber (encoded: string): bigint {
  let result = 0n;
  const split = encoded.split('');
  for (let i = 0; i < split.length; i++) {
    result = (result * 64n) + BigInt(rixits.indexOf(split[i]));
  }
  return result;
}
