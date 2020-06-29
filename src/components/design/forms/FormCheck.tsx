import React from "react";
import { Form } from "react-bootstrap";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../helpers/tools";
import { useField } from "formik";

interface FormCheckProps extends FieldProps {
  "aria-label"?: string;
  children?: any;
  disabled?: string;
  name: string;
  type: "checkbox" | "radio" | "switch";
}

/**
 * Renders the base checkbox for higher customization
 * @param props See BaseCheckboxProps
 */
export function FormCheck(props: FormCheckProps) {
  const id = def<string>(props.id, props.name);
  
  const checkboxProps = objectKeepFields(
    props, 
    ["checked", "disabled", "isValid", "name", "type"]
  );
  const [field] = useField({ ...checkboxProps, type: "check" });
  
  return (
    <Form.Check 
      aria-label={props["aria-label"]}
      custom
      id={id}
      type={props.type}
    >
      <Form.Check.Input 
        {...checkboxProps}
        {...field}
      />
      {props.children}
    </Form.Check>
  );
}