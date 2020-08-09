import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../utilities/tools";

interface SwitchProps extends FieldProps {
  "aria-label"?: string; // A hidden label for usability
  children?: any; // Any children, such as a label
  disabled?: string; // A string value indicates that this switch is disabled
  label?: string; // The inline label
  name: string; // The argument name of the switch input
}

/**
 * Renders the base Switch for higher customization
 * @param props See BaseSwitchProps
 */
export function Switch(props: SwitchProps) {
  const id = def<string>(props.id, props.name);
  
  const switchProps = objectKeepFields(
    props, 
    ["disabled", "label", "name"]
  );
  const [field] = useField({ ...switchProps, type: "check" });

  return (
    <Form.Check 
      type="switch"
      id={id}
      {...switchProps}
      {...field}
    />
  );
}