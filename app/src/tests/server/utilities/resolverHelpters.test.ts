import { buildFilters, isID, parseFilter } from "../../../server/utilities/resolverHelpers";

// isID
describe("isID", () => {
  test("isID valid id", () => {
    expect(isID("111111111111111111111111")).toBe(true);
  });

  test("isID invalid id", () => {
    expect(isID("")).toBe(false);
    expect(isID("1111111111111111111111112")).toBe(false);
    expect(isID("11111111111111111111112")).toBe(false);
  });
});

// parseFilter
describe("parseFilter", () => {
  // EQ case
  test("EQ case", () => {
    const parseFilterEQ = parseFilter({"foo": {"eq": "bar"}});
    expect(parseFilterEQ["foo"]).toBe("bar");
  });

  // Like case
  test("Like case", () => {
    const parseFilterLike = parseFilter({"foo": {"like": "bar"}});
    expect(parseFilterLike["foo"]).toStrictEqual(/bar/i);
  });

  // Other simple case
  test("Misc Types", () => {
    const parseFilterNEQ: Record<string, unknown> = parseFilter({"foo": {"neq": "bar"}});
    expect("$neq" in (parseFilterNEQ["foo"] as Record<string, unknown>)).toBeTruthy();
    expect((parseFilterNEQ["foo"] as Record<string, unknown>)["$neq"]).toStrictEqual("bar");

    const parseFilterLT: Record<string, unknown> = parseFilter({"foo": {"lt": 0}});
    expect("$lt" in (parseFilterLT["foo"] as Record<string, unknown>)).toBeTruthy();
    expect((parseFilterLT["foo"] as Record<string, unknown>)["$lt"]).toStrictEqual(0);

    const parseFilterLTE: Record<string, unknown> = parseFilter({"foo": {"lte": 0}});
    expect("$lte" in (parseFilterLTE["foo"] as Record<string, unknown>)).toBeTruthy();
    expect((parseFilterLTE["foo"] as Record<string, unknown>)["$lte"]).toStrictEqual(0);

    const parseFilterGT: Record<string, unknown> = parseFilter({"foo": {"gt": 0}});
    expect("$gt" in (parseFilterGT["foo"] as Record<string, unknown>)).toBeTruthy();
    expect((parseFilterGT["foo"] as Record<string, unknown>)["$gt"]).toStrictEqual(0);

    const parseFilterGTE: Record<string, unknown> = parseFilter({"foo": {"gte": 0}});
    expect("$gte" in (parseFilterGTE["foo"] as Record<string, unknown>)).toBeTruthy();
    expect((parseFilterGTE["foo"] as Record<string, unknown>)["$gte"]).toStrictEqual(0);
  });

  // Nested case
  test("Nested Type", () => {
    const parseFilterNested = parseFilter({"foo": {"bar": {"eq": "coo"}}});
    expect("foo.bar" in parseFilterNested).toBeTruthy();
    expect(parseFilterNested["foo.bar"]).toBe("coo");
  });
});

// buildFilter
describe("buildFilter", () => {
  test("buildFilters - no filter", () => {
    expect(Object.keys(buildFilters()).length).toBe(0)
    const builtFilters2 = buildFilters({});
    expect(Object.keys(builtFilters2).length).toBe(0)
  });

  test("buildFilters - and filters only", () => {
    const builtFilters = buildFilters({name: {eq: "Test"}});
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
    expect(builtFiltersKeys.length).toBe(1);

    const $andKeys = Object.keys(builtFilters["$and"] as Record<string, unknown>);
    expect($andKeys.length).toBe(2);
    expect(builtFilters["$and"][0]["name"]["$neq"]).toBe("Blah");
    expect(builtFilters["$and"][1]["$or"][0]["name"]).toBe("Test");
  });
});
