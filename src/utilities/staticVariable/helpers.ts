import { StaticVariableFormValues, StaticVariableObject } from "types/components/forms/staticVariables";
import {
  StaticVariable,
  StaticVariableComplexType,
  StaticVariableScalarType,
} from "types/documents/subdocument/StaticVariable";


/**
 * Builds initial values from the default starting static variable values
 * @param staticVariable The given static variable to build initial values from
 */
export function buildInitialValues(staticVariable: StaticVariable) {
  const initialValues: StaticVariable & StaticVariableFormValues = {
    ...staticVariable,
    oldKey: staticVariable.key,
    value_string: "",
    value_number: 0,
    value_boolean: false,
    value_obj: [],
    value_arr_string: [],
    value_arr_number: [],
    value_arr_boolean: [],
    value_arr_obj: [],
    arr_object_type: [],
  };

  let keys: string[];

  switch (staticVariable.variableType) {
    case StaticVariableScalarType.String:
      initialValues.value_string = staticVariable.value as string;
      break;
    case StaticVariableScalarType.Number:
      initialValues.value_number = staticVariable.value as number;
      break;
    case StaticVariableScalarType.Boolean:
      initialValues.value_boolean = staticVariable.value as boolean;
      break;
    case StaticVariableComplexType.Object:
      if (!staticVariable.objectType) { break; }
      keys = Object.keys(staticVariable.objectType).sort();
      for (const key of keys) {
        const value: StaticVariableObject = {
          key,
          type: staticVariable.objectType[key],
          value: (staticVariable.value as any)[key],
        };
        initialValues.value_obj.push(value);
      }
      break;
    case StaticVariableComplexType.StringArray:
      initialValues.value_arr_string = staticVariable.value as string[];
      break;
    case StaticVariableComplexType.NumberArray:
      initialValues.value_arr_number = staticVariable.value as number[];
      break;
    case StaticVariableComplexType.BooleanArray:
      initialValues.value_arr_boolean = staticVariable.value as boolean[];
      break;
    case StaticVariableComplexType.ObjectArray:
      // TODO - implement object array
      // if (!staticVariable.objectType) { break; }
      // keys = Object.keys(staticVariable.objectType).sort();
      // for (const key of keys) {
      //   const value: StaticVariableObject = {
      //     key,
      //     type: staticVariable.objectType[key],
      //     value: (staticVariable.value as any)[key],
      //   };
      //   initialValues.arr_object_type.push(value);
      // }
      // initialValues.value_arr_obj = staticVariable.value;
      break;
  }
  return initialValues;
}

/**
 * Processes the raw values from the static variable form. Removes all scaffolding values
 * @param values The values from the StaticVariable form to process
 * @returns The processed and cleaned static variable values
 */
export function processStaticValues(values: StaticVariable & StaticVariableFormValues) {
  switch (values.variableType) {
    case StaticVariableScalarType.String:
      values.value = values.value_string;
      delete values.objectType;
      break;
    case StaticVariableScalarType.Number:
      values.value = values.value_number;
      delete values.objectType;
      break;
    case StaticVariableScalarType.Boolean:
      values.value = values.value_boolean;
      delete values.objectType;
      break;
    case StaticVariableComplexType.Object:
      values.objectType = {};
      values.value = {};
      for (const value of values.value_obj) {
        values.objectType[value.key] = value.type;
        values.value[value.key] = value.value;
      }
      break;
    case StaticVariableComplexType.StringArray:
      values.value = values.value_arr_string;
      delete values.objectType;
      break;
    case StaticVariableComplexType.NumberArray:
      values.value = values.value_arr_number;
      delete values.objectType;
      break;
    case StaticVariableComplexType.BooleanArray:
      values.value = values.value_arr_boolean;
      delete values.objectType;
      break;
    case StaticVariableComplexType.ObjectArray:
      // TODO - implement object array
      // values.objectType = {};
      // for (const value of values.arr_object_type) {
      //   values.objectType[value.key] = value.type;
      // }
      // console.log(values.objectType)
      // values.value = values.value_arr_obj;
      break;
  }

  // Packages up the values into a static variable
  const staticVariable: StaticVariable = {
    name: values.name,
    key: values.key,
    description: values.description,
    variableType: values.variableType,
    objectType: values.objectType,
    value: values.value,
  };

  return staticVariable;
}
