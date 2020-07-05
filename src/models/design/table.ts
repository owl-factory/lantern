export type TableComponent = (data: any) => (JSX.Element);

export interface Column {
  header: string;
  key?: string;
  component?: TableComponent;
  increment?: boolean;
}