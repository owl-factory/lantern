import { Input } from "@owl-factory/components/form";
import React, { ChangeEvent } from "react";

interface StaticVariableScalarInputProps {
  name?: string;
  onBlur?: (e: ChangeEvent<any>) => void;
}

/**
 * Renders a number input for the static variable value
 * @param name The custom name of the text input
 * @param onBlur A custom function to run when the input loses focus
 */
export function StaticVariableNumberInput(props: StaticVariableScalarInputProps) {
  return (
    <Input type="number" name={props.name || "value_number"} onBlur={props.onBlur}/>
  );
}
