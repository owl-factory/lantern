import React from "react";
import { Col, Form } from "react-bootstrap";
import { findValue, renderDisplayClasses } from "../../../utilities/layouts/atoms";
import { AtomProps } from "../../../types/layouts/atom";
import { Multiselect } from "../../design/forms/Forms";
import { AtomError } from "../atoms/AtomError";

/**
 * Renders an input that allows for selecting multiple options
 * @param props.atom The definition of the atom to render
 * @param props.data The dynamic data that may be referenced by the atom
 */
export function MultiselectInput(props: AtomProps) {
  let errors: string = "";

  // Ensures that we have an input name, since formik breaks without it
  const inputName = findValue("inputName", props); 
  if (!inputName) { errors += "An input name is required."; }
  if (errors) { return <AtomError w={props.atom.w} errors={errors}/>; }

  // Finds these values after to prevent unneeded usage of 
  const classes = renderDisplayClasses(props.atom.display);
  const label = findValue("label", props);
  const placeholder = findValue("placeholder", props);

  return (
    <Form.Group as={Col} className={classes} {...(props.atom.w || {})}>
      { label ? <Form.Label>{label}</Form.Label> : null }
      <Multiselect name={inputName} emptyText={placeholder}/>
    </Form.Group>
  );
}