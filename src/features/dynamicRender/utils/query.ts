import { CommonInputAttributes } from "../types/attributes/form/common";
import { GetOptions, InvalidQueryOptions, QuerySource } from "../types/query";

const INVALID_OPTIONS: InvalidQueryOptions = { source: QuerySource.Invalid };

/**
 * Builds GetOptions based on the attribues given by the InputAttributes
 * @param attributes - The attributes to build the GetOptions from
 * @returns A GetOptions query
 */
export function buildQueryOptionsFromAttributes(attributes: Partial<CommonInputAttributes>): GetOptions {
  switch (attributes.source) {
    case "character":
      if (!attributes.name) return { ...INVALID_OPTIONS };
      return { source: QuerySource.Character, key: attributes.name };
  }
  return { ...INVALID_OPTIONS };
}
