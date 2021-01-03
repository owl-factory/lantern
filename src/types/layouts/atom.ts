import { Display, Width } from ".";
import { AtomType } from "../enums/atomType";

// Describes the structure of an atom object for properly rendering all atoms
export interface Atom {
  type: AtomType; // The type of atom this object will build
  w?: Width; // The widths at different sizes of the atom
  display?: Display; // The displays at different sizes of the atom

  // Any miscellaneous styles that alter the atom appearance
  style?: Record<string, string>;

  // A collection of key-value pairs that contain static text to render
  staticValues?: Record<string, string>;

  // A collection of key-value pairs that instructs where in the dynamic data
  // the atom may find the value to render
  dynamicValues?: Record<string, string>;
}

// The type for props used by all atom components
export interface AtomProps {
  atom: Atom; // The atom object describing how to render an atom
  data: Record<string, unknown>; // Any database data that may be used in the atom
}
