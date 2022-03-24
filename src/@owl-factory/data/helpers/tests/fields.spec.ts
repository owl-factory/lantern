import { getUpdatedAt, isValidCollection, isValidRef } from "../fields";

jest.mock("@owl-factory/utilities/ref");

describe("isValidRef", () => {
  test("not string", () => {
    const result = isValidRef(1);
    expect(result).toBeFalsy();
  });

  test("empty string", () => {
    const result = isValidRef("");
    expect(result).toBeFalsy();
  });

  test("valid ref", () => {
    const result = isValidRef("A1234567890ab");
    expect(result).toBeTruthy();
  });
});

describe("isValidCollection", () => {
  test("Null pair", () => {
    const result = isValidCollection("invalid");
    expect(result).toBeFalsy();
  });

  test("Valid Ref", () => {
    const result = isValidCollection("DQnzxOQ4AIA");
    expect(result).toBeTruthy();
  });

  test("Valid ref but bad collection", () => {
    const result = isValidCollection("DQnzxOQ4AIA");
    expect(result).toBeTruthy();

    const result2 = isValidCollection("DQnzxOQ4AIA", "invalid");
    expect(result2).toBeFalsy();
  });
});

describe("getUpdatedAt", () => {
  test("undefined", () => {
    const result = getUpdatedAt({});
    expect(result).toBe(0);
  });

  test("valid number", () => {
    const result = getUpdatedAt({ updatedAt: 111111 });
    expect(result).toBe(111111);
  });

  test("valid string", () => {
    const date = "12/1/12";
    const result = getUpdatedAt({ updatedAt: date });
    expect(result).toBe((new Date(date)).valueOf());
  });

  test("valid date", () => {
    const date = "12/1/12";
    const result = getUpdatedAt({ updatedAt: new Date(date) });
    expect(result).toBe((new Date(date)).valueOf());
  });

  test("invalid value", () => {
    const result = getUpdatedAt({ updatedAt: "aaaaa" });
    expect(result).toBe(0);
  });
});
