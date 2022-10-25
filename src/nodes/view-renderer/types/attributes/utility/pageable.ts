import { ElementDescriptor } from "../../elements";
import { Expression } from "../../expression";

// Describes the attributes of a pageable element
export interface PageableAttributes {
  className: Expression;
  pages: Record<string, ElementDescriptor<unknown>[]>;
}
