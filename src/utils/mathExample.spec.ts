import "jest";
import { sum } from "utils/mathExample";

test("adds 1 + 2 + 5 to equal 8", () => {
  expect(sum(1, 2, 5)).toBe(8);
});

test("adds 7 + 0 to equal 7", () => {
  expect(sum(7, 0)).toBe(7);
});

test("adds 1 to itself 13 times to equal 13", () => {
  expect(sum(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)).toBe(13);
});
