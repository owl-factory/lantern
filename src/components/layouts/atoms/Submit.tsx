import React from "react";
import { Button, Col } from "react-bootstrap";
import { findValue, renderDisplayClasses } from "utilities/layouts";
import { AtomProps } from "types/layouts";

/**
 * Renders a button to act as a submit button
 * @param props.atom The definition of the atom to render
 * @param props.data The dynamic data that may be referenced by the atom
 */
export function Submit(props: AtomProps) {
  const label = findValue("label", props);
  const classes = renderDisplayClasses(props.atom.display);

  return (
    <Col className={classes} {...(props.atom.w || {})}>
      <Button type="submit">{label}</Button>
    </Col>
  );
}
