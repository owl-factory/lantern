import { DataType, Value } from "ts-postgres";

export type QueryParam = (string | ComplexQueryParam);

export interface ComplexQueryParam {
  value: Value;
  dataType: DataType;
}

// Describes a mapping of fields to their postgres data types, allowing for conversion
export type ConversionMap<T> = Record<keyof T | string, DataType>;
