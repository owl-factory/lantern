import React from "react";
import { CustomField } from "types/documents/subdocument/CustomField";
import { FieldForm } from "./CustomFieldForm";
import { FieldList } from "./CustomFieldList";


interface CustomFieldInputProps {
  field: string;
  onChange: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  values: Record<string, unknown>;
}

/**
 * Renders a input for creating, updating, and deleting custom fields
 * @param field The name of the custom field
 * @param onChange The function to run when the custom fields are changed
 * @param values The full list of values from the parent form
 */
export function CustomFieldInput(props: CustomFieldInputProps) {
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  const setField = (newValue: any) => props.onChange(props.field, newValue);
  const fields = props.values[props.field] as Record<string, Partial<CustomField>>;

  if (!fields) { setField({}); }

  return (
    <div>
      <h2>Custom Fields</h2>
      <div style={{display: "flex"}}>
        <FieldList selected={selected} setSelected={setSelected} setField={setField} fields={fields}/>
        <FieldForm selected={selected} setSelected={setSelected} setField={setField} fields={fields}/>
      </div>
    </div>
  );
}
