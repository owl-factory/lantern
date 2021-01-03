import React from "react";
import { AtomProps } from "../../../types/layouts/atom";
import { findValue } from "../../../utilities/layouts/atoms";

/**
 * Renders an action to perform.
 * TODO - This may get removed?
 *
 * @param props.atom The definition of the atom to render
 * @param props.data The dynamic data that may be referenced by the atom
 */
export function Action(props: AtomProps) {
  const action = () => { console.log("Action click!"); };
  const label = findValue("label", props);
  return (
    <a onClick={action}>{label}</a>
  );
}
