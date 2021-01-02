import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { CoreFormCheckProps } from "../../../types/design/form";

/**
 * Renders the a single switch
 * @param props.aria-label The usability label
 * @param props.children Children to render within the input, such as labels
 * @param props.disabled Any non-empty string indicates that this field is disabled
 * @param props.name The field name of the input
 * @param props.id The optional id of this check element
 * @param props.value The value of radio buttons.
 * @param props.xs Width for extra small screens
 * @param props.sm Width for small screens
 * @param props.md Width for extra medium screens
 * @param props.lg Width for large screens
 * @param props.xl Width for extra large screens
 */
export function Switch(props: CoreFormCheckProps): JSX.Element {
  const id = props.id || props.name;

  const [field] = useField({name: props.name});

  return (
    <Form.Check
      type="switch"
      disabled={props.disabled || false}
      label={props.label}
      id={id}
      {...field}
    />
  );
}
