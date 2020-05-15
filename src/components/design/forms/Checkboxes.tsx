import React from "react";
import { Form } from "react-bootstrap";
import { BaseFormCheck, FormCheck } from "./FormCheck";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../helpers/tools";

interface SharedCheckboxProps extends FieldProps {
  ariaLabel?: string;
  disabled?: string;
  name: string;
  onChange?: (event: any) => (void);
  isValid?: boolean;
  checked?: any;
}

interface BaseCheckboxProps extends SharedCheckboxProps {
  children?: any;
}

interface CheckboxProps extends SharedCheckboxProps {
  inline?: boolean;
  label?: string;
}

/**
 * Renders a full Checkbox with labels and such
 * @param props See CheckboxProps
 */
export function Checkbox(props: CheckboxProps) {
  return (
    <FormCheck type="checkbox" {...props}/>
  );
}

/**
 * Renders the base checkbox for higher customization
 * @param props See BaseCheckboxProps
 */
export function BaseCheckbox(props: BaseCheckboxProps) {  
  return (
    <BaseFormCheck type="checkbox" {...props}/>
  );
}