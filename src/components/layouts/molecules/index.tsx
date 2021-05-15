import React from "react";
import { MoleculeType } from "types/enums";
import { Atom, Molecule } from "types/layouts/";
import { renderDisplayClasses } from "utilities/layouts";
import { DynamicAtom } from "components/layouts";
import { AccordionMolecule } from "components/layouts/molecules";

interface MoleculeProps {
  // The molecule or atom to render
  molecule: Molecule | Atom;

  // The dynamic data to reference by the molecule or atom
  data: Record<string, unknown>;
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
    atoms.push(<DynamicAtom atom={atom} data={props.data} />);
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

export * from "components/layouts/molecules/Accordion";
