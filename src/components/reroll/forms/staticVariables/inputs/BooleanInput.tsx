import { Checkbox } from "@owl-factory/components/form";
import React, { ChangeEvent } from "react";

interface StaticVariableScalarInputProps {
  name?: string;
  onBlur?: (e: ChangeEvent<any>) => void;
}

/**
 * A checkbox input for visualizing a boolean input
 * @param name The custom name of the field, if any
 * @param onBlur A custom function to run when the input is no longer focused
 */
export function StaticVariableBooleanInput(props: StaticVariableScalarInputProps) {
  return (
    <Checkbox name={props.name || "value_boolean"} value="true" onChange={props.onBlur}/>
  );
}
