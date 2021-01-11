import React from "react";
import { findValue } from "../../../utilities/layouts/atoms";
import { AtomProps } from "../../../types/layouts/atom";

/**
 * Renders text labeled by seperate text. This will not render if no text is present
 * @param props.atom The definition of the atom to render
 * @param props.data The dynamic data that may be referenced by the atom
 */
export function LabeledText(props: AtomProps) {
  // Exits early if no text is found
  const text = findValue("text", props);
  if (!text) { return <></>; }

  const label = findValue("label", props);
  return (
    <div>
      <span>{label}</span>&nbsp;
      <span>{text}</span>
    </div>
  );
}
