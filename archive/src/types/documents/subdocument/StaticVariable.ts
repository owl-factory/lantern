// A list of the scalar types used by static variables
export enum StaticVariableScalarType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
}

// A list of the complex types used by the static variables
export enum StaticVariableComplexType {
  Object = "object",
  StringArray = "string_arr",
  NumberArray = "number_arr",
  BooleanArray = "boolean_arr",
  ObjectArray = "object_arr",
}

// A combination of the two static variable enums
export type StaticVariableType = StaticVariableScalarType | StaticVariableComplexType;

// Shorthand for a scalar static variable type
type Scalar = string | number | boolean;

// The static variable subdocument used to track variables, their names, and values
export interface StaticVariableMetadata {
  name: string; // The human readable name of the static variable
  key: string; // The variable name of the static variable for accessing in code
  description: string; // A description for better conveying the idea of what this does
  variableType: StaticVariableType; // The type of value stored in this static variable
  objectType?: Record<string, StaticVariableScalarType>; // A definition of the object(s) stored within this variable
}

// Describes a type of data that can be used within a static variable
export type StaticVariableValue = (
  Scalar |
  Record<string, Scalar> |
  string[] |
  number[] |
  boolean[] |
  Record<string, Scalar>[]
);

// Combines the static variable data into a single object for keeping the base object clean
// and grouping shared data together
export interface StaticVariables {
  metadata: Record<string, StaticVariableMetadata>;
  values: Record<string, StaticVariableValue>;
}
