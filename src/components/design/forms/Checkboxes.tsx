import React from "react";
import { FormCheck } from "./FormCheck";
import { FieldProps } from "./types";

interface CheckboxProps extends FieldProps {
  "aria-label"?: string;
  children?: any;
  disabled?: string;
  name: string;
}

/**
 * Renders the base checkbox for higher customization
 * @param `props.aria-label` The readability label for the checkboxes
 * @param props.children Any additional children for a checkbox, such as a label
 * @param props.disabled Any string value indicates that this is disabled
 * @param props.name The checkbox field name
 */
export function Checkbox(props: CheckboxProps) {  
  return (
    <FormCheck type="checkbox" {...props}/>
  );
}