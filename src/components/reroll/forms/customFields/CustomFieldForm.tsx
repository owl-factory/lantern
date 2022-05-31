
import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { Formik, FormikProps } from "formik";
import React from "react";
import { CustomField } from "types/documents/subdocument/CustomField";
import { ReadableCustomFieldType } from "types/enums/subdocument/CustomFieldType";
import { CustomSelectValuesForm } from "./CustomSelectValuesForm";

/**
 * Renders the options for a custom field type select element
 */
function CustomFieldTypeOptions() {
  const options: JSX.Element[] = [];
  const keys = Object.keys(ReadableCustomFieldType);
  for (const key of keys) {
    options.push(<option key={key} value={key}>{(ReadableCustomFieldType as any)[key]}</option>);
  }

  return <>{options}</>;
}

interface FieldFormProps {
  selected: string | undefined;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  fields: Record<string, Partial<CustomField> | null>;
  setFields: React.Dispatch<React.SetStateAction<Record<string, Partial<CustomField> | null>>>;
}

/**
 * Renders the form to edit custom fields
 * @param selected The key of the currently selected custom field
 * @param setSelected The function to update the currently selected custom field
 * @param fields The full dictionary of custom fields
 * @param setField The function to update the custom fields in the previous form
 */
export function FieldForm(props: FieldFormProps) {
  if (!props.selected) { return <div style={{flexGrow: 1}}></div>; }
  const field = props.fields[props.selected];
  if (!field) { return <div style={{flexGrow: 1}}></div>; }

  /**
   * Saves the changes to the custom field
   * @param values The values of the custom field to set
   */
  function onSubmit(values: Partial<CustomField>) {
    if (!values.uuid) { return; }
    props.fields[values.uuid] = values;
    props.setFields(props.fields);
    props.setSelected(undefined);
  }

  return (
    <div style={{flexGrow: 1}}>
      <Formik
        initialValues={field}
        onSubmit={onSubmit}
      >
        {(formikProps: FormikProps<any>) => {
          if (formikProps.values.uuid !== props.selected) {
            formikProps.setValues(field);
          }
          return (
            <>
              <Input type="text" name="name" label="Label"/>
              <Input type="text" name="key" label="Key"/>
              <label htmlFor="type">Field Type</label>
              <Select name="type" id="type">
                <CustomFieldTypeOptions/>
              </Select>

              <CustomSelectValuesForm
                type={formikProps.values.type}
                selectValues={formikProps.values.selectValues || []}
                setSelectValues={(values: any) => formikProps.setFieldValue("selectValues", values)}
              />

              <Button type="button" onClick={() => props.setSelected(undefined)}>Cancel</Button>
              <Button
                type="button"
                onClick={() => onSubmit(formikProps.values)}
              >
                Save
              </Button>
            </>
          );
        }}
      </Formik>
    </div>
  );
}
