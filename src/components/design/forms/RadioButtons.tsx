import React from "react";
import { FieldProps } from "./types";
import { FormCheck } from "./FormCheck";

interface RadioButtonProps extends FieldProps {
  ariaLabel?: string;
  checked?: any;
  children?: any;
  disabled?: string;
  name: string;
  id: string;
  isValid?: boolean;
  value?: string;
}

export function RadioButton(props: RadioButtonProps) {
  return (
    <FormCheck type="radio" {...props}/>
  );
}