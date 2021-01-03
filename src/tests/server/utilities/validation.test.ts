import { isAliasReserved, validatePublishType } from  "../../../server/utilities/validation";

describe("isAliasReserved", () => {
  test("Alias is reserved", () => {
    expect(isAliasReserved("undefined")).toBeTruthy();
    expect(isAliasReserved("index")).toBeTruthy();
  });

  test("Alias is not reserved", () => {
    expect(isAliasReserved("dnd-5e")).toBeFalsy();
  });
});

describe("validatePublishType", () => {
  test("Placeholder test, since this isn't done", () => {
    expect(validatePublishType().length).toBeGreaterThan(0);
  });
});