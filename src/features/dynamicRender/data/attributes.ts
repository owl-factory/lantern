import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";

/** Commonly shared attributes across all inputs */
export const COMMON_INPUT_ATTRIBUTE_DEFINITIONS: AttributeDefinition[] = [
  { name: "source", default: "character" },
  { name: "name", required: true },
];
