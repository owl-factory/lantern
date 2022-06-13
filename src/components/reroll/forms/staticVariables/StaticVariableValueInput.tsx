import React from "react";
import {
  StaticVariable,
  StaticVariableComplexType,
  StaticVariableScalarType,
  StaticVariableType,
} from "types/documents/subdocument/StaticVariable";
import { StaticVariableScalarArrayInput } from "./inputs/ScalarArrayInput";
import { StaticVariableBooleanInput } from "./inputs/BooleanInput";
import { StaticVariableNumberInput } from "./inputs/NumberInput";
import { StaticVariableObjectInput } from "./inputs/ObjectInput";
import { StaticVariableTextInput } from "./inputs/TextInput";
import { ObjectValueType, StaticVariableFormValues } from "./StaticVariableForm";
import { StaticVariableObjectArrayInput } from "./inputs/ObjectArrayInput";

interface StaticVariableValueInputProps {
  staticVariable: StaticVariable & StaticVariableFormValues;
  setStaticVariableField: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

export function StaticVariableValueInput(props: StaticVariableValueInputProps) {
  if (!props.staticVariable) { return <></>; }
  switch (props.staticVariable.variableType) {
    case StaticVariableScalarType.String:
      return <StaticVariableTextInput/>;
    case StaticVariableScalarType.Number:
      return <StaticVariableNumberInput/>;
    case StaticVariableScalarType.Boolean:
      return <StaticVariableBooleanInput/>;
    case StaticVariableComplexType.Object:
      return (
        <StaticVariableObjectInput
          staticVariable={props.staticVariable}
          setStaticVariableValueObject={(val: ObjectValueType[]) => props.setStaticVariableField("value_obj", val)}
        />
      );
    case StaticVariableComplexType.BooleanArray:
    case StaticVariableComplexType.NumberArray:
    case StaticVariableComplexType.StringArray:
      return (
        <StaticVariableScalarArrayInput
          staticVariable={props.staticVariable}
          setStaticVariableField={props.setStaticVariableField}
        />
      );
    case StaticVariableComplexType.ObjectArray:
      return (
        <StaticVariableObjectArrayInput
          staticVariable={props.staticVariable}
          setStaticVariableField={props.setStaticVariableField}
        />
      );
    default:
      return <></>;
  }
}
