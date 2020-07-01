import React from "react";
import { FieldProps } from "./types";
import { FormCheck } from "./FormCheck";

interface RadioButtonProps extends FieldProps {
  "aria-label"?: string;
  children?: any;
  disabled?: string;
  name: string;
  value: string;
}

export function RadioButton(props: RadioButtonProps) {
  return (
    <FormCheck type="radio" {...props}/>
  );
}