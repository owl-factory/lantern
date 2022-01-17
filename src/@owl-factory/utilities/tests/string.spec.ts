import { normalize } from "../strings";

test("normalize", () => {
  const unnormalizedStr = "AbC";
  const normalizedStr = normalize(unnormalizedStr);

  expect(normalizedStr).toBe("abc");
});
