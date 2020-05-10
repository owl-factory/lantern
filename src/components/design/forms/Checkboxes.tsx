import React from "react";
import { Col, Form } from "react-bootstrap";
import { FieldProps } from "./types";
import { $gridItemPropFields, $renderMessage } from "./Forms";
import { def, objectKeepFields } from "../../../helpers/tools";

type GetValue = (name: string, defaultValue: any) => (boolean | undefined);

interface BaseCheckboxProps extends FieldProps {
  ariaLabel?: string;
  disabled?: string;
  name: string;
  onChange?: (event: any) => (void);
  isValid?: boolean;
  checked?: any;
}

interface CheckboxProps extends BaseCheckboxProps {
  inline?: boolean;
  label?: string;
}



/**
 * Renders a full Checkbox with labels and such
 * @param props See CheckboxProps
 */
export function Checkbox(props: CheckboxProps) {
  const id = def<string>(props.id, props.name);

  const checkboxProps = objectKeepFields(
    props, 
    ["checked", "disabled", "inline", "isValid", "label", "name",]
  );

  return (
    <Form.Check 
      type="checkbox"
      aria-label={props.ariaLabel}
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
export function BaseCheckbox(props: CheckboxProps) {
  const id = def<string>(props.id, props.name);
  
  const checkboxProps = objectKeepFields(
    props, 
    ["checked", "disabled", "isValid", "name", "value"]
  );

  return (
    <Form.Check.Input 
      type="checkbox"
      aria-label={props.ariaLabel}
      id={id}
      onChange={props.onChange}
      {...checkboxProps}
    />
  );
}