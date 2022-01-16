import { normalize } from "path";

test("normalize", () => {
  const unnormalizedStr = "AbC";
  const normalizedStr = normalize(unnormalizedStr);

  expect(normalizedStr).toBe("abc");
});
