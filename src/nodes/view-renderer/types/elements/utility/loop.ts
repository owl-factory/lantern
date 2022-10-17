import { GenericElementDescriptor } from "../generic";

// Describes a loop element
export interface LoopDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
  list?: string[];
  listSource?: string;
  delimiter: string;

  key: string; // The name of the variable used to access this variable
  index: string | null; // The name used to access the index
}
