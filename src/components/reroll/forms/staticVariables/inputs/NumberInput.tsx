import { Input } from "@owl-factory/components/form";
import React from "react";

interface StaticVariableNumberInputProps {
  name?: string;
}

export function StaticVariableNumberInput(props: StaticVariableNumberInputProps) {
  return (
    <Input type="number" name={props.name || "value_number"}/>
  );
}
