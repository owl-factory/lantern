import { normalize, toKey } from "./strings";

describe("normalize tests", () => {
  test("normalizes, preserves case", () => {
    const str = "  aBc  ";
    const res = normalize(str);
    expect(res).toBe("aBc");
  });

  test("normalizes, preserves case", () => {
    const str = "  aBc  ";
    const res = normalize(str, true);
    expect(res).toBe("abc");
  });
});

describe("toKey tests", () => {
  test("runs successfully", () => {
    const str = " Ab$ c ";
    const res = toKey(str);
    expect(res).toBe("ab_c");
  });
});
