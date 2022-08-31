import { DataType, Value } from "ts-postgres";

// Describes a parameter to be passed along in a query.
// Values can be either a plain text string or a complex query parameter which holds the value and type
export type QueryParam = (string | ComplexQueryParam);

// Holds the value and value type of a parameter to be passed into a query
export interface ComplexQueryParam {
  value: Value;
  dataType: DataType;
}

// Describes a mapping of fields to their postgres data types, allowing for conversion
export type ConversionMap<T> = Record<keyof T | string, DataType>;
