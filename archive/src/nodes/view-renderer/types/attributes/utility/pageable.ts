import { ElementDescriptor } from "../../elements";
import { Expression } from "../../expression";

// Describes the attributes of a pageable element
export interface PageableAttributes {
  className: Expression;
  id: string;
  pages: Record<string, ElementDescriptor<unknown>[]>;
}
