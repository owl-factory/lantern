import React from "react";
import { Button, Col } from "react-bootstrap";
import { renderDisplayClasses } from ".";

export function Submit(props: any) {
  const buttonText = props.atom.staticValues.label || undefined;
  const classes = renderDisplayClasses(props.atom.display);

  return (
    <Col className={classes} {...(props.atom.w || {})}>
      <Button type="submit">{buttonText}</Button>
    </Col>
  )
}