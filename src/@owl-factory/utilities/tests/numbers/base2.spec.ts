import { binaryToBase64, binaryToDecimal } from "@owl-factory/utilities/numbers/base2";

test("binaryToBase64 1 to B", () => {
  const base64 = binaryToBase64("1");
  expect(base64).toBe("B");
});

test("binaryToBase64 11010 to a", () => {
  const base64 = binaryToBase64("11010");
  expect(base64).toBe("a");
});

test("binaryToBase64 11010,011011,011100 to abc", () => {
  const base64 = binaryToBase64("11010011011011100");
  expect(base64).toBe("abc");
});


// Binary to decimal
test("binaryToDecimal 101 to 5", () => {
  const decimal = binaryToDecimal("101");
  expect(decimal).toBe(5n);
});

test("binaryToDecimal 1100100 to 100", () => {
  const decimal = binaryToDecimal("1100100");
  expect(decimal).toBe(100n);
});

