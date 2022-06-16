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
import { StaticVariableObjectArrayInput } from "./inputs/ObjectArrayInput";
import { StaticVariableFormValues, StaticVariableObject } from "types/components/forms/staticVariables";

interface StaticVariableValueInputProps {
  staticVariable: StaticVariable & StaticVariableFormValues;
  setStaticVariableField: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

/**
 * Renders the appropriate input for the static variable value depending on the currently selected type
 * @param staticVariable The active static variable being modified
 * @param setStaticVariableField A function to set a single field in the static variable
 */
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
          objectValues={props.staticVariable.value_obj}
          setObjectValue={(val: StaticVariableObject[]) => props.setStaticVariableField("value_obj", val)}
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
