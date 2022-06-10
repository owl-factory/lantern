import { Input } from "@owl-factory/components/form";
import React, { ChangeEvent } from "react";

interface StaticVariableScalarInputProps {
  name?: string;
  onBlur?: (e: ChangeEvent<any>) => void;
}

/**
 * Renders a text input for the static variable value
 * @param name The custom name of the text input
 * @param onBlur A custom function to run when the input loses focus
 */
export function StaticVariableTextInput(props: StaticVariableScalarInputProps) {
  return (
    <Input type="text" name={props.name || "value_string"} onBlur={props.onBlur}/>
  );
}
