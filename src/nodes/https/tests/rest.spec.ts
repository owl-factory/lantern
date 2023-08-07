import { $formatURL, toURLParams } from "../utilities/rest";

test("formatUrl test", () => {
  const shortURL = "/page1";
  const longURL = "owl-factory.com/page1";

  // Adds the leading domain. Until we set up an env file, we need to check that the size is greater
  expect($formatURL(shortURL).length).toBeGreaterThan(6);

  expect($formatURL(longURL)).toBe(longURL);
});

test("toURLParams test", () => {
  const objectParams = { name: "Owl", job: "webowl" };
  const url = toURLParams(objectParams);

  expect(url).toBe("?name=Owl&job=webowl&");
});
