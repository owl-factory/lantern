import { baseUrl } from "utils/environment";
import { isExternalUrl, normalize, toKey } from "utils/strings";

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

describe("toKey tests", () => {
  test("runs successfully", () => {
    const str = " Ab$ c ";
    const res = toKey(str);
    expect(res).toBe("ab_c");
  });
});

describe("isExternalUrl tests", () => {
  const isExternalUrlTestInfo = [
    { url: "https://lanterntt.com/api/graphql", expected: true },
    { url: "/api/graphql", expected: true },
    { url: "/api/ping", expected: true },
    { url: "/api/content/7ba4227c-0e04-4438-a5a9-5a595e6cb1c7", expected: true },
    { url: "https://google.com", expected: true },
    { url: "https://en.wikipedia.org/wiki/Unit_testing", expected: true },
    { url: "https://github.com/owl-factory/lantern", expected: true },
    { url: baseUrl, expected: false },
    { url: baseUrl + "/characters", expected: false },
    { url: baseUrl + "/login", expected: false },
    { url: baseUrl + "/e729ee38-2764-4739-9502-53c402a9b1c4/profile", expected: false },
    { url: "/", expected: false },
    { url: "/characters", expected: false },
    { url: "/login", expected: false },
    { url: "/profile", expected: false },
  ];
  for (const testInfo of isExternalUrlTestInfo) {
    test(`isExternalUrl returns ${testInfo.expected} when passed URL ${testInfo.url}.`, () => {
      expect(isExternalUrl(testInfo.url)).toBe(testInfo.expected);
    });
  }
});
