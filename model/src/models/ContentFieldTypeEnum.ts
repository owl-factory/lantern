
// The enum for getting ContentFieldTypes
export enum ContentFieldTypeEnum {
  Text,
  Number,
  Roll,
  Boolean,
  Options
}

// An array containing any additional information for the Content Field Types indexed
// with the ContentFieldTypeEnum. 
export const contentFieldTypes = [
  { name: "Text", value: ContentFieldTypeEnum.Text, default: "" },
  { name: "Number", value: ContentFieldTypeEnum.Number, default: 0 },
  { name: "Dice Roll", value: ContentFieldTypeEnum.Roll, default: "" },
  { name: "True / False", value: ContentFieldTypeEnum.Boolean, default: false },
  { name: "Options", value: ContentFieldTypeEnum.Options, default: "" },
]