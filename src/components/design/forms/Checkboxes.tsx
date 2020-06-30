import React from "react";
import { FormCheck } from "./FormCheck";
import { FieldProps } from "./types";

interface CheckboxProps extends FieldProps {
  "aria-label"?: string; // Hidden label for readability
  children?: any; // Any additional children for a checkbox, such as a label
  disabled?: string; // Any string value indicates that this is disabled
  name: string; // The checkbox field name
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