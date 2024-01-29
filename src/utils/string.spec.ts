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
  test("returns true with API routes.", () => {
    const urlTests = [
      isExternalUrl("https://lanterntt.com/api/graphql"),
      isExternalUrl("/api/graphql"),
      isExternalUrl("/api/ping"),
      isExternalUrl("/api/todo/7ba4227c-0e04-4438-a5a9-5a595e6cb1c7"),
    ];
    console.log(urlTests);
    for (const item of urlTests) {
      expect(item).toBe(true);
    }
  });

  test("returns true with external urls.", () => {
    const urlTests = [
      isExternalUrl("https://google.com"),
      isExternalUrl("https://en.wikipedia.org/wiki/Unit_testing"),
      isExternalUrl("https://github.com/owl-factory/lantern"),
    ];
    console.log(urlTests);
    for (const item of urlTests) {
      expect(item).toBe(true);
    }
  });

  test("returns false with internal urls.", () => {
    const urlTests = [
      isExternalUrl(baseUrl),
      isExternalUrl(baseUrl + "/characters"),
      isExternalUrl(baseUrl + "/login"),
      isExternalUrl(baseUrl + "/e729ee38-2764-4739-9502-53c402a9b1c4/profile"),
      isExternalUrl("/"),
      isExternalUrl("/characters"),
      isExternalUrl("/login"),
      isExternalUrl("/profile"),
    ];
    console.log(urlTests);
    for (const item of urlTests) {
      expect(item).toBe(false);
    }
  });
});
