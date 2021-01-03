import React from "react";
import { findValue } from ".";
import { Atom } from "../Layouts";

interface ActionProps {
  atom: Atom;
}

export function Action(props: ActionProps) {
  const action = () => { console.log("Action click!"); }
  const label = findValue("label", props);
  return (
    <a onClick={action}>{label}</a>
  )
}