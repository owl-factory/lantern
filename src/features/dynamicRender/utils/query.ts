import { CommonInputAttributes } from "features/dynamicRender/types/attributes/form/common";
import { InvalidQueryOptions, QuerySource, GetOptions } from "features/dynamicRender/types/query";

/**
 * Builds GetOptions based on the attribues given by the InputAttributes
 * @param attributes - The attributes to build the GetOptions from
 * @returns A GetOptions query
 */
export function buildQueryOptionsFromAttributes(
  attributes: Partial<CommonInputAttributes>
): GetOptions {
  switch (attributes.source) {
    case "character":
      if (!attributes.name) return newInvalidQuery();
      return { source: QuerySource.Self, key: attributes.name };
  }
  return newInvalidQuery();
}

function buildQueryFromString(text: string): GetOptions {
  if (typeof text !== "string") return newInvalidQuery();
  const querySource = getQuerySourceFromString(text);
  switch (querySource) {
    case QuerySource.Self:
      return buildSelfQueryFromString(text);
    default:
      return newInvalidQuery();
  }
}

function getQuerySourceFromString(text: string) {
  if (typeof text !== "string") return QuerySource.Invalid;
  const variableChunks = text.split(".");
}

function newInvalidQuery(): GetOptions {
  return { source: QuerySource.Invalid } as InvalidQueryOptions;
}
