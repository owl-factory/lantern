import React from "react";
import { Col, Form } from "react-bootstrap";
import { Error, Input } from "../../design/forms/Forms";
import { RenderError } from "../Layouts";

export function TextInput(props: any) {
  let errors: string = "";
  const inputName = props.atom.staticValues.inputName || undefined;
  const label = props.atom.staticValues.label || undefined;
  const placeholder = props.atom.staticValues.placeholder || undefined;
  
  if (!inputName) { errors += "An input name is required."; }

  if (errors) { return <RenderError w={props.atom.w} errors={errors}/>; }

  return (
    <Form.Group as={Col} {...(props.atom.w || {})}>
      { label ? <Form.Label>{label}</Form.Label> : null }
      <Input 
        name={inputName} 
        placeholder={placeholder}
      />
      <Error name={inputName} />
      
    </Form.Group>
  );
}