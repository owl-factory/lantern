import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../utilities/tools";

interface FormCheckProps extends FieldProps {
  "aria-label"?: string; // A hidden label for readability
  children?: any; // Any children to include, such as a label
  disabled?: string; // Any string value indicates that this is disabled
  name: string; // The name of the argument for the check input
  type: "checkbox" | "radio" | "switch"; // Which type of check input we use
  value?: string; // The value to use for radio buttons
}

/**
 * Renders the base checkbox for higher customization
 * @param props See BaseCheckboxProps
 */
export function FormCheck(props: FormCheckProps) {
  const id = def<string>(props.id, props.name);
  
  const checkboxProps = objectKeepFields(
    props, 
    ["checked", "disabled", "isValid", "name", "type", "value"]
  );
  const [field] = useField({ ...checkboxProps, type: props.type });
  
  return (
    <Form.Check 
      aria-label={props["aria-label"]}
      custom
        id={id}
        type={props.type}
    >
      <Form.Check.Input
        id={id}
        {...checkboxProps}
        {...field}
      />
      {props.children}
    </Form.Check>
  );
}