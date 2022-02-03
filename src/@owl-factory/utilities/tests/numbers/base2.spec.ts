import { and, binaryToBase64, binaryToDecimal, or, trimLeadingZeroes, xor } from "@owl-factory/utilities/numbers/base2";

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

// AND
test("and 101 110", () => {
  const bin = and("101", "110");
  expect(bin).toBe("100");
});

test("and 10100 110", () => {
  const bin = and("101", "110");
  expect(bin).toBe("100");
});


// OR
test("or 101 110", () => {
  const bin = or("101", "110");
  expect(bin).toBe("111");
});

test("or 10100 110", () => {
  const bin = or("10100", "110");
  expect(bin).toBe("10110");
});

// XOR
test("xor 101 110", () => {
  const bin = xor("101", "110");
  expect(bin).toBe("11");
});

test("xor 10100 110", () => {
  const bin = xor("10100", "110");
  expect(bin).toBe("10010");
});

// TRIM LEADING ZEROES
test("trimLeadingZeroes 000010100", () => {
  const bin = trimLeadingZeroes("000010100");
  expect(bin).toBe("10100");
});

// TRIM LEADING ZEROES
test("trimLeadingZeroes 10100", () => {
  const bin = trimLeadingZeroes("10100");
  expect(bin).toBe("10100");
});
