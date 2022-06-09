import { Input } from "@owl-factory/components/form";
import React from "react";

interface StaticVariableTextInputProps {
  name?: string;
}

export function StaticVariableTextInput(props: StaticVariableTextInputProps) {
  return (
    <Input type="text" name={props.name || "value_string"}/>
  );
}
