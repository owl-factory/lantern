/* eslint-disable @typescript-eslint/no-use-before-define */
import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { CoreInputProps } from "../../../types/design/form";

// The type describing valid inputs for Input's as field
type As = "input" | "textarea";

interface InputProps extends CoreInputProps {
  as?: As; // Controls what the input is seen as (input or textarea)
  rows?: number; // The number of rows (as must be textarea)
  type?: string; // The type of input (text, password, datetime, etc.)
}

/**
 * Renders out a grid-based input block
 * @param props.as Controls what the input is seen as
 * @param props.aria-label The usability label
 * @param props.disabled If an input is disabled or not
 * @param props.id The input id
 * @param props.label The label of the inputs
 * @param props.name The name of the input
 * @param props.placeholder A placeholder value for when the input is empty
 * @param props.rows The number of rows (`as` must be textarea)
 * @param props.type The type of the
 * @param props.size The bootstrap size of the input.
 * @param props.xs Width for extra small screens
 * @param props.sm Width for small screens
 * @param props.md Width for extra medium screens
 * @param props.lg Width for large screens
 * @param props.xl Width for extra large screens
 */
export function Input(props: InputProps): JSX.Element {
  const [field] = useField(props);

  return (
    <Form.Control
      {...field}
      {...props}
      autoComplete={props.autoComplete === undefined ? "off" : props.autoComplete }
    />
  );
}
