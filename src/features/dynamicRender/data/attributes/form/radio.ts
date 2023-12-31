import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { commonInputAttributes } from "./common";

/** The attributes used by radio inputs */
export const radioAttributes: AttributeDefinition[] = [...commonInputAttributes, { name: "value", required: true }];
