import { CommonInputAttributes } from "../types/attributes/form/common";
import { QuerySource } from "../types/query";
import { QueryCharacterOptions } from "../types/query/character";
import { buildQueryOptionsFromAttributes } from "./query";

describe("buildQueryOptionsFromAttributes tests", () => {
  const characterAttributes: Partial<CommonInputAttributes> = { source: "character", name: "name" };

  test("successful character", () => {
    const res = buildQueryOptionsFromAttributes(characterAttributes) as QueryCharacterOptions;
    expect(res.source).toBe(QuerySource.Character);
    expect(res.key).toBe(characterAttributes.name);
  });

  test("character with missing attributes", () => {
    const res = buildQueryOptionsFromAttributes({ ...characterAttributes, name: undefined });
    expect(res.source).toBe(QuerySource.Invalid);
  });

  test("invalid source", () => {
    const invalidAttributes = { source: "nothing correct" } as unknown as Partial<CommonInputAttributes>;
    const res = buildQueryOptionsFromAttributes(invalidAttributes);
    expect(res.source).toBe(QuerySource.Invalid);
  });
});
