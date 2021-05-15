import React from "react";
import { AtomProps } from "types/layouts";
import { findValue } from "utilities/layouts";

/**
 * Simply renders a spot of text pulled from a static or dynamic source
 *
 * @param props.atom The definition of the atom to render
 * @param props.data The dynamic data that may be referenced by the atom
 */
export function Text(props: AtomProps) {
  const text = findValue("text", props);
  return (
    <span>{text}</span>
  );
}
