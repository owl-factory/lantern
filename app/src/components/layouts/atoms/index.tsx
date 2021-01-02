import React from "react";
import { Atom, Display, RenderError } from "../Layouts";
import { Action } from "./Action";
import { LabeledText } from "./LabeledText";
import { MultiselectInput } from "./Multiselect";
import { Submit } from "./Submit";
import { TernaryInput } from "./TernaryInput";
import { Text } from "./Text";
import { TextInput } from "./TextInput";


/**
 * Finds the value for a given key in the dynamic or static values
 * @param key The key of the value, dynamic or static, that we wish to render for
 * @param props Contains the props of either atom or molecule and the dynamic 
 *  data to look through. 
 */
export function findValue(
  key: string, 
  props: any
) {
  // Ensures that we're fetching for an atom or a molecule to save an input
  const atom = props.atom || props.molecule;
  if (!atom) { return "None1"; }

  // Fetches both dynamic values and static values for readability
  const dynamicValues = atom.dynamicValues;
  const staticValues = atom.staticValues;

  // Simple base cases: takes care of static and 
  if (!dynamicValues || !(key in dynamicValues)) {
    if (staticValues !== undefined && key in staticValues) {
      return staticValues[key];
    }
    return "None3";
  }

  let curr = props.data;
  const keys = dynamicValues[key].split(".");
  keys.forEach((element: string) => {
    console.log(curr)
    console.log(element)
    if (!curr || !(element in curr)) { return "" };
    curr = curr[element];
  });

  if (typeof curr === "string") { return curr; }
  return "";
}

export enum AtomType {
  Action,
  LabeledText,
  MultiselectInput,
  SelectInput,
  TernaryInput,
  Text,
  TextInput,
  Submit,
}

interface AtomProps {
  atom: Atom;
  data: Record<string, unknown>;
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
  console.log(props)
  try {
    switch(props.atom.type) {
      case AtomType.Action:
        return <Action {...props}/>;
      case AtomType.LabeledText:
        return <LabeledText {...props} />;
      case AtomType.MultiselectInput:
        return <MultiselectInput {...props}/>;
      case AtomType.Submit:
        return <Submit {...props}/>;
      case AtomType.TernaryInput:
        return <TernaryInput {...props}/>;
      case AtomType.Text:
        return <Text {...props}/>
      case AtomType.TextInput:
        return <TextInput {...props}/>;
      
    }
  } catch (error) {
    // Last ditch error catch to prevent the whole sheet from crashing
    return <RenderError w={props.atom.w} errors={error.message}/>
  }
  return <></>;
}
