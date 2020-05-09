/* eslint-disable @typescript-eslint/no-use-before-define */
import React from "react";
import { Col, Form, InputGroup } from "react-bootstrap"
import { def, objectKeepFields } from "../../../helpers/tools";
import { FieldProps } from "./types";
import { $gridItemPropFields, $renderMessage } from "./Forms";

export interface InputProps extends FieldProps {
  name: string; // The name of the input
  
  id?: string;
  label?: string;

  onChange?: (event: object) => void; // The event that occurs on change
  placeholder?: string; // A placeholder value for when the input is empty

  prependChildren?: any; // The children to put down before the input
  appendChildren?: any; // The children to put down after the input

  
  ariaLabel?: string; // The usability label
  append?: any; // The text to place at the end of the input box
  prepend?: any; // The text to prepend to the input box
  required?: boolean; // If this is required or not
  size?: "sm" | "lg";

  as?: string; // Controls what the input is seen as
  defaultValue?: string; // The default value to start with (if given no value)
  disabled?: boolean; // If an input is disabled or not
  inputLabelProps?: object; // Props to apply to the input label
  multiline?: string; // Allows for creating text areas
  rows?: number; // The number of rows (multiline must be true)
  type?: string; // The ???
  value?: string; // The value of the input

  getError?: (name: string) => (string); // Grabs errors for the given name
}

/**
 * Renders out a grid-based input block
 * @param props see IInput
 */
export function Input(props: InputProps) {
  const id = def<string>(props.id, props.name);
  const helperTextID = id + "_helper";

  const inputProps = objectKeepFields(
    props,
    ["as", "disabled", "multiline", "name", "placeholder", "required", "rows", "type", "value"],
  );

  return (
    <InputGroup size={props.size}> 
      {props.prependChildren}       
      {renderInputContent("prepend", props.prepend)}
      <Form.Control  
        {...inputProps}
        id={id}
        aria-label={props.ariaLabel}
        onChange={props.onChange}
      />
      {renderInputContent("prepend", props.prepend)}
      {props.appendChildren}
    </InputGroup>
  );
}

/**
 * Adds text to the end of the input box
 */
function renderInputContent(position: "prepend" | "append", children: any) {
  if (children === undefined) {
    return null;
  }

  const content = renderInputGroupContent(children);

  switch (position) {
    case "prepend":
      return <InputGroup.Prepend>{content}</InputGroup.Prepend>;
    case "append": 
      return <InputGroup.Append>{content}</InputGroup.Append>;
  }
}


/**
 * Parses the content into a useable 
 * @param content The content to render within the prepend or append of the input
 * TODO - typing!
 */
function renderInputGroupContent(content: any) {
  const contentType = typeof content;

  if (Array.isArray(content)) {
    const contentGroup: any[] = [];
    content.forEach((item: any) => {
      contentGroup.push(renderInputGroupContent(item));
    });
    return contentGroup;
  }

  switch (contentType) {
    case "string":
    case "number":
      return <InputGroup.Text>{content}</InputGroup.Text>
    case "object":
      return content;
  }

  return null;
}