import { GenericSheetElementDescriptor, SheetVariableTuple } from "./generic";

// Describes a loop element
export interface LoopElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];

  listType: "static" | "variable"; // Internal use. Determines if we need to fetch a variable
  list: SheetVariableTuple | string[];
  key: string; // The name of the variable used to access this variable
}
