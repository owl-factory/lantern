import { GenericDocumentType } from "@reroll/model/dist/documents";

// Describes a component function that takes in a row of data and returns an element
export type TableDataType = GenericDocumentType | Record<string, unknown>;

export interface TableComponentProps {
  data: Record<string, unknown>,
  globalData?: Record<string, unknown>;
}
export type TableComponent = (props: TableComponentProps) => (JSX.Element);

export type TableComponentModification = (value: string | boolean) => string;

export interface Column {
  header: string; // The header title of the column
  key?: string; // The key of the data to print
  modification?: TableComponentModification; // A modification to apply to the value of key
  component?: TableComponent; // A custom component to print using the row data
  increment?: boolean; // True if this column should increment
}