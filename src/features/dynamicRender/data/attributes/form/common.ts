import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";

/** Commonly shared attributes across all inputs */
export const commonInputAttributes: AttributeDefinition[] = [
  { name: "source", default: "character" },
  { name: "name", required: true },
];
