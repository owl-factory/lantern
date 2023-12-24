import { StaticVariableScalarType } from "types/documents/subdocument/StaticVariable";

export interface StaticVariableObject {
  key: string; // The key used to store and access this variable
  oldKey?: string; // A key used to keep track of the previous key
  type: StaticVariableScalarType;
  value: string | number | boolean;
}

// Scaffolding values for making processing of the different form options easier to do.
// No data here should be saved and should instead be used for processing
export interface StaticVariableFormValues {
  oldKey: string; // Tracks the previous key of this static variable to aid with updating

  value_string: string; // The field used for storing the string value for the string scalar type
  value_number: number; // The field used for storing the number value for the number scalar type
  value_boolean: boolean; // The field used for storing the boolean value for the boolean scalar type
  value_obj: StaticVariableObject[]; // The field used for storing the object value for the object complex type
  value_arr_string: string[]; // The field used for storing a list of strings for the StringArray type
  value_arr_number: number[]; // The field used for storing a list of numbers for the NumberArray type
  value_arr_boolean: boolean[]; // The field used for storing a list of strings for the StringArray type
  value_arr_obj: StaticVariableObject[][]; // The field used for storing a list of objects. TODO - fix!

  arr_object_type: StaticVariableObject[]; // Contains the type used for the value_arr_obj types
}
