import { isChecked, check, uncheck } from "./check";

const CHECK_VALUE = "larry";
const STORED_LIST = `bob,${CHECK_VALUE},hairbrush`;

describe("isChecked tests", () => {
  test("there are no stored values", () => {
    const res = isChecked("", CHECK_VALUE);
    expect(res).toBe(false);
  });

  test("the value is in the list", () => {
    const res = isChecked(STORED_LIST, CHECK_VALUE);
    expect(res).toBe(true);
  });
});

describe("check tests", () => {
  test("checks", () => {
    const startingList = "bob";
    const res = check(startingList, CHECK_VALUE);
    expect(res).toBe(`${startingList},${CHECK_VALUE}`);
  });
});

describe("uncheck tests", () => {
  test("unchecks if present", () => {
    const res = uncheck(STORED_LIST, CHECK_VALUE);
    expect(res).toBe("bob,hairbrush");
  });

  test("handles safely if not present", () => {
    const storedList = "bob,hairbrush";
    const res = uncheck(storedList, CHECK_VALUE);
    expect(res).toBe(storedList);
  });
});
