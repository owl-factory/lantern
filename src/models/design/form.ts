import { ReactNode } from "react";

/**
 * Valid values usable by the Size arguments
 */
type Size = (
  true |
  "auto" |
  number |
  { span: true | "auto" | number; offset: number; order: number }
);


/**
 * Contains the props for denoting width of an input. Used in all fields
 */
interface SharedColumnProps {
  xs?: Size; // Width for extra small screens
  sm?: Size; // Width for small screens
  md?: Size; // Width for extra medium screens
  lg?: Size; // Width for large screens
  xl?: Size; // Width for extra large screens
}

/**
 * Props shared by all fields
 */
export interface FieldProps extends SharedColumnProps {
  id?: string; // The input id
  label?: string; // The label of the inputs
}

/**
 * Core fields used by all inputs. 
 */
export interface CoreInputProps extends FieldProps {
  "aria-label"?: string; // The usability label
  disabled?: boolean; // If an input is disabled or not
  name: string; // The name of the input
  placeholder?: string; // A placeholder value for when the input is empty
  
  size?: "sm" | "lg"; // The bootstrap size of the input
}

export interface CoreFormCheckProps extends FieldProps {
  "aria-label"?: string; // The usability label
  children?: ReactNode;
  disabled?: string;
  name: string;
}



