import { Atom, Molecule, Width } from ".";

// Describes how to render a single subsection and all of the molecules 
// and atoms therein
export interface Subsection {
  // The name of the subsection, if any
  name?: string;
  // The description of the subsection, if any
  description?: string;

  // The width object ot describe the subsection size, if any. If undefined, the
  // section is automatic width
  w?: Width;

  // The preview height of the subsection. 
  h: number;

  // The molecules or atoms to render
  molecules: (Molecule | Atom)[];
}