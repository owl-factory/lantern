export const collections = [
  { id: "A", string: "users" },
  { id: "B", string: "characters" },
  { id: "C", string: "campaigns" },
  { id: "D", string: "images" },
  { id: "E", string: "rulesets" },
  { id: "F", string: "campaign_invites" },
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
  const trim = ref64.replace(/=+/, "");
  const collection = collections.find((item) => item.id === trim[0])?.string;
  const id = toNumber(trim.slice(1)).toString().padStart(18, "0");
  if (!collection) throw Error("Invalid encoded document referance.");
  return { id, collection };
}

export function isEncoding(ref64: string): boolean {
  return encodingTest.test(ref64);
}

export function getCollection(ref64: string): string {
  return collections.find((item) => item.id === ref64[0])?.string || "";
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
