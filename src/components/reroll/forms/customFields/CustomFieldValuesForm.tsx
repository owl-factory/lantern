import React from "react";
import { CustomFieldType } from "types/enums/subdocument/CustomFieldType";

const ALLOWED_FIELD_TYPES = [CustomFieldType.Select, CustomFieldType.NumberSelect, CustomFieldType.Multiselect];

export function CustomFieldValuesForm(props: any) {
  if (!ALLOWED_FIELD_TYPES.includes(props.field.type)) { return <></>; }

  return (
    <></>
  );
}
