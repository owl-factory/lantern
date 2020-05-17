import React from "react";
import { Form } from "react-bootstrap";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../helpers/tools";

interface SharedFormCheckProps extends FieldProps {
  ariaLabel?: string;
  checked?: any;
  disabled?: string;
  isValid?: boolean;
  name: string;
  onChange?: (event: any) => (void);
  type: "checkbox" | "radio" | "switch";
  value?: string;
}

interface BaseFormCheckProps extends SharedFormCheckProps {
  children?: any;
}

interface FormCheckProps extends SharedFormCheckProps {
  inline?: boolean;
  label?: string;
}

/**
 * Renders a full Checkbox with labels and such
 * @param props See CheckboxProps
 */
export function FormCheck(props: FormCheckProps) {
  const id = def<string>(props.id, props.name);

  const checkboxProps = objectKeepFields(
    props, 
    ["checked", "disabled", "inline", "isValid", "label", "name", "type", "value"]
  );

  return (
    <Form.Check 
      aria-label={props.ariaLabel}
      custom
      id={id}
      onChange={props.onChange}
      {...checkboxProps}
    />
  );
}

/**
 * Renders the base checkbox for higher customization
 * @param props See BaseCheckboxProps
 */
export function BaseFormCheck(props: BaseFormCheckProps) {
  const id = def<string>(props.id, props.name);
  
  const checkboxProps = objectKeepFields(
    props, 
    ["checked", "disabled", "isValid", "name", "type"]
  );
  
  return (
    <Form.Check 
      aria-label={props.ariaLabel}
      custom
      id={id}
      type={props.type}
    >
      <Form.Check.Input 
        onChange={props.onChange}
        {...checkboxProps}
      />
      {props.children}
    </Form.Check>
  );
}