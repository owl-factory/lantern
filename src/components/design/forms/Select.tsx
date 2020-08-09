/* eslint-disable @typescript-eslint/no-use-before-define */
import React from "react";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../utilities/tools";
import { Form } from "react-bootstrap";
import { useField } from "formik";


interface SelectProps extends FieldProps {
  // Select Properties
  disabled?: boolean; // If this is disabled or not
  name: string; // The name of the select
  required?: boolean; // If this is required or not

  // Bootstrap Select Arguments
  multiple?: boolean; // True allows for multiple items to be selected
  size?: "sm" | "lg"; // The size of the select input

  // Custom Inputs
  children?: any; // User-defined children, if one wants to be handled externally
  emptyText?: string; // Text to display if empty option is included
  includeEmpty?: boolean; // Include an empty selection
  labelKey?: string; // The key to use for label inputs
  options?: object[]; // An array of structs containing the label and value to use
  valueKey?: string; // The key of the value

}

/**
 * 
 * @param props The props to apply to the Select element
 */
export function Multiselect(props: SelectProps) {
  // TODO - has issue with a single option remaining
  return <Select multiple {...props}/>
}

/**
 * Renders a select element and its options
 * @param props see ISelect
 */
export function Select(props: SelectProps) {
  const id = def<string>(props.id, props.name);

  const selectProps = objectKeepFields(props, ["disabled", "multiple", "name", "required", "size", "value"]);
  const [field] = useField(props);

  return (
    <Form.Control
      as="select"
      {...selectProps}
      {...field}
    >
      {renderChildren(id, props)}
    </Form.Control>
  );
}

/**
 * Renders out the children of the select element given the id and props.
 * @param id The id of the select calling this function
 * @param props The props argument of the select element
 */
function renderChildren(id: string, props: any) {
  const options = def<object[]>(props.options, []);
  const labelKey = def<string>(props.labelKey, "label");
  const valueKey = def<string>(props.valueKey, "value");
  const emptyText = def<string>(props.emptyText, "-- Select One --");

  let children: any = [];

  if (props.includeEmpty !== false) {
    children.push(<option value="">{emptyText}</option>);
  }

  if (props.children === undefined) {
    let index = 0;
    options.forEach((option: any) => {
      children.push(
        <option key={id + "_" + index++} value={option[valueKey]}>{option[labelKey]}</option> , 
      );
    });
  } else {
    children = children.concat(props.children);
  }
  return children;
}