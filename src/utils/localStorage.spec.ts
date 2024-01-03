import { OkResult } from "types/functional";
import { getLocalStorage, setLocalStorage } from "./localStorage";

describe("getLocalStorage tests", () => {
  const testKey = "test";
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("it handles undefined correctly", () => {
    const res = getLocalStorage<string>(testKey, "string");
    expect(res.ok).toBe(false);
  });

  test("it handles objects correctly", () => {
    const mockObject = { foo: "baz" };
    window.localStorage.setItem(testKey, JSON.stringify(mockObject));

    const res = getLocalStorage<Record<string, string>>(testKey, "object");

    expect(res.ok).toBe(true);
    expect((res as OkResult<Record<string, string>>).data).toStrictEqual(mockObject);
  });

  test("gracefully handle improperly formatted JSON", () => {
    setLocalStorage(testKey, "invalid_json");

    const res = getLocalStorage<string>(testKey, "object");

    expect(res.ok).toBe(false);
  });
});

describe("setLocalStorage", () => {
  const testKey = "test";

  test("sets object correctly", () => {
    const mockObject = { foo: "baz" };

    const result = setLocalStorage(testKey, mockObject);

    expect(result).toBeTruthy();
    const storedValue = window.localStorage.getItem(testKey);
    expect(storedValue).toBe(JSON.stringify(mockObject));
  });
});
