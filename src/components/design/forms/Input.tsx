/* eslint-disable @typescript-eslint/no-use-before-define */
import React from "react";
import { Form } from "react-bootstrap"
import { def, objectKeepFields } from "../../../helpers/tools";
import { FieldProps } from "./types";

export interface InputProps extends FieldProps {
  // Default input properties
  ariaLabel?: string; // The usability label
  disabled?: boolean; // If an input is disabled or not
  name: string; // The name of the input
  onChange?: (event: object) => void; // The event that occurs on change
  placeholder?: string; // A placeholder value for when the input is empty
  required?: boolean; // If this is required or not
  rows?: number; // The number of rows (multiline must be true)
  type?: string; // The ???
  value?: string; // The value of the input

  // Bootstrap Properties
  as?: string; // Controls what the input is seen as
  size?: "sm" | "lg"; // The bootstrap size of the input

  // Custom values for logic
  defaultValue?: string; // The default value to start with (if given no value)
}

/**
 * Renders out a grid-based input block
 * @param props see IInput
 */
export function Input(props: InputProps) {
  const id = def<string>(props.id, props.name);

  const inputProps = objectKeepFields(
    props,
    ["as", "disabled", "multiline", "name", "placeholder", "required", "rows", "type", "value"],
  );

  return (
    <Form.Control  
      {...inputProps}
      id={id}
      aria-label={props.ariaLabel}
      onChange={props.onChange}
    />
  );
}