import { testJest } from "../pages/admin/test-pages/laura-playground";

test("adds 1 + 2 to equal 3", () => {
  expect(testJest(1, 2)).toBe(3);
});
