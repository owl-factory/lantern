import React from "react";
import { Col, Form } from "react-bootstrap";
import { renderDisplayClasses } from ".";
import { Multiselect } from "../../design/forms/Forms";
import { RenderError } from "../Layouts";

export function MultiselectInput(props: any) {
  let errors: string = "";
  const classes = renderDisplayClasses(props.atom.display);
  const inputName = props.atom.staticValues.inputName || undefined;
  const label = props.atom.staticValues.label || undefined;
  const placeholder = props.atom.staticValues.placeholder || undefined;
  
  if (!inputName) { errors += "An input name is required."; }

  if (errors) { return <RenderError w={props.atom.w} errors={errors}/>; }

  return (
    <Form.Group as={Col} className={classes} {...(props.atom.w || {})}>
      { label ? <Form.Label>{label}</Form.Label> : null }
      <Multiselect name={inputName} emptyText={placeholder}/>
    </Form.Group>
  );
}