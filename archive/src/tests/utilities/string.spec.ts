import { normalize } from "../../utilities/strings";

test("normalize", () => {
  const unnormalizedStr = "AbC";
  const normalizedStr = normalize(unnormalizedStr);

  expect(normalizedStr).toBe("abc");
});
