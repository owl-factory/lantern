// Describes a component function that takes in a row of data and returns an element
export type TableComponent = (data: any, globalData?: any) => (JSX.Element);

export interface Column {
  header: string; // The header title of the column
  key?: string; // The key of the data to print
  modification?: (value: any) => string; // A modification to apply to the value of key
  component?: TableComponent; // A custom component to print using the row data
  increment?: boolean; // True if this column should increment
}