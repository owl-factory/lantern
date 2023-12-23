// Describes the different kinds of values that can be used in for custom variables and fields
export enum CustomFieldType {
  Text="text",
  Number="number", // Do we want one that allows decimals?
  Boolean="boolean",
  Select="select", // Select from a list of pre-made values
  NumberSelect="numberselect", // Allows for multiple value selections that are specifically numbers
  Multiselect="multi", // Allows for multiple value selections
}

export const ReadableCustomFieldType = {
  [CustomFieldType.Text]: "Text",
  [CustomFieldType.Number]: "Number",
  [CustomFieldType.Boolean]: "True/False",
  [CustomFieldType.Select]: "Select from Text",
  [CustomFieldType.NumberSelect]: "Select from Numbers",
  [CustomFieldType.Multiselect]: "Select Multiple Values from Text",
};
