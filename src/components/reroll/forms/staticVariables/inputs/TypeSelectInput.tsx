import { Select } from "@owl-factory/components/form";
import React from "react";
import { StaticVariableScalarType } from "types/documents/subdocument/StaticVariable";

interface TypeSelectInputProps {
  onBlur: () => void
}

export function TypeSelectInput(props: TypeSelectInputProps) {
  return (
    <Select name="type" onBlur={props.onBlur}>
      <option value={StaticVariableScalarType.String}>Text</option>
      <option value={StaticVariableScalarType.Number}>Number</option>
      <option value={StaticVariableScalarType.Boolean}>True/False</option>
    </Select>
  );
}
