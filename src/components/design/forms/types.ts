type Size = (
  true |
  "auto" |
  number |
  { span: true | "auto" | number; offset: number; order: number }
);

interface SharedColumnProps {
  xs?: Size; // Width for extra small screens
  sm?: Size; // Width for small screens
  md?: Size; // Width for extra medium screens
  lg?: Size; // Width for large screens
  xl?: Size; // Width for extra large screens

  helperText?: string; // Accessibility text
}

export interface FieldProps extends SharedColumnProps {
  id?: string; // The input id
  label?: string; // The label of the inputs

  error?: string;
  message?: string;
}
