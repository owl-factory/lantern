/**
 * The various different types of atoms that we may use to render out 
 * dyanmic layouts. It is split into different sections to keep organized 
 * as this list grows. 
 */
export enum AtomType {
  // Static
  Text = 1000,
  LabeledText,

  // Unorganized 
  Action = 5000,
  MultiselectInput,
  SelectInput,
  TernaryInput,
  TextInput,
  Submit,
};