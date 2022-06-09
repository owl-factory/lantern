import React from "react";
import {
  StaticVariableComplexType,
  StaticVariableScalarType,
  StaticVariableType,
} from "types/documents/subdocument/StaticVariable";
import { StaticVariableArrayInput } from "./inputs/ArrayInput";
import { StaticVariableBooleanInput } from "./inputs/BooleanInput";
import { StaticVariableNumberInput } from "./inputs/NumberInput";
import { StaticVariableObjectInput } from "./inputs/ObjectInput";
import { StaticVariableObjectTypeInput } from "./inputs/ObjectTypeInput";
import { StaticVariableTextInput } from "./inputs/TextInput";

interface StaticVariableValueInputProps {
  variableType: StaticVariableType;
}

export function StaticVariableValueInput(props: StaticVariableValueInputProps) {
  switch (props.variableType) {
    case StaticVariableScalarType.String:
      return <StaticVariableTextInput/>;
    case StaticVariableScalarType.Number:
      return <StaticVariableNumberInput/>;
    case StaticVariableScalarType.Boolean:
      return <StaticVariableBooleanInput/>;
    case StaticVariableComplexType.Object:
      return (
        <>
          <StaticVariableObjectTypeInput/>
          <StaticVariableObjectInput/>
        </>
      );
    case StaticVariableComplexType.BooleanArray:
    case StaticVariableComplexType.NumberArray:
    case StaticVariableComplexType.StringArray:
      return <StaticVariableArrayInput/>;
    case StaticVariableComplexType.ObjectArray:
      return (
        <>
          <StaticVariableObjectTypeInput/>
          <StaticVariableArrayInput/>
        </>
      );
    default:
      return <></>;
  }
}
