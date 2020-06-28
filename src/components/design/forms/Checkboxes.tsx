import React from "react";
import { Form } from "react-bootstrap";
import { FormCheck } from "./FormCheck";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../helpers/tools";

interface CheckboxProps extends FieldProps {
  ariaLabel?: string;
  children?: any;
  disabled?: string;
  name: string;
  isValid?: boolean;
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