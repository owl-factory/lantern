import React from "react";
import { Display, RenderError } from "../Layouts";
import { MultiselectInput } from "./Multiselect";
import { Submit } from "./Submit";
import { TextInput } from "./TextInput";

export enum AtomType {
  TextInput,
  SelectInput,
  MultiselectInput,
  Submit,
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


export function DynamicAtom(props: any): JSX.Element {
  try {
    switch(props.atom.type) {
      // case "checkbox":
      //   return <input type="checkbox"/>;
      case AtomType.TextInput:
        return <TextInput atom={props.atom}/>;
      case AtomType.MultiselectInput:
        return <MultiselectInput atom={props.atom}/>;
      case AtomType.Submit:
        return <Submit atom={props.atom}/>;
      // case "numberInput":
      //   return <input type="number" style={props.component.style} />;
      // case "text":
      //   return <div>{props.component.value}</div>
    }
  } catch (error) {
    // Last ditch error catch to prevent the whole sheet from crashing
    return <RenderError w={props.atom.w} errors={error.message}/>
  }
  return <></>;
}
