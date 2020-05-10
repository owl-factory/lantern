import React from "react";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../helpers/tools";
import { Col, Form } from "react-bootstrap";
import { $gridItemPropFields, $renderMessage } from "./Forms";


interface SelectProps extends FieldProps {
  name: string; // The name of the input
  disabled?: boolean; // If this is disabled or not
  required?: boolean; // If this is required or not
  keyPostfix?: string; // A postfix to append to the end of the key

  defaultValue?: string | string[]; // The default value to use, if blank
  emptyText?: string; // Text to display if empty option is included
  includeEmpty?: boolean; // Include an empty selection
  onChange?: (event: object) => void; // The function to use on change
  multiple?: boolean; // True allows for multiple items to be selected
  value?: any; // The default value to display
  size?: "sm" | "lg"; // The size of the select input

  data?: object[]; // An array of structs containing the label and value to use
  children?: any; // User-defined children, if that wants to be handled externally
  labelKey?: string; // The key to use for label inputs
  valueKey?: string; // The key of the value

  getError?: (name: string) => (string); // Grabs errors for the given name
}


export function Multiselect(props: SelectProps) {
  return <Select multiple {...props}/>
}

/**
 * Renders a select element and its options
 * @param props see ISelect
 */
export function Select(props: SelectProps) {
  const id = def<string>(props.id, props.name);

  const options = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const valueKey = def<string>(props.valueKey, "value");
  const emptyText = def<string>(props.emptyText, "-- Select One --");

  const selectProps = objectKeepFields(props, ["disabled", "multiple", "name", "required", "size", "value"]);

  let emptyElement: JSX.Element | undefined;
  if (props.includeEmpty !== false) {
    emptyElement = <option value="">{emptyText}</option>;
  }

  let children: any = [];
  if (props.children === undefined) {
    let index = 0;
    options.forEach((option: any) => {
      children.push(
        <option key={id + "_" + index++} value={option[valueKey]}>{option[labelKey]}</option> , 
      );
    });
  } else {
    children = props.children;
  }

  return (
    <Form.Control
      as="select"
      {...selectProps}
      id={id}
      onChange={props.onChange}
    >
      {emptyElement}
      {children}
    </Form.Control>
  );
}