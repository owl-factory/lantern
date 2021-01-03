import React from "react";
import { MoleculeType } from "../../../types/enums";
import { Atom } from "../../../types/layouts";
import { Molecule } from "../../../types/layouts/molecule";
import { renderDisplayClasses } from "../../../utilities/layouts/atoms";
import { DynamicAtom } from "../atoms";
import { AccordionMolecule } from "./Accordion";



interface MoleculeProps {
  molecule: Molecule | Atom;
  data: Record<string, unknown>;
  staticValues?: Record<string, string>;
  dynamicValues?: Record<string, string>;
}

/**
 * Renders a single molecule and all of it's atoms or a single atom, depending on 
 * which one is given. 
 * @param props.molecule A single molecule or a single atom. 
 */
export function DynamicMolecule(props: MoleculeProps) {
  // Renders a single atom, since atoms will never have subatoms within them
  // Kind of a weird hack since Javascript doesn't have good typing :(
  if (!("atoms" in props.molecule)) { return <DynamicAtom {...props} atom={props.molecule}/>; }

  const atoms: Atom[] = [];
  const displayClasses = renderDisplayClasses(props.molecule.display);
  const molecule = props.molecule as Molecule; // Casting here for reusability
  
  molecule.atoms.forEach((atom: Atom) => {
    atoms.push(<DynamicAtom atom={atom} data={props.data} />)
  });

  switch(molecule.type) {
    case MoleculeType.Accordion:
      return <AccordionMolecule molecule={molecule}>{atoms}</AccordionMolecule>;  
    case MoleculeType.Div:
      return <div className={displayClasses}>{atoms}</div>;
    default: 
      return <>{atoms}</>;
  }
}