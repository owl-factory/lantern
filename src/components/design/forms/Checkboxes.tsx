import React from "react";
import { FormCheck } from "./FormCheck";
import { FieldProps } from "./types";

interface CheckboxProps extends FieldProps {
  ariaLabel?: string;
  children?: any;
  disabled?: string;
  name: string;
}

/**
 * Renders the base checkbox for higher customization
 * @param props See BaseCheckboxProps
 */
export function Checkbox(props: CheckboxProps) {  
  return (
    <FormCheck type="checkbox" {...props}/>
  );
}