import { getLocalStorage, setLocalStorage } from "./localStorage";

describe("getLocalStorage tests", () => {
  const testKey = "test";
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("it handles undefined correctly", () => {
    const res = getLocalStorage<string>(testKey, "string");
    expect(res).toBeUndefined();
  });

  test("it handles objects correctly", () => {
    const mockObject = { foo: "baz" };
    window.localStorage.setItem(testKey, JSON.stringify(mockObject));

    const res = getLocalStorage<string>(testKey, "object");

    expect(res).toBeDefined();
    expect(res).toStrictEqual(mockObject);
  });

  test("gracefully handle improperly formatted JSON", () => {
    setLocalStorage(testKey, "invalid_json");

    const res = getLocalStorage<string>(testKey, "object");

    expect(res).toBeUndefined();
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
