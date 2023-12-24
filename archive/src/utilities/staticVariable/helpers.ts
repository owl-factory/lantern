import { StaticVariableFormValues, StaticVariableObject } from "types/components/forms/staticVariables";
import {
  StaticVariableComplexType,
  StaticVariableMetadata,
  StaticVariableScalarType,
  StaticVariableValue,
} from "types/documents/subdocument/StaticVariable";


/**
 * Builds initial values from the default starting static variable values
 * @param value The given static variable to build initial values from
 */
export function buildInitialValues(value: StaticVariableValue, metadata: StaticVariableMetadata) {
  const initialValues: StaticVariableMetadata & StaticVariableFormValues = {
    ...metadata,
    oldKey: metadata.key,
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

  switch (metadata.variableType) {
    case StaticVariableScalarType.String:
      initialValues.value_string = value as string;
      break;
    case StaticVariableScalarType.Number:
      initialValues.value_number = value as number;
      break;
    case StaticVariableScalarType.Boolean:
      initialValues.value_boolean = value as boolean;
      break;
    case StaticVariableComplexType.Object:
      if (!metadata.objectType) { break; }
      keys = Object.keys(metadata.objectType).sort();
      for (const key of keys) {
        const objectValue: StaticVariableObject = {
          key,
          type: metadata.objectType[key],
          value: (value as any)[key],
        };
        initialValues.value_obj.push(objectValue);
      }
      break;
    case StaticVariableComplexType.StringArray:
      initialValues.value_arr_string = value as string[];
      break;
    case StaticVariableComplexType.NumberArray:
      initialValues.value_arr_number = value as number[];
      break;
    case StaticVariableComplexType.BooleanArray:
      initialValues.value_arr_boolean = value as boolean[];
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
export function processStaticValues(values: StaticVariableMetadata & StaticVariableFormValues) {
  let value: StaticVariableValue = "";
  switch (values.variableType) {
    case StaticVariableScalarType.String:
      value = values.value_string;
      delete values.objectType;
      break;
    case StaticVariableScalarType.Number:
      value = values.value_number;
      delete values.objectType;
      break;
    case StaticVariableScalarType.Boolean:
      value = values.value_boolean;
      delete values.objectType;
      break;
    case StaticVariableComplexType.Object:
      values.objectType = {};
      value = {};
      for (const objectValue of values.value_obj) {
        values.objectType[objectValue.key] = objectValue.type;
        value[objectValue.key] = objectValue.value;
      }
      break;
    case StaticVariableComplexType.StringArray:
      value = values.value_arr_string;
      delete values.objectType;
      break;
    case StaticVariableComplexType.NumberArray:
      value = values.value_arr_number;
      delete values.objectType;
      break;
    case StaticVariableComplexType.BooleanArray:
      value = values.value_arr_boolean;
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
  const metadata: StaticVariableMetadata = {
    name: values.name,
    key: values.key,
    description: values.description,
    variableType: values.variableType,
    objectType: values.objectType,
  };

  return { metadata, value };
}
