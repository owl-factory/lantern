import { Atom, Display } from ".";
import { MoleculeType } from "../enums";

// Describes how to render a molecule wrapping a collection of atoms
export interface Molecule {
  // The type of molecule that we will render
  type: MoleculeType;
  // The collection of atom objects that describes the atoms
  // contained in the molecule
  atoms: Atom[];

  // Instructions on how to render the molecule at different screen sizes
  display?: Display;

  // Key-value pairs that contain static text to render within the molecule
  staticValues?: Record<string, string>;

  // Key-value pairs that contain the locations of dynamic data for certain fields
  dynamicValues?: Record<string, string>;
}
