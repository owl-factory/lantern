import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

// Describes a loop element
export interface LoopDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];

  delimiter: string;
  list: ParsedExpressionString;
  key: string; // The name of the variable used to access this variable
  index: string | null; // The name used to access the index
}
