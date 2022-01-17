import { decodeId, isEncoding } from "../ref";


test("isEncoded test", () => {
  const encodedRef = "A1234567890=";
  const badEncodedRef = "A123456789+=";
  expect(isEncoding(encodedRef)).toBe(true);
  expect(isEncoding(encodedRef + "1")).toBe(false);
  expect(isEncoding(badEncodedRef)).toBe(false);
});

test("decodeId test", () => {
  const encodedRef = "A1234567890=";
  const id = decodeId(encodedRef);
  expect(id).toBe("970208572785807220");
});
