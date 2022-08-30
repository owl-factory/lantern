import { DataType, Value } from "ts-postgres";

export type QueryParam = (string | ComplexQueryParam);

export interface ComplexQueryParam {
  value: Value;
  dataType: DataType;
}
