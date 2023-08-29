import { isClient, isServer } from "../../utilities/client";

test("isServer", () => {
  expect(isServer).toBe(true);
});

test("isClient", () => {
  expect(isClient).toBe(false);
});
