import React from "react";
import { Atom } from "../Layouts";

interface ActionProps {
  atom: Atom;
}

export function Action(props: ActionProps) {
  const action = () => { console.log("Action click!"); }
  const label = props.atom.staticValues.label || undefined;
  return (
    <a onClick={action}>{label}</a>
  )
}