import React from "react";
import { Col, Form } from "react-bootstrap";
import { AtomProps } from "types/layouts";
import { findValue } from "utilities/layouts";
import { ErrorMessage } from "components/design/forms";
import { AtomError } from "components/layouts/atoms";
import { Input } from "components/style/forms";

/**
 * Renders a text input that connects with a Formik form
 *
 * @param props.atom The definition of the atom to render
 * @param props.data The dynamic data that may be referenced by the atom
 */
export function TextInput(props: AtomProps) {
  let errors = "";

  // Ensures that inputName value is present as this will break
  // TODO - can we have this as a shared function?
  const inputName = findValue("inputName", props);
  if (!inputName) { errors += "An input name is required."; }
  if (errors) { return <AtomError w={props.atom.w} errors={errors}/>; }

  const label = findValue("label", props);
  const placeholder = findValue("placeholder", props);

  return (
    <Form.Group as={Col} {...(props.atom.w || {})}>
      { label ? <Form.Label>{label}</Form.Label> : null }
      <Input
        type="text"
        name={inputName}
        placeholder={placeholder}
      />
      <ErrorMessage name={inputName} />
    </Form.Group>
  );
}
