
// The enum for getting ContentFieldTypes
export enum FieldTypeEnum {
  Text = 0,
  Number,
  Roll,
  Boolean,
  Options
}



// An array containing any additional information for the Content Field Types indexed
// with the ContentFieldTypeEnum.
// export const fieldTypes = [
//   { name: "Text", value: 0, default: "" },
//   { name: "Number", value: 0, default: 0 },
//   { name: "Dice Roll", value: 0, default: "" },
//   { name: "True / False", value: 0, default: false },
//   { name: "Options", value: 0, default: "" },
// ];

export const fieldTypes = [
  { name: "Text", value: FieldTypeEnum.Text, default: "" },
  { name: "Number", value: FieldTypeEnum.Number, default: 0 },
  { name: "Dice Roll", value: FieldTypeEnum.Roll, default: "" },
  { name: "True / False", value: FieldTypeEnum.Boolean, default: false },
  { name: "Options", value: FieldTypeEnum.Options, default: "" },
];
