import React from "react";
import { DynamicAtom } from "../Atoms";
import { Atom } from "../Layouts";
import { AccordionMolecule } from "./Accordion";

export enum MoleculeType {
  Accordion,
  Div,
}

export function DynamicMolecule(prop: any) {
  if (!prop.molecule.atoms) { return <DynamicAtom atom={prop.molecule}/>; }

  const atoms: Atom[] = [];
  let moleculeRender: (props: any) => (JSX.Element);
  prop.molecule.atoms.forEach((atom: Atom) => {
    atoms.push(<DynamicAtom atom={atom}/>)
  });

  switch(prop.molecule.type) {
    case MoleculeType.Accordion:
      return <AccordionMolecule molecule={prop.molecule}>{atoms}</AccordionMolecule>;  
    case MoleculeType.Div:
      return <div>{atoms}</div>;
  }
  return <>pp{atoms}</>;
}