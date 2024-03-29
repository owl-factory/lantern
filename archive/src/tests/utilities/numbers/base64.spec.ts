import { base64ToBinary, base64toDecimal } from "utilities/numbers/base64";

test("base64toBinary a to 11010", () => {
  const binary = base64ToBinary("a");
  expect(binary).toBe("11010");
});

test("base64toBinary abc to 11010,011011,011100", () => {
  const binary = base64ToBinary("abc");
  expect(binary).toBe("11010011011011100");
});

// Base64toDecimal
test("base64ToDecimal a to 26", () => {
  const decimal = base64toDecimal("a");
  expect(decimal).toBe(26n);
});

test("base64ToDecimal abc to 108,252", () => {
  const decimal = base64toDecimal("abc");
  expect(decimal).toBe(108252n);
});
