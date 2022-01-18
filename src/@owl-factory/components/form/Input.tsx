import { useField } from "formik";
import React, { CSSProperties } from "react";

interface InputProps {
  disabled?: boolean;
  label?: string;
  id?: string;
  name: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
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

  // Build the input here so we can return it solo or put it into a floating label
  const input = (
    <input
      type={props.type}
      className="form-control" // TODO - add other classes?
      disabled={props.disabled}
      id={props.id || props.name}
      placeholder={props.placeholder || " "}
      style={props.style}
      {...field}

    />
  );

  if (!props.label) { return input; }

  return (
    <div className="form-floating">
      {input}
      <label htmlFor={props.id || props.name}>{props.label}</label>
    </div>
  );
}
