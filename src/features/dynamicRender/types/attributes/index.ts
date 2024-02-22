import { ExpressionDescriptor } from "features/dynamicRender/types/expression";

/** A record of all found and present attributes for a parsed element */
export type Attributes = Record<string, Attribute>;

/** A single attribute that is parsed and usable in a render */
export type Attribute = string | ExpressionDescriptor;
