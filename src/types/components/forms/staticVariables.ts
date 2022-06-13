import { StaticVariableScalarType } from "types/documents/subdocument/StaticVariable";

export interface StaticVariableObject {
  key: string;
  oldKey?: string;
  type: StaticVariableScalarType;
  value: string | number | boolean;
}

// Scaffolding values for making processing of the different form options easier to do
export interface StaticVariableFormValues {
  oldKey: string;

  value_string: string;
  value_number: number;
  value_boolean: boolean;
  value_obj: StaticVariableObject[];
  value_arr_string: string[];
  value_arr_number: number[];
  value_arr_boolean: boolean[];
  value_arr_obj: StaticVariableObject[][];

  arr_object_type: StaticVariableObject[];
}
