import { decimalToBase64, decimalToBinary } from "@owl-factory/utilities/numbers/base10";

test("decimalToBase64 27 to b", () => {
  const base64 = decimalToBase64(27);
  expect(base64).toBe("b");
});

test("decimalToBase64 108,252 to abc", () => {
  const base64 = decimalToBase64(108252);
  expect(base64).toBe("abc");
});

// Decimal to binary
test("decimalToBinary 5 to 101", () => {
  const binary = decimalToBinary(5);
  expect(binary).toBe("101");
});

test("decimalToBinary 100 to 1100100", () => {
  const binary = decimalToBinary(100n);
  expect(binary).toBe("1100100");
});
