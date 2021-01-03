import React from "react";
import { Col, Form } from "react-bootstrap";
import { findValue } from ".";
import { Error, Input } from "../../design/forms/Forms";
import { Atom, RenderError } from "../Layouts";

interface TextInputProps {
  atom: Atom;
}

/**
 * Renders a text input
 * @param props 
 */
export function TextInput(props: TextInputProps) {
  let errors: string = "";
  const inputName = findValue("inputName", props);
  const label = findValue("label", props);
  const placeholder = findValue("placeholder", props);
  
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