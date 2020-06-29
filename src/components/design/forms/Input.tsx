/* eslint-disable @typescript-eslint/no-use-before-define */
import React from "react";
import { Form } from "react-bootstrap"
import { FieldProps } from "./types";

import { useField } from "formik";

type As = "input" | "textarea";

export interface InputProps extends FieldProps {
  // Default input properties
  "aria-label"?: string; // The usability label
  disabled?: boolean; // If an input is disabled or not
  name: string; // The name of the input
  placeholder?: string; // A placeholder value for when the input is empty
  rows?: number; // The number of rows (multiline must be true)
  type?: string; // The type of input (text, password, datetime, etc.)

  // Bootstrap Properties
  as?: As; // Controls what the input is seen as
  size?: "sm" | "lg"; // The bootstrap size of the input
}

/**
 * Renders out a grid-based input block
 * @param props see IInput
 */
export function Input(props: InputProps) {
  const [field] = useField(props);

  return (
    <Form.Control 
      {...field}
      {...props}
    />
  );
}