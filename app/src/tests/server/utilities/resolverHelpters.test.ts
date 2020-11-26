import { buildFilters, isID } from "../../../server/utilities/resolverHelpers";

// isID
test("isID valid id", () => {
  expect(isID("111111111111111111111111")).toBe(true);
});

test("isID invalid id", () => {
  expect(isID("")).toBe(false);
  expect(isID("1111111111111111111111112")).toBe(false);
  expect(isID("11111111111111111111112")).toBe(false);
});

// parseFilter

// buildFilter
test("buildFilters - no filter", () => {
  expect(Object.keys(buildFilters()).length).toBe(0)
  const builtFilters2 = buildFilters({});
  expect(Object.keys(builtFilters2).length).toBe(0)
});

test("buildFilters - and filters only", () => {
  const builtFilters = buildFilters({name: {eq: "Test"}});
  console.log(builtFilters);
  const builtFiltersKeys = Object.keys(builtFilters);
  expect(builtFiltersKeys.length).toBe(1);
});

test("buildFilters - or filters only", () => {
  const builtFilters = buildFilters({or: [{name: {eq: "Test"}}]});
  const builtFiltersKeys = Object.keys(builtFilters);
  expect(builtFiltersKeys.length).toBe(1);
  expect(builtFiltersKeys[0]).toBe("$or");

  const $orAndKeys = Object.keys(builtFilters["$or"] as Record<string, unknown>);
  expect($orAndKeys.length).toBe(1);
  expect(builtFilters["$or"][0]["name"]).toBe("Test");
});

test("buildFilters - both filters", () => {
  const builtFilters = buildFilters({name: {neq: "Blah"}, or: [{name: {eq: "Test"}}]});
  const builtFiltersKeys = Object.keys(builtFilters);
  console.log(builtFilters)
  expect(builtFiltersKeys.length).toBe(1);

  const $andKeys = Object.keys(builtFilters["$and"] as Record<string, unknown>);
  expect($andKeys.length).toBe(2);
  expect(builtFilters["$and"]["$or"][0]["name"]).toBe("Test");
});