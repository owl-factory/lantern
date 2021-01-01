import React from "react";
import { Atom, Display, RenderError } from "../Layouts";
import { Action } from "./Action";
import { MultiselectInput } from "./Multiselect";
import { Submit } from "./Submit";
import { TernaryInput } from "./TernaryInput";
import { TextInput } from "./TextInput";

export enum AtomType {
  Action,
  MultiselectInput,
  SelectInput,
  TernaryInput,
  TextInput,
  Submit,
}

interface AtomProps {
  atom: Atom;
}

export function renderDisplayClasses(display?: Display) {
  let classString = " ";
  if (display === undefined) { return classString; }
  if (display.xs) { classString += `d-${display.xs} `; }
  if (display.sm) { classString += `d-sm-${display.sm} `; }
  if (display.md) { classString += `d-md-${display.md} `; }
  if (display.lg) { classString += `d-lg-${display.lg} `; }
  if (display.xl) { classString += `d-xl-${display.xl} `; }
  return classString;
}

/**
 * Renders a singlular atom
 * @param props.atom The definition of the atom to render
 */
export function DynamicAtom(props: AtomProps): JSX.Element {
  try {
    switch(props.atom.type) {
      case AtomType.Action:
        return <Action atom={props.atom}/>;
      case AtomType.MultiselectInput:
        return <MultiselectInput atom={props.atom}/>;
      case AtomType.Submit:
        return <Submit atom={props.atom}/>;
      case AtomType.TextInput:
        return <TextInput atom={props.atom}/>;
      case AtomType.TernaryInput:
        return <TernaryInput atom={props.atom}/>;
    }
  } catch (error) {
    // Last ditch error catch to prevent the whole sheet from crashing
    return <RenderError w={props.atom.w} errors={error.message}/>
  }
  return <></>;
}
