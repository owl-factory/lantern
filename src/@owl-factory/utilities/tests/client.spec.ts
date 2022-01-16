import { isClient, isServer } from "../client";

test("isServer", () => {
  expect(isServer).toBe(true);
});

test("isClient", () => {
  expect(isClient).toBe(false);
});
