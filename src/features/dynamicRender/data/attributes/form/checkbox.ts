import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { commonInputAttributes } from "./common";

/** The attributes used by checkbox inputs */
export const checkboxAttributes: AttributeDefinition[] = [
  ...commonInputAttributes,
  { name: "value", default: "on" },
];
