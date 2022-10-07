import { useField } from "formik";
import React, { CSSProperties } from "react";
import { Input as ChakraInput } from "@chakra-ui/react";

interface InputProps {
  disabled?: boolean;
  label?: string;
  id?: string;
  name: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.ChangeEvent<any>) => void;
  placeholder?: string;
  style?: CSSProperties;
  type: "text" | "password" | "email" | "number" | "textarea"
}

/**
 * Creates a Bootstrap 5 input and returns it
 * @param disabled True if the input should be disabled
 * @param label The optional label of the input. Adding this makes the input a floating label
 * @param id The id of the input. The default is the input name
 * @param name The name of the input. Required.
 * @param onChange The action to run when the input is changed
 * @param placeholder The placeholder text to show while the input is empty
 * @param style Any inline styles of the input
 * @param type The type of input that this is
 * @returns Returns a bootstrap input
 */
export function Input(props: InputProps) {
  // Makes Formik work right
  const [ field ] = useField(props);

  if (props.onBlur !== undefined) { field.onBlur = props.onBlur; }

  return (
    <ChakraInput
      type={props.type}
      disabled={props.disabled}
      id={props.id || props.name}
      placeholder={props.placeholder || " "}
      style={props.style}
      {...field}
    />
  );
}
