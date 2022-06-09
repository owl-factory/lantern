import { Checkbox } from "@owl-factory/components/form";
import React from "react";

interface StaticVariableBooleanInputProps {
  name?: string;
}


export function StaticVariableBooleanInput(props: StaticVariableBooleanInputProps) {
  return (
    <Checkbox name={props.name || "value_boolean"} value="1"/>
  );
}
