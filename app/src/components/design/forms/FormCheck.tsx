import { useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { objectKeepFields } from "../../../utilities/tools";
import { CoreFormCheckProps } from "../../../model/design/form";

interface FormCheckProps extends CoreFormCheckProps {
  type: "checkbox" | "radio" | "switch"; // Which type of check input we use
  value?: string; // The value to use for radio buttons
}

/**
 * Renders the base checkbox for higher customization
 * @param props.aria-label The usability label
 * @param props.children Children to render within the input, such as labels
 * @param props.disabled Any non-empty string indicates that this field is disabled
 * @param props.name The field name of the input
 * @param props.id The optional id of this check element
 * @param props.type Which type of FormCheck to render. May be checkbox, radio, or switch
 * @param props.value The value of radio buttons. Checkboxes and switches are true/false
 * @param props.xs Width for extra small screens
 * @param props.sm Width for small screens
 * @param props.md Width for extra medium screens
 * @param props.lg Width for large screens
 * @param props.xl Width for extra large screens
 */
export function FormCheck(props: FormCheckProps): JSX.Element {
  const id = props.id || props.name;
  
  const checkboxProps = objectKeepFields(
    props, 
    ["checked", "disabled", "name", "type", "value"]
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